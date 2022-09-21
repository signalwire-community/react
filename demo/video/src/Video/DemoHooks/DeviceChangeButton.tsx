export function DeviceChangeButton({
  self,
  kind,
  device,
}: {
  self: any;
  kind: "camera" | "speaker" | "microphone";
  device: MediaDeviceInfo;
}) {
  return (
    <a
      style={{ display: "block" }}
      href="#"
      onClick={(x) => {
        x.preventDefault();
        if (kind === "camera") self.video.setDevice(device);
        if (kind === "microphone") self.audio.setDevice(device);
        if (kind === "speaker") self.speaker.setDevice(device);
      }}
    >
      {device.label}
    </a>
  );
}
