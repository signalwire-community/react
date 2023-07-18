import { Call, useSignalWire, useAddresses } from "@signalwire-community/react";
import { useEffect, useState } from "react";

function DemoSignalWire() {
  const client = useSignalWire({
    token: import.meta.env.VITE_FABRIC_TOKEN,
  });
  const addresses = useAddresses(client);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    console.log(addresses);
    const rooms = addresses?.filter((a: any) => a.type === "room") ?? [];
    setAddress(rooms?.[0] ?? null);
  }, [addresses]);

  return (
    <div>
      {import.meta.env.VITE_FABRIC_TOKEN && client && address !== null ? (
        <Call
          client={client}
          address={address}
          onCallReady={(r: any) => {
            console.log(r, "the Call handle");
          }}
        />
      ) : (
        "No Token Present. Please set your env variable"
      )}
    </div>
  );
}

export default DemoSignalWire;
