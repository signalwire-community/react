import { useState } from "react";
import DemoSignalWire from "./DemoSignalWire";

const users = [
  {
    name: "/private/<user>",
    token: "<token>",
  },
];
export default function IntroDemoSignalWire() {
  const [selectedUser, setSelectedUser] = useState<null | typeof users[0]>(
    null
  );

  if (selectedUser !== null)
    return (
      <DemoSignalWire
        fabricToken={selectedUser.token}
        username={selectedUser.name}
      />
    );

  return (
    <div>
      <h2>Select which user to login as:</h2>
      {users.map((user) => (
        <div key={user.name}>
          <button
            onClick={() => {
              setSelectedUser(user);
            }}
          >
            {user.name}
          </button>
          <br />
        </div>
      ))}
    </div>
  );
}
