import { useEffect, useState } from "react";
import { WebRTC } from "@signalwire/js";

export default function useWebRTC(
  deviceEnabled: {
    cameras?: boolean;
    microphones?: boolean;
    speakers?: boolean;
  } = { cameras: true, microphones: true, speakers: true }
) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function setupList() {
      deviceEnabled?.cameras !== false &&
        WebRTC.getCameraDevices().then((c) => setCameras(Array.from(c)));
      deviceEnabled?.microphones !== false &&
        WebRTC.getMicrophoneDevices().then((m) =>
          setMicrophones(Array.from(m))
        );
      deviceEnabled?.speakers !== false &&
        WebRTC.getSpeakerDevices().then((s) => setSpeakers(Array.from(s)));
    }
    setupList();
  }, []);

  // TODO: not in this hook in particular, but there should
  // be a way to keep track of the devices currently being used.

  useEffect(() => {
    let deviceWatcher: any;
    async function setupWatchers() {
      if (deviceEnabled.cameras !== false) {
        deviceWatcher = await WebRTC.createDeviceWatcher({
          targets: ["microphone", "speaker", "camera"],
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
    cameras: deviceEnabled.cameras !== false ? cameras : undefined,
    microphones: deviceEnabled.microphones !== false ? microphones : undefined,
    speakers: deviceEnabled.speakers !== false ? speakers : undefined,
  };
}
