import * as React from "react";
import Header from "./Header";
import Progress from "./Progress";
import logo from "../../../assets/logo-filled.png";
import { TokenManager } from "./TokenManager";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
  if (!isOfficeInitialized) {
    return <Progress title={title} logo={logo} message="Please sideload your addin to see app body." />;
  }

  return (
    <div className="ms-welcome">
      <Header logo={logo} title={title} message="Welcome" />
      <TokenManager />
    </div>
  );
};

export default App;
