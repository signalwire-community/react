import { Video, Fabric } from "@signalwire/js";
import { useEffect, useState } from "react";

/**
 * Creates a Fabric Client as React State.
 * @param params
 * @returns Fabric.Client
 */
export function useFabric(token: string) {
  // ...params: ConstructorParameters<typeof Fabric.Client>

  const [client, setClient] = useState<null | Fabric.Client>(null);
  useEffect(() => {
    if (token === undefined) return;
    let _client = new Fabric.Client({ accessToken: token });
    setClient(_client);
  }, [token]);
  return client;
}
