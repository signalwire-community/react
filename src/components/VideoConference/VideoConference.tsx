import React from "react";
import { useEffect, useRef } from "react";

type VideoConferenceProps = {
    onRoomReady: (roomSession: any) => void,
    token: string,
    userName: string
}

export default function VideoConference({
  onRoomReady = () => {},
  token,
  userName,
}: VideoConferenceProps) {
  let container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current === null) return;

    let c = container.current;
    (c as any).setupRoomSession = (rs: any) => {
        onRoomReady(rs);
      };
    let script = document.createElement("script");
    script.innerHTML = `
  !function(e,r){e.swvr=e.swvr||function(r={}){
  Object.assign(e.swvr.p=e.swvr.p||{},r)}
  ;let t=r.currentScript,n=r.createElement("script")
  ;n.type="module",n.src="https://cdn.signalwire.com/video/rooms/index.js",
  n.onload=function(){let n=r.createElement("ready-room")
  ;n.params=e.swvr.p,t.parentNode.appendChild(n)},t.parentNode.insertBefore(n,t)
  ;let i=r.createElement("link")
  ;i.type="text/css",i.rel="stylesheet",i.href="https://cdn.signalwire.com/video/rooms/signalwire.css",
  t.parentNode.insertBefore(i,t),
  e.SignalWire=e.SignalWire||{},e.SignalWire.Prebuilt={VideoRoom:e.swvr}
  }(window,document);

  SignalWire.Prebuilt.VideoRoom({
    token: '${token}',
    userName: '${userName}',
     setupRoomSession: (rs)=>{
         const el = document.currentScript.parentNode;
         console.log(el)
         console.log(el.setupRoomSession)
        if (el.setupRoomSession !== undefined) {
            el.setupRoomSession(rs); 
        }
     }
  });
    `;

    c.appendChild(script);
    return () => {
      c.removeChild(script);
    };
  }, []);
  return <div ref={container}></div>;
}
