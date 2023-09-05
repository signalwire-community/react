import {
  Call,
  useSignalWire,
  useAddresses,
  useMembers,
} from "@signalwire-community/react";
import { useEffect, useState } from "react";

function DemoSignalWire() {
  const client = useSignalWire({
    token: import.meta.env.VITE_FABRIC_TOKEN,
  });
  const addresses = useAddresses(client);
  const [address, setAddress] = useState(null);
  const [call, setCall] = useState(null);

  const { self } = useMembers(call);

  useEffect(() => {
    console.log(addresses);
    const rooms = addresses?.filter((a: any) => a.type === "room") ?? [];
    setAddress(rooms?.[0] ?? null);
  }, [addresses]);

  return (
    <div>
      {import.meta.env.VITE_FABRIC_TOKEN && client && address !== null ? (
        <>
          <Call
            client={client}
            address={address}
            onCallReady={(r: any) => {
              console.log(r, "the Call handle");
              setCall(r);
            }}
          />
          <button onClick={(e) => self?.remove()}>Leave</button>
        </>
      ) : (
        "No Token Present. Please set your env variable"
      )}
    </div>
  );
}

export default DemoSignalWire;
