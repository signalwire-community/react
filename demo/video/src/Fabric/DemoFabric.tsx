import SignalWire from "@signalwire/js";
import { Fabric } from "@signalwire-community/react";
import { useState } from "react";

let token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJkMTVhOWE3ZS1kNTIwLTQ3NzAtYjM5ZS00ZWQ1M2ZiNTQxZjQiLCJleHAiOjE2Nzc4NTg2ODgsInN1YnNjcmliZXJfaWQiOiIwMzJhYjNiYS1kY2JjLTRlNjQtYjA0Ny1lZjhkODZkZTUxOWIiLCJwcm9qZWN0X2lkIjoiNTA2Y2VhMzMtZWI0Ny00YjU2LTgyYjAtZDNjNWFmYWYzOWQ0IiwiY2xpZW50X2lkIjoiUHV6Q2NIbFZQSXNhZTNIcXVGdk50ZUZjSkNWeC01TkZEa2RtQlZORDZoSSJ9.JqsEC2XLF9VEfPuNmgkAEwGEJVQF_R6mVWHJas-ckB7Xxjaw0QnkpPbJxH0XVHlA5YruQ23rAuVIbv4KyYr9cQ";

function DemoFabric() {
  const [roomSession, setRoomSession] =
    useState<SignalWire.Video.RoomSession | null>(null);

  return (
    <div>
      {import.meta.env.VITE_ROOM_TOKEN ? (
        <Fabric.Video token={token} />
      ) : (
        "No Token Present. Please set your env variable"
      )}
    </div>
  );
}

export default DemoFabric;
