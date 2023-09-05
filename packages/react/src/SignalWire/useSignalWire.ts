import { SignalWire } from "@signalwire/js";
import { useEffect, useState } from "react";
import type { SignalWireContract, SignalWireOptions } from "./types";

/**
 * Creates a SignalWire Client as React State.
 * @param params
 * @returns SignalWireContract
 */
export function useSignalWire(
  options: SignalWireOptions
): SignalWireContract | null {
  const [client, setClient] = useState<null | SignalWireContract>(null);
  const token = options.token;

  useEffect(() => {
    if (token === undefined) return;
    let _client: SignalWireContract | undefined;
    async function createClient() {
      _client = await SignalWire({
        token: token,
      });
      setClient(_client);

      // disconnect on unmount
      return () => _client?.disconnect();
    }
    createClient();
  }, [token]);

  return client;
}
