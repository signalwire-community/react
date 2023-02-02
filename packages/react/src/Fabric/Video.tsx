import React, { RefObject, useState } from "react";
import { useFabric } from "./useFabric";
import CoreVideo from "./CoreVideo";

export function Video({ token }: { token: string }) {
  const [accessToken, _] = useState<any>({ accessToken: token });
  let client = useFabric(accessToken);
  return client ? (
    <CoreVideo client={client} audio={true} video={true} />
  ) : null;
}
