import { act, renderHook } from "@testing-library/react-hooks";
import { WebRTC } from "@signalwire/js";
import useWebRTC from "./useWebRTC";

jest.mock("@signalwire/js", () => ({
  __esModule: true,
  WebRTC: {
    createDeviceWatcher: jest.fn(async () => ({
      on: jest.fn(),
      off: jest.fn(),
    })),
    getCameraDevices: jest.fn(async () => []),
    getMicrophoneDevices: jest.fn(async () => []),
    getSpeakerDevices: jest.fn(async () => []),
    getUserMedia: jest.fn(),
  },
}));

describe("useWebRTC", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("subscribes to everything by default", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWebRTC());

    await act(() => waitForNextUpdate());

    expect(WebRTC.getCameraDevices).toHaveBeenCalledTimes(1);
    expect(WebRTC.getMicrophoneDevices).toHaveBeenCalledTimes(1);
    expect(WebRTC.getSpeakerDevices).toHaveBeenCalledTimes(1);
    expect(WebRTC.getUserMedia).toHaveBeenCalledWith({
      audio: true,
      video: true,
    });
  });

  it("subscribes to cameras only", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useWebRTC({ camera: true })
    );

    await act(() => waitForNextUpdate());

    expect(WebRTC.getCameraDevices).toHaveBeenCalledTimes(1);
    expect(WebRTC.getMicrophoneDevices).toHaveBeenCalledTimes(0);
    expect(WebRTC.getSpeakerDevices).toHaveBeenCalledTimes(0);
    expect(WebRTC.getUserMedia).toHaveBeenCalledWith({
      audio: false,
      video: true,
    });
  });

  it("subscribes to nothing", async () => {
    const { result } = renderHook(() => useWebRTC({}));

    expect(WebRTC.getCameraDevices).toHaveBeenCalledTimes(0);
    expect(WebRTC.getMicrophoneDevices).toHaveBeenCalledTimes(0);
    expect(WebRTC.getSpeakerDevices).toHaveBeenCalledTimes(0);
    expect(WebRTC.getUserMedia).toHaveBeenCalledTimes(0);
  });
});
