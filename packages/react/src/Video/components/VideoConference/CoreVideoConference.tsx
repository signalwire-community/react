import React from "react";

type CoreVideoConferenceProps = {
  onRoomReady?: (roomSession: any) => void;
  token: string;
  userName?: string;
  theme?: "light" | "dark" | "auto";
  audio?: MediaTrackConstraints;
  video?: MediaTrackConstraints;
  memberList?: boolean;
  prejoin?: boolean;
};

export default function CoreVideoConference({
  onRoomReady,
  token,
  userName,
  theme,
  audio,
  video,
  memberList,
  prejoin,
}: CoreVideoConferenceProps) {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (container.current === null) return;

    const c = container.current;
    (c as any).setupRoomSession = (rs: any) => {
      if (onRoomReady) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        rs.on("memberList.updated", () => {}); // Workaround for cloud-product/4681 (internal)
        onRoomReady(rs);
      }
    };

    const script = document.createElement("script");
    script.innerHTML = `
!function(e,r){e.swvr=e.swvr||function(r={}){
Object.assign(e.swvr.p=e.swvr.p||{},r)}
;let t=r.currentScript,n=r.createElement("script")
;n.type="module",n.src="https://cdn.signalwire.com/video/rooms/index.js",
n.onload=function(){let n=r.createElement("ready-room")
;n.params=e.swvr.p,t.parentNode?.appendChild(n)},t.parentNode.insertBefore(n,t)
;let i=r.createElement("link")
;i.type="text/css",i.rel="stylesheet",i.href="https://cdn.signalwire.com/video/rooms/signalwire.css",
t.parentNode.insertBefore(i,t),
e.SignalWire=e.SignalWire||{},e.SignalWire.Prebuilt={VideoRoom:e.swvr}
}(window,document);

(function(){
  const currScript = document.currentScript;
  SignalWire.Prebuilt.VideoRoom({
    token: ${JSON.stringify(token)},
    userName: ${JSON.stringify(userName)},
    theme: ${JSON.stringify(theme)},
    audio: ${JSON.stringify(audio)},
    video: ${JSON.stringify(video)},
    memberList: ${JSON.stringify(memberList)},
    prejoin: ${JSON.stringify(prejoin)},
    setupRoomSession: (rs) => {
      const el = currScript.parentNode;
      if (el.setupRoomSession !== undefined) {
        el.setupRoomSession(rs);
      }
    }
  });
})();
    `;

    c.appendChild(script);
    return () => {
      c.removeChild(script);
      c.innerHTML = "";
    };
  }, [
    container,
    token,
    userName,
    memberList,
    prejoin,
    audio,
    video,
    theme,
    onRoomReady,
  ]);
  return <div ref={container} style={{ width: "100%", height: "100%" }}></div>;
}
