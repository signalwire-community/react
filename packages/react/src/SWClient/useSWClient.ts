import { SWClient } from "@signalwire/js";
import { useEffect, useState } from "react";

/**
 * Creates a SignalWire Client as React State.
 * @param params
 * @returns SignalWire.Client
 */
export function useSWClient(token: string) {
  // ...params: ConstructorParameters<typeof Fabric.Client>

  const [client, setClient] = useState<null | SWClient>(null);
  useEffect(() => {
    if (token === undefined) return;
    const _client = new SWClient({ accessToken: token });
    setClient(_client);
  }, [token]);
  return client;
}
