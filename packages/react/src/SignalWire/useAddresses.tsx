import { useEffect, useState } from "react";
import type { SignalWireContract } from "./types";

/**
 * Given a client, poll the addresses available.
 * @param client is the SignalWire client
 * @returns null | address[]
 */
export function useAddresses(
  client: SignalWireContract | null,
  options?: Parameters<SignalWireContract["address"]["getAddresses"]>[0]
) {
  const delay = 10000;
  const [addresses, setAddresses] = useState<null | any>(null);
  useEffect(() => {
    async function fetch() {
      if (client === undefined || client === null) return;
      const addresses = await client.address.getAddresses(options);
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
