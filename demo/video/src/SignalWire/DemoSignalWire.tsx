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
    host: "puc.swire.io",
  });
  const addresses = useAddresses(client, { type: "subscriber" });
  const [address, setAddress] = useState(null);
  const [call, setCall] = useState(null);

  // const { self } = useMembers(call);

  useEffect(() => {
    console.log(addresses);
    setAddress(addresses?.[0] ?? null);
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
          {/* <button onClick={(e) => self?.remove()}>Leave</button> */}
        </>
      ) : (
        "No Token Present. Please set your env variable"
      )}
    </div>
  );
}

export default DemoSignalWire;
