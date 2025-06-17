import * as React from "react";
import Progress from "./Progress";
import logo from "../../../assets/logo-filled.png";
import { TokenManager } from "./TokenManager";
import Preferences from "./Preferences";
import AddinNavDrawer from "./AddinNavDrawer";
import { Hamburger, Tooltip, useRestoreFocusTarget } from "@fluentui/react-components";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
  if (!isOfficeInitialized) {
    return (
      <Progress title={title} logo={logo} message="Please sideload your addin to see app body." />
    );
  }
  const restoreFocusTargetAttributes = useRestoreFocusTarget();

  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <div className="ms-welcome">
      <Tooltip content="Toggle navigation pane" relationship="label">
        <Hamburger onClick={toggleDrawer} {...restoreFocusTargetAttributes} />
      </Tooltip>
      <AddinNavDrawer isOpen={drawerOpen} toggleOpen={toggleDrawer} />
      <Preferences />
      <TokenManager />
    </div>
  );
};

export default App;
