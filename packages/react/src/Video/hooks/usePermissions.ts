import { CallSession } from "@signalwire/client";
import { useEffect, useState } from "react";

function makeBarePermissionObject(permString: string[]) {
  const permObject = {};
  let permElements = permString.map((perm) => perm.split(".").splice(1));
  permElements = permElements.filter((x) => x.length > 0);
  permElements.forEach((perm) => {
    addPerm(perm, permObject);
    function addPerm(perm: string[], permObj: any) {
      if (perm.length === 1) permObj[perm[0]] = true;
      else {
        if (permObj[perm[0]] === undefined) permObj[perm[0]] = {};
        addPerm(perm.splice(1), permObj[perm[0]]);
      }
    }
  });

  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (typeof target[prop] === "object")
        return new Proxy(target[prop], handler);
      else if (target[prop] === undefined) return false;
      return target[prop];
    },
  };

  return new Proxy(permObject, handler);
}

function decoratePermissionObject(P_bare: any) {
  if (!(typeof P_bare === "object")) return {};
  const P = JSON.parse(JSON.stringify(P_bare)); // Deep copy for small object

  if (P.self) {
    P.self.audio_full = (P.self.audio_mute && P.self.audio_unmute) ?? false;
    P.self.video_full = (P.self.video_mute && P.self.video_unmute) ?? false;
    P.self.speaker_full = (P.self.deaf && P.self.undeaf) ?? false;
    P.self.remove = true;
  }

  if (P.member) {
    P.member.audio_full =
      (P.member.audio_mute && P.member.audio_unmute) ?? false;
    P.member.video_full =
      (P.member.video_mute && P.member.video_unmute) ?? false;
    P.member.speaker_full = (P.member.deaf && P.member.undeaf) ?? false;
  }

  P.layout = (P.list_available_layouts && P.set_layout) ?? false;
  return P;
}

function permissionsFromList(scopes: string[]) {
  const barePermissionObj = makeBarePermissionObject(scopes ?? []);
  return decoratePermissionObject(barePermissionObj);
}

/**
 * Given a RoomSession, returns the set of current permissions.
 * @param `RoomSession` or `null`
 * @returns an object with allowed permissions. Eg: `{ screenshare:false, self: {audio_mute: true, ... }, ... }`
 */
function usePermissions(roomSession: CallSession | any) {
  const [permissions, setPermissions] = useState(permissionsFromList([]));

  useEffect(() => {
    if (!roomSession) return;

    const refreshPermissions = () => {
      const scopes = roomSession?.permissions;
      setPermissions(permissionsFromList(scopes ?? []));
    };

    const onRoomJoined = () => {
      refreshPermissions();
    };
    roomSession.on("room.joined", onRoomJoined);

    // @ts-expect-error "member.promoted" is not public yet
    const onMemberPromoted = (e) => {
      const scopes = e.authorization.room.scopes;
      setPermissions(permissionsFromList(scopes ?? []));
    };
    roomSession.on("member.promoted", onMemberPromoted);

    const onMemberDemoted = () => {
      setPermissions(permissionsFromList([]));
    };
    roomSession.on("member.demoted", onMemberDemoted);

    const onRoomLeft = () => {
      setPermissions(permissionsFromList([]));
    };
    roomSession.on("room.left", onRoomLeft);

    refreshPermissions();

    return () => {
      roomSession.off("room.joined", onRoomJoined);
    };
  }, [roomSession]);

  return permissions;
}

export { usePermissions, makeBarePermissionObject, decoratePermissionObject };
