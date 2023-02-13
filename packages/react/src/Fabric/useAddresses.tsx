import { Fabric } from "@signalwire/js";
import { useEffect, useState } from "react";

/**
 * Given a client, poll the addresses available.
 * @param client is the fabric client
 * @param delay in ms, the polling time
 * @returns null | address[]
 */
export function useAddresses(client: Fabric.Client | null, delay = 10000) {
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
