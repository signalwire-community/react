export function ControlStrip(member: any, permission: any, members: any) {
  if (member === null || permission === null) return;
  return (
    <>
      {`${member.name.substr(0, 6)}... (${member.id.substr(0, 10)}...)`}
      <i>{(members?.self as any)?.talking && " Talking"}</i>
      <br />
      {permission.audio && (
        <button onClick={(x) => member.audio.toggle()}>
          {member.audio.muted ? "Unmute" : "Mute"} audio
        </button>
      )}
      {permission.video && (
        <button onClick={(x) => member.video.toggle()}>
          {member.video.muted ? "Unmute" : "Mute"} video
        </button>
      )}
      {permission.video && (
        <button onClick={(x) => member.speaker.toggle()}>
          {member.speaker.muted ? "Unmute" : "Mute"} speaker
        </button>
      )}
      {permission.remove && (
        <button
          onClick={(e) => {
            member.remove();
          }}
        >
          Remove
        </button>
      )}
      {permission.set_position && (
        <button
          onClick={(e) => {
            if (member.position === "off-canvas")
              member.setPosition("standard-1");
            else member.setPosition("off-canvas");
          }}
        >
          {member.position === "off-canvas" ? "Show" : "Hide"}
        </button>
      )}
      <br />
      Position: {member.position}
    </>
  );
}
