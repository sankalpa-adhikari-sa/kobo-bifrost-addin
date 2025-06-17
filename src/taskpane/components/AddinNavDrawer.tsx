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

const JobPostings = bundleIcon(NotePin20Filled, NotePin20Regular);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Settings = bundleIcon(Settings20Filled, Settings20Regular);

interface AddinNavDrawerProps {
  isOpen: boolean;
  toggleOpen: () => void;
}

const AddinNavDrawer: React.FC<AddinNavDrawerProps> = ({ isOpen, toggleOpen }) => {
  return (
    <NavDrawer
      defaultSelectedValue="2"
      defaultSelectedCategoryValue=""
      open={isOpen}
      type="overlay"
      multiple
    >
      <NavDrawerHeader>
        <Tooltip content="Close Navigation" relationship="label">
          <Hamburger onClick={toggleOpen} />
        </Tooltip>
      </NavDrawerHeader>
      <NavDrawerBody>
        <AppItem icon={<PersonCircle32Regular />} as="a">
          Contoso HR
        </AppItem>
        <NavItem icon={<Dashboard />} value="1">
          Dashboard
        </NavItem>
        <NavDivider />
        <NavSectionHeader>Employee Management</NavSectionHeader>
        <NavCategory value="2">
          <NavCategoryItem icon={<JobPostings />}>Job Postings</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="3">Openings</NavSubItem>
            <NavSubItem value="4">Submissions</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavItem icon={<Settings />} value="5">
          Settings
        </NavItem>
      </NavDrawerBody>
    </NavDrawer>
  );
};

export default AddinNavDrawer;
