import { useEffect, useState } from "react";
import { Video } from "@signalwire/js";
import jwt_decode from "jwt-decode";

function makeBarePermissionObject(permString: string[]) {
  let permObject = {};
  let permElements = permString.map((perm) => perm.split(".").splice(1));
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

  P.self.audio = P.self.audio_mute && P.self.audio_unmute;
  P.self.video = P.self.video_mute && P.self.video_unmute;
  P.self.speaker = P.self.deaf && P.self.undeaf;
  P.self.remove = true;

  P.member.audio = P.member.audio_mute && P.member.audio_unmute;
  P.member.video = P.member.video_mute && P.member.video_unmute;
  P.member.speaker = P.member.deaf && P.member.undeaf;

  P.layout = P.list_available_layouts && P.set_layout;
  return P;
}

export default function usePermissions(
  tokenProvider: Video.RoomSession | string | null
) {
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
