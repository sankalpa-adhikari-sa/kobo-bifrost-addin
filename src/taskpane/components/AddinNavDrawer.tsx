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
  DocumentBulletList20Filled,
  DocumentBulletList20Regular,
  NotePin20Filled,
  NotePin20Regular,
  PersonCircle32Regular,
  Settings20Filled,
  Settings20Regular,
} from "@fluentui/react-icons";
import React from "react";
import { useNavigate, useLocation } from "react-router";
import Preferences from "./Preferences";

const JobPostings = bundleIcon(NotePin20Filled, NotePin20Regular);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Settings = bundleIcon(Settings20Filled, Settings20Regular);
const Workbook = bundleIcon(DocumentBulletList20Filled, DocumentBulletList20Regular);

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
      case "/profile":
        return "5";
      case "/token-manager":
        return "6";
      case "/workbook":
        return "7";
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
          <NavCategoryItem icon={<JobPostings />}>Asset Management</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="3" onClick={() => handleNavigation("/create")}>
              Create
            </NavSubItem>
            <NavSubItem value="4" onClick={() => handleNavigation("/assets")}>
              Assets
            </NavSubItem>
            <NavSubItem value="5" onClick={() => handleNavigation("/profile")}>
              Profile
            </NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavItem icon={<Workbook />} value="7" onClick={() => handleNavigation("/workbook")}>
          Workbook
        </NavItem>
        <NavItem icon={<Settings />} value="6" onClick={() => handleNavigation("/token-manager")}>
          Token Manager
        </NavItem>
        <Preferences />
      </NavDrawerBody>
    </NavDrawer>
  );
};

export default AddinNavDrawer;
