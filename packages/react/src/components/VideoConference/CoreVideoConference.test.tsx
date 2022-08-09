import React from "react";
import ReactDOM from "react-dom";
import ReactDOMTest from "react-dom/test-utils";
import renderer from "react-test-renderer";
import CoreVideoConference from "./CoreVideoConference";

describe("CoreVideoConference", () => {
  let container: HTMLDivElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container!);
    container = null;
  });

  it("should properly cleanup", async () => {
    await ReactDOMTest.act(async () => {
      ReactDOM.render(
        <CoreVideoConference token="my-token" />,
        container
      );
    });

    expect([...container?.querySelectorAll('script') ?? []]).toHaveLength(2)

    // Update a prop. The component will be updated instead of remounted.
    await ReactDOMTest.act(async () => {
      ReactDOM.render(
        <CoreVideoConference token="my-token" userName="my-username" />,
        container
      );
    });

    expect([...container?.querySelectorAll('script') ?? []]).toHaveLength(2)

    // Update again.
    await ReactDOMTest.act(async () => {
      ReactDOM.render(
        <CoreVideoConference token="my-token" prejoin={false} />,
        container
      );
    });

    expect([...container?.querySelectorAll('script') ?? []]).toHaveLength(2)

    await ReactDOMTest.act(async () => {
      ReactDOM.unmountComponentAtNode(container!);
    });

    expect([...container?.querySelectorAll('script') ?? []]).toHaveLength(0)
  
  });

});
