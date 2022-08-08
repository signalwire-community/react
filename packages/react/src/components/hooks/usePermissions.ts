import { RoomSession } from "@signalwire/js/dist/js/src/RoomSession";

export default function usePermissions(tokenProvider: RoomSession | string) {
  const token =
    typeof tokenProvider === "string"
      ? tokenProvider
      : (tokenProvider as any).token;
  if (token === undefined || token === null) return null;
}
