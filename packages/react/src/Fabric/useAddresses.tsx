import { Fabric, SWClient } from "@signalwire/js";
import { useEffect, useState } from "react";

/**
 * Given a client, poll the addresses available.
 * @param client is the Fabric client or SWClient
 * @returns null | address[]
 */
export function useAddresses(client: Fabric.Client | SWClient | null) {
  const delay = 10000;
  const [addresses, setAddresses] = useState<null | any>(null);
  useEffect(() => {
    async function fetch() {
      if (client === undefined || client === null) return;
      const { addresses } = await client.getAddresses();
      setAddresses(addresses);
    }
    const interval = setInterval(fetch, delay);
    fetch();
    return () => {
      clearInterval(interval);
    };
  }, [client]);
  return addresses;
}
