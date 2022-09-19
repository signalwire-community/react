import { Video } from "@signalwire/js";

export function DeviceChangeButton({
  roomSession,
  kind,
  device,
}: {
  roomSession: Video.RoomSession;
  kind: "camera" | "speaker" | "microphone";
  device: MediaDeviceInfo;
}) {
  return (
    <a
      style={{ display: "block" }}
      href="#"
      onClick={(x) => {
        x.preventDefault();
        if (kind === "camera")
          roomSession.updateCamera({ deviceId: device.deviceId });
        if (kind === "microphone")
          roomSession.updateMicrophone({ deviceId: device.deviceId });
        if (kind === "speaker")
          roomSession.updateSpeaker({ deviceId: device.deviceId });
      }}
    >
      {device.label}
    </a>
  );
}
