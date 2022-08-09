import { RoomSession } from "@signalwire/js/dist/js/src/RoomSession";
import jwt_decode from "jwt-decode";

const allPermissions = [
  "room.hide_video_muted",
  "room.show_video_muted",
  "room.list_available_layouts",
  "room.playback",
  "room.recording",
  "room.set_layout",
  "room.member.audio_mute",
  "room.member.audio_unmute",
  "room.member.deaf",
  "room.member.undeaf",
  "room.member.remove",
  "room.member.set_input_sensitivity",
  "room.member.set_input_volume",
  "room.member.set_output_volume",
  "room.member.video_mute",
  "room.member.video_unmute",
  "room.self.additional_source",
  "room.self.audio_mute",
  "room.self.audio_unmute",
  "room.self.deaf",
  "room.self.undeaf",
  "room.self.screenshare",
  "room.self.set_input_sensitivity",
  "room.self.set_input_volume",
  "room.self.set_output_volume",
  "room.self.video_mute",
  "room.self.video_unmute",
];
const defaultPermissions = [
  "room.self.audio_mute",
  "room.self.audio_unmute",
  "room.self.video_mute",
  "room.self.video_unmute",
  "room.self.deaf",
  "room.self.undeaf",
  "room.self.set_input_volume",
  "room.self.set_output_volume",
  "room.self.set_input_sensitivity",
  "room.self.screenshare",
  "room.self.additional_source",
];

function permissionObjectFromPermissions(permissions: string[]) {
  const [self, member] = ["room.self.", "room.member."].map(
    (prefix: any): any => {
      const [allPrefixPermissions, allowedPrefixPermissions] = [
        allPermissions,
        permissions,
      ].map((list) =>
        list
          .filter((p) => p.startsWith(prefix))
          .map((p) => p.substring(prefix.length))
      );
      const hasPermissions: any = {};
      allPrefixPermissions.forEach(
        (perm) =>
          (hasPermissions[perm] = allowedPrefixPermissions.includes(perm))
      );
      hasPermissions.full = Object.keys(hasPermissions).every(
        (v: string) => hasPermissions[v]
      );
      return hasPermissions;
    }
  );

  const layout = {
    list_available_layouts: permissions.includes("room.list_available_layouts"),
    set_layout: permissions.includes("room.set_layout"),
    full: false,
  };
  layout.full = layout.list_available_layouts && layout.set_layout;

  let permissionObj: any = {
    default:
      defaultPermissions.every((p) => permissions.includes(p)) &&
      Object.keys(self).length === defaultPermissions.length,
    self,
    member,
    layout,
    playback: permissions.includes("room.playback"),
    recording: permissions.includes("room.recording"),
    show_video_muted: permissions.includes("room.show_video_muted"),
    hide_video_muted: permissions.includes("room.hide_video_muted"),
  };

  ["self", "member"].forEach((type) => {
    permissionObj[type].audio = {
      mute: permissionObj[type].audio_mute,
      unmute: permissionObj[type].audio_unmute,
      full: permissionObj[type].audio_mute && permissionObj[type].audio_unmute,
    };
    permissionObj[type].video = {
      mute: permissionObj[type].video_mute,
      unmute: permissionObj[type].video_unmute,
      full: permissionObj[type].video_mute && permissionObj[type].video_unmute,
    };
    permissionObj[type].speaker = {
      mute: permissionObj[type].deaf,
      unmute: permissionObj[type].undeaf,
      full: permissionObj[type].deaf && permissionObj[type].undeaf,
    };
  });

  // This permission is always present, so making it symmetric
  // to permissionObj.member.remove
  permissionObj.self.remove = true;

  permissionObj.full_video_muted =
    permissionObj.show_video_muted && permissionObj.hide_video_muted;
  permissionObj.full =
    self.full &&
    member.full &&
    layout.full &&
    permissionObj.playback &&
    permissionObj.recording &&
    permissionObj.full_video_muted;

  return permissionObj;
}

export default function usePermissions(tokenProvider: RoomSession | string) {
  const token =
    typeof tokenProvider === "string"
      ? tokenProvider
      : (tokenProvider as any).token;
  if (token === undefined || token === null) return null;
  let decodedToken: any;
  try {
    decodedToken = jwt_decode(token);
  } catch (e) {
    console.error("Invalid Token (useHook)");
    return null;
  }

  if (decodedToken.s === undefined) return null;
  return permissionObjectFromPermissions(decodedToken.s);
}
