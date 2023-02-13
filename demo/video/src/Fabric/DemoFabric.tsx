import { Fabric } from "@signalwire-community/react";
import { useEffect, useState } from "react";

function DemoFabric() {
  const client = Fabric.useFabric(import.meta.env.VITE_FABRIC_TOKEN);
  const addresses = Fabric.useAddresses(client, 10000);

  return (
    <div>
      {import.meta.env.VITE_FABRIC_TOKEN && client && addresses !== null ? (
        <Fabric.Video client={client} address={addresses[5]} />
      ) : (
        "No Token Present. Please set your env variable"
      )}
    </div>
  );
}

export default DemoFabric;
