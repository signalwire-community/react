import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import useLayouts from "./useLayouts";

describe("useLayouts", () => {
  it("subscribes to the events", () => {
    const roomSession = {
      getLayouts: jest.fn(),
      setLayout: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    };

    function TestComponent() {
      const { layouts, currentLayout, setLayout } = useLayouts(
        roomSession as any
      );
      return <></>;
    }

    render(<TestComponent />);

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

    function TestComponent() {
      const { layouts, currentLayout, setLayout } = useLayouts(
        roomSession as any
      );
      return <></>;
    }

    const { unmount } = render(<TestComponent />);
    unmount();

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

    function TestComponent() {
      const { layouts, currentLayout, setLayout } = useLayouts(
        roomSession as any
      );

      useEffect(() => {
        setLayout({ name: "2x2" });
      }, []);

      return <></>;
    }

    render(<TestComponent />);

    expect(roomSession.setLayout).toHaveBeenCalledTimes(1);
  });
});
