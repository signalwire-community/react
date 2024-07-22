import { Call, useSignalWire } from "@signalwire-community/react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function FabricApp() {
  const auth = useAuth();
  const client = useSignalWire({ token: auth.user!.access_token });

  const [subInfo, setSubInfo] = useState<any>(null);

  useEffect(() => {
    console.log(client);
    if (!client) return;
    (async () => {
      setSubInfo(await client.getSubscriberInfo());
      console.log(await client.getSubscriberInfo());
    })();
  }, [client]);

  return (
    <div>
      <code>
        <pre
          style={{
            background: "#ddd",
            fontFamily: "monospace",
            padding: 10,
            borderRadius: 5,
          }}
        >
          {subInfo ? JSON.stringify(subInfo, null, 2) : "loading"}
        </pre>
      </code>

      <button onClick={() => void auth.removeUser()}>Log out</button>
    </div>
  );
}
