import { useAuth } from "react-oidc-context";
import FabricApp from "./FabricApp";

function FabricAppAuthEntry() {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return <FabricApp />;
  }

  return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}

export default FabricAppAuthEntry;
