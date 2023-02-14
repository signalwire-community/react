import { Fabric } from "@signalwire-community/react";
import { useEffect, useState } from "react";

function DemoFabric() {
  const client = Fabric.useFabric(import.meta.env.VITE_FABRIC_TOKEN);
  const addresses = Fabric.useAddresses(client);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    console.log(addresses);
    const rooms = addresses?.filter((a: any) => a.type === "room") ?? [];
    setAddress(rooms?.[0] ?? null);
  }, [addresses]);

  return (
    <div>
      {import.meta.env.VITE_FABRIC_TOKEN && client && address !== null ? (
        <Fabric.Video client={client} address={address} />
      ) : (
        "No Token Present. Please set your env variable"
      )}
    </div>
  );
}

export default DemoFabric;
