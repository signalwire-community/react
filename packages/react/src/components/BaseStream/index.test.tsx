import React from "react";
import ReactDOM from "react-dom";
import ReactDOMTest from "react-dom/test-utils";
import renderer from "react-test-renderer";
import BaseStream from "./index";

describe("BaseStream", () => {
  let container: any;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it("should subscribe to the room.joined event once", async () => {
    const onSpy = jest.fn();
    const offSpy = jest.fn();

    const roomSessionMock = {
      active: true,
      localStream: "local stream",
      remoteStream: "remote stream",
      on: onSpy,
      off: offSpy,
    };

    await ReactDOMTest.act(async () => {
      ReactDOM.render(
        // @ts-expect-error
        <BaseStream roomSession={roomSessionMock} streamSource="local" />,
        container
      );
    });

    expect(onSpy).toHaveBeenCalledTimes(1);
    expect(onSpy).toHaveBeenCalledWith("room.joined", expect.anything());
    expect(offSpy).toHaveBeenCalledTimes(0);

    await ReactDOMTest.act(async () => {
      ReactDOM.unmountComponentAtNode(container);
    });
    expect(offSpy).toHaveBeenCalledTimes(1);
    expect(offSpy).toHaveBeenCalledWith("room.joined", expect.anything());
  });

  it("should extract the local stream", async () => {
    const roomSessionMock = {
      active: true,
      localStream: "local stream",
      remoteStream: "remote stream",
      on: jest.fn(),
      off: jest.fn(),
    };

    await ReactDOMTest.act(async () => {
      ReactDOM.render(
        // @ts-expect-error
        <BaseStream roomSession={roomSessionMock} streamSource="local" />,
        container
      );
    });

    expect(container.querySelector("video")).toHaveProperty(
      "srcObject",
      "local stream"
    );
  });

  it("should extract the remote stream", async () => {
    const roomSessionMock = {
      active: true,
      localStream: "local stream",
      remoteStream: "remote stream",
      on: jest.fn(),
      off: jest.fn(),
    };

    await ReactDOMTest.act(async () => {
      ReactDOM.render(
        // @ts-expect-error
        <BaseStream roomSession={roomSessionMock} streamSource="remote" />,
        container
      );
    });

    expect(container.querySelector("video")).toHaveProperty(
      "srcObject",
      "remote stream"
    );
  });
});

describe("BaseStream", () => {
  it("Should render a video component", async () => {
    const roomSessionMock = {};

    // We don't need an actual DOM, so we use react-test-renderer.
    const component = renderer.create(
      // @ts-expect-error
      <BaseStream roomSession={roomSessionMock} streamSource="local" />
    );

    expect(component.toJSON()).toHaveProperty("type", "video");
  });
});
