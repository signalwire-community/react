import { act, renderHook, cleanup } from "@testing-library/react-hooks";
import useLayouts from "./useLayouts";

describe("useLayouts", () => {
  it("subscribes to the events", () => {
    const roomSession = {
      getLayouts: jest.fn(),
      setLayout: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useLayouts(roomSession as any));

    expect(roomSession.on).toHaveBeenCalledTimes(2);
    expect(roomSession.on).toHaveBeenCalledWith(
      "room.joined",
      expect.anything()
    );
    expect(roomSession.on).toHaveBeenCalledWith(
      "layout.changed",
      expect.anything()
    );

    expect(roomSession.off).toHaveBeenCalledTimes(0);
  });

  it("unsubscribes from the events", () => {
    const roomSession = {
      getLayouts: jest.fn(),
      setLayout: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useLayouts(roomSession as any));
    cleanup();

    expect(roomSession.off).toHaveBeenCalledTimes(2);
    expect(roomSession.off).toHaveBeenCalledWith(
      "room.joined",
      expect.anything()
    );
    expect(roomSession.off).toHaveBeenCalledWith(
      "layout.changed",
      expect.anything()
    );
  });

  it("sets a different layout", () => {
    const roomSession = {
      getLayouts: jest.fn(),
      setLayout: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useLayouts(roomSession as any));

    act(() => {
      result.current.setLayout({ name: "2x2" });
    });

    expect(roomSession.setLayout).toHaveBeenCalledTimes(1);
  });
});
