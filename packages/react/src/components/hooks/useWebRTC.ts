import { useEffect, useState } from "react";
import { WebRTC } from "@signalwire/js";

export default function useWebRTC(deviceEnabled: {
  cameras: boolean;
  microphones: boolean;
  speakers: boolean;
}) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function setupList() {
      if (deviceEnabled.cameras !== false) {
        const cameras = await WebRTC.getCameraDevicesWithPermissions();
        setCameras(Array.from(cameras));
      }
      if (deviceEnabled.microphones !== false) {
        const microphones = await WebRTC.getMicrophoneDevicesWithPermissions();
        setMicrophones(microphones);
      }
      if (deviceEnabled.speakers !== false) {
        const speakers = await WebRTC.getSpeakerDevicesWithPermissions();
        setSpeakers(speakers);
      }
    }
    setupList();
  }, []);

  useEffect(() => {
    let cameraWatcher: any, microphoneWatcher: any, speakerWatcher: any;
    async function setupWatchers() {
      if (deviceEnabled.cameras !== false) {
        cameraWatcher = await WebRTC.createCameraDeviceWatcher();
        cameraWatcher.on("changed", (x: any) => {
          setCameras(x.devices);
        });
      }

      if (deviceEnabled.microphones !== false) {
        microphoneWatcher = await WebRTC.createMicrophoneDeviceWatcher();
        microphoneWatcher.on("changed", (x: any) => {
          setMicrophones(x.devices);
        });
      }

      if (deviceEnabled.speakers !== false) {
        speakerWatcher = await WebRTC.createSpeakerDeviceWatcher();
        speakerWatcher.on("changed", (x: any) => {
          setSpeakers(x.devices);
        });
      }
    }
    setupWatchers();

    return () => {
      try {
        //TODO: remove specific changers
        cameraWatcher?.off("changed");
        microphoneWatcher?.off("changed");
        speakerWatcher?.off("changed");
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
