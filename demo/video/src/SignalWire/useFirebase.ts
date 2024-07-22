import { useEffect, useState } from "react";
import { getToken2, onMessageListener } from "./firebase";

export default function useFirebase() {
  onMessageListener()
    .then((payload) => {
      console.log("FOREGROUND", payload);
    })
    .catch((err) => console.log("failed: ", err));

  const [token, setToken] = useState<null | string>(null);
  useEffect(() => {
    getToken2((t) => {
      setToken(t);
    });
  }, []);
  return token;
}
