import { Video, Fabric } from "@signalwire/js";
import { useEffect, useState } from "react";

/**
 * Creates a Fabric Client as React State.
 * @param params
 * @returns Fabric.Client
 */
export function useFabric(param: any) {
  // ...params: ConstructorParameters<typeof Fabric.Client>

  const [client, setClient] = useState<null | Fabric.Client>(null);
  useEffect(() => {
    if (param === undefined) return;
    console.log(param);
    let _client = new Fabric.Client(param);
    setClient(_client);
  }, [param]);
  return client;
}
