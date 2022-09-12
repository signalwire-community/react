import { useEffect, useState } from "react";
import { Video } from "@signalwire/js";
import jwt_decode from "jwt-decode";

function makeBarePermissionObject(permString: string[]) {
  let permObject = {};
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
  let handler: ProxyHandler<any> = {
    get(target, prop) {
      if (typeof target[prop] === "object")
        return new Proxy(target[prop], handler);
      else if (target[prop] === undefined) return false;
      return target[prop];
    },
  };
  let proxyPerm = new Proxy(permObject, handler);
  return proxyPerm;
}

function decoratePermissionObject(P_bare: any) {
  if (!(typeof P_bare === "object")) return {};
  let P = JSON.parse(JSON.stringify(P_bare)); //Deep copy for small object

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

/**
 * Given a RoomSession or a room token, parses and simplifies the set of permissions allowed for the user.
 * @param `RoomSession` or `string` (token) or `null`
 * @returns an object with allowed permissions. Eg: `{screenshare:false, self:{audio_mute:true, ...}, ...}`
 */
function usePermissions(tokenProvider: Video.RoomSession | string | null) {
  const [permissions, setPermissions] = useState<any>(null);

  useEffect(() => {
    if (tokenProvider === undefined || tokenProvider === null) return;
    const token =
      typeof tokenProvider === "string"
        ? tokenProvider
        : (tokenProvider as any).__swc_token;
    if (token === undefined || token === null) return;
    let decodedToken: any;
    try {
      decodedToken = jwt_decode(token);
    } catch (e) {
      console.error("Invalid Token (usePermission)");
      return;
    }

    if (decodedToken.s === undefined) return;
    const barePermissionObj = makeBarePermissionObject(decodedToken.s);
    const decoratedPermissionObj = decoratePermissionObject(barePermissionObj);
    setPermissions(decoratedPermissionObj);
  }, [tokenProvider]);

  return permissions;
}

export { usePermissions, makeBarePermissionObject, decoratePermissionObject };
