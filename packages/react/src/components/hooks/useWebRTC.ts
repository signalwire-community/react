import { useEffect, useState } from "react";
import { WebRTC } from "@signalwire/js";
import { DevicePermissionName } from "@signalwire/webrtc/dist/cjs/webrtc/src/utils";

export default function useWebRTC(
  deviceEnabled: {
    camera?: boolean;
    microphone?: boolean;
    speaker?: boolean;
  } = { camera: true, microphone: true, speaker: true }
) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    deviceEnabled?.camera !== false &&
      WebRTC.getCameraDevices().then((c) => setCameras(Array.from(c)));
    deviceEnabled?.microphone !== false &&
      WebRTC.getMicrophoneDevices().then((m) => setMicrophones(Array.from(m)));
    deviceEnabled?.speaker !== false &&
      WebRTC.getSpeakerDevices().then((s) => setSpeakers(Array.from(s)));
  }, []);

  // TODO: not in this hook in particular, but there should
  // be a way to keep track of the i/o devices currently being used.

  useEffect(() => {
    let deviceWatcher: any;
    async function setupWatchers() {
      let targets: DevicePermissionName[] = [];
      Object(deviceEnabled)
        .keys()
        .forEach(
          (key: string) =>
            (deviceEnabled as any)[key] &&
            targets.push(key as DevicePermissionName)
        );
      console.log(targets);

      if (targets.length > 0) {
        deviceWatcher = await WebRTC.createDeviceWatcher({
          targets,
        });

        deviceWatcher.on("changed", (x: any) => {
          setCameras(x.devices.filter((x: any) => x.kind === "videoinput"));
          setMicrophones(x.devices.filter((x: any) => x.kind === "audioinput"));
          setSpeakers(x.devices.filter((x: any) => x.kind === "audiooutput"));
        });
      }
    }
    setupWatchers();

    return () => {
      try {
        deviceWatcher?.off("changed");
      } catch (e) {
        console.error("Couldn't remove watchers for WebRTC", e);
      }
    };
  }, []);

  return {
    cameras: deviceEnabled.camera !== false ? cameras : undefined,
    microphones: deviceEnabled.microphone !== false ? microphones : undefined,
    speakers: deviceEnabled.speaker !== false ? speakers : undefined,
  };
}
