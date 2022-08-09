import { useEffect, useState } from "react";
import { WebRTC } from "@signalwire/js";

export default function useWebRTC() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function setupList() {
      const cameras = await WebRTC.getCameraDevicesWithPermissions();
      setCameras(Array.from(cameras));
      const microphones = await WebRTC.getMicrophoneDevicesWithPermissions();
      setMicrophones(microphones);
      const speakers = await WebRTC.getSpeakerDevicesWithPermissions();
      setSpeakers(speakers);
    }
    setupList();
  }, []);

  useEffect(() => {
    let cameraWatcher: any, microphoneWatcher: any, speakerWatcher: any;
    async function setupWatchers() {
      cameraWatcher = await WebRTC.createCameraDeviceWatcher();
      cameraWatcher.on("changed", (x: any) => {
        setCameras(x.devices);
      });

      microphoneWatcher = await WebRTC.createMicrophoneDeviceWatcher();
      microphoneWatcher.on("changed", (x: any) => {
        setMicrophones(x.devices);
      });

      speakerWatcher = await WebRTC.createSpeakerDeviceWatcher();
      speakerWatcher.on("changed", (x: any) => {
        setSpeakers(x.devices);
      });
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

  return { cameras, microphones, speakers };
}

