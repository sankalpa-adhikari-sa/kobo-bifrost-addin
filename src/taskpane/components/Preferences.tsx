import { Switch } from "@fluentui/react-components";
import { useTheme } from "./ThemeProvider";

const Preferences = () => {
  const { themeName, toggleTheme } = useTheme();
  console.log(themeName);

  return (
    <div>
      <Switch checked={themeName === "dark"} onChange={toggleTheme} label="Dark mode" />
    </div>
  );
};
export default Preferences;
