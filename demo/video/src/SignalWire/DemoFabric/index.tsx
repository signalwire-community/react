import { AuthProvider } from "react-oidc-context";
import oidc_config from "./oidcConfig";
import FabricAppAuthEntry from "./FabricAppAuthEntry";

export default function DemoFabric() {
  return (
    <AuthProvider {...oidc_config}>
      <FabricAppAuthEntry />
    </AuthProvider>
  );
}
