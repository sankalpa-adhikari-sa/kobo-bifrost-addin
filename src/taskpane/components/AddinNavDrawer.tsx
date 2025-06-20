import {
  AppItem,
  Hamburger,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
  Tooltip,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,
  bundleIcon,
  NotePin20Filled,
  NotePin20Regular,
  PersonCircle32Regular,
  Settings20Filled,
  Settings20Regular,
} from "@fluentui/react-icons";
import React from "react";
import { useNavigate, useLocation } from "react-router";

const JobPostings = bundleIcon(NotePin20Filled, NotePin20Regular);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Settings = bundleIcon(Settings20Filled, Settings20Regular);

interface AddinNavDrawerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleOpen: () => void;
}

const AddinNavDrawer: React.FC<AddinNavDrawerProps> = ({ isOpen, setIsOpen, toggleOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedValue = () => {
    switch (location.pathname) {
      case "/":
        return "1";
      case "/create":
        return "3";
      case "/assets":
        return "4";
      case "/settings":
        return "5";
      case "/token-manager":
        return "6";
      default:
        return "1";
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <NavDrawer
      selectedValue={getSelectedValue()}
      defaultSelectedCategoryValue=""
      open={isOpen}
      type="overlay"
      multiple
      onOpenChange={(_, data) => setIsOpen(data.open)}
    >
      <NavDrawerHeader>
        <Tooltip content="Close Navigation" relationship="label">
          <Hamburger onClick={toggleOpen} />
        </Tooltip>
      </NavDrawerHeader>
      <NavDrawerBody>
        <AppItem icon={<PersonCircle32Regular />} as="a">
          Kobotoolbox Add-in
        </AppItem>
        <NavItem icon={<Dashboard />} value="1" onClick={() => handleNavigation("/")}>
          About
        </NavItem>
        <NavDivider />
        <NavSectionHeader>Configuration</NavSectionHeader>
        <NavCategory value="2">
          <NavCategoryItem icon={<JobPostings />}>Data Management</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="3" onClick={() => handleNavigation("/create")}>
              Create
            </NavSubItem>
            <NavSubItem value="4" onClick={() => handleNavigation("/assets")}>
              Assets
            </NavSubItem>
            <NavSubItem value="5" onClick={() => handleNavigation("/settings")}>
              Settings
            </NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavItem icon={<Settings />} value="6" onClick={() => handleNavigation("/token-manager")}>
          Token Manager
        </NavItem>
      </NavDrawerBody>
    </NavDrawer>
  );
};

export default AddinNavDrawer;
