import * as React from "react";
import Progress from "./Progress";
import logo from "../../../assets/logo-filled.png";
import { TokenManager } from "../routes/TokenManager";
import Preferences from "./Preferences";
import AddinNavDrawer from "./AddinNavDrawer";
import { Hamburger, Tooltip, useRestoreFocusTarget } from "@fluentui/react-components";
import { Route, Routes } from "react-router";
import Assets from "../routes/Assets";
import Settings from "../routes/Settings";
import Create from "../routes/Create";
import About from "../routes/About";
import AssetDetailsSettings from "../routes/AssetDetailsSettings";
import AssetDetailsSummary from "../routes/AssetDetailsSummary";
import AssetDetailsLayout from "../routes/AssetDetailsLayout";

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
      <AddinNavDrawer isOpen={drawerOpen} setIsOpen={setDrawerOpen} toggleOpen={toggleDrawer} />
      <Routes>
        <Route index element={<About />} />
        <Route path="preferences" element={<Preferences />} />
        <Route path="token-manager" element={<TokenManager />} />
        <Route path="assets" element={<Assets />} />
        <Route path="create" element={<Create />} />
        <Route path="settings" element={<Settings />} />
        <Route path="assets/:uid" element={<AssetDetailsLayout />}>
          <Route index element={<AssetDetailsSummary />} />
          <Route path="settings" element={<AssetDetailsSettings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
