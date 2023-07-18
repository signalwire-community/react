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
    async function createClient() {
      const _client = await SignalWire({
        token: token,
      });
      setClient(_client);
    }
    createClient();
  }, [token]);

  return client;
}
