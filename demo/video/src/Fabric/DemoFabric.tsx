import { Fabric } from "@signalwire-community/react";
import { useEffect, useState } from "react";

function DemoFabric() {
  const [address, setAddress] = useState<any>(null);

  const client = Fabric.useFabric(import.meta.env.VITE_FABRIC_TOKEN);

  useEffect(() => {
    if (client === null) return;

    (async () => {
      const { addresses } = await client.getAddresses();
      setAddress(addresses[4]);
    })();
  }, [client]);

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
