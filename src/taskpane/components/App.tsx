import * as React from "react";
import Progress from "./Progress";
import logo from "../../../assets/logo-filled.png";
import { TokenManager } from "../routes/TokenManager";
import Preferences from "./Preferences";
import AddinNavDrawer from "./AddinNavDrawer";
import {
  Hamburger,
  Menu,
  MenuButton,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Toaster,
  Tooltip,
  useId,
  useRestoreFocusTarget,
} from "@fluentui/react-components";
import { Route, Routes } from "react-router";
import Assets from "../routes/Assets";
import Create from "../routes/Create";
import About from "../routes/About";
import AssetDetailsSettings from "../routes/AssetDetailsSettings";
import AssetDetailsSummary from "../routes/AssetDetailsSummary";
import AssetDetailsLayout from "../routes/AssetDetailsLayout";
import Profile from "../routes/Profile";
import { bundleIcon, DocumentAdd16Filled, DocumentAdd16Regular } from "@fluentui/react-icons";
import { CreateXlsFormsByFileUpload } from "./dialogs/CreateProjectByFileUpload";
import { CreateXlsFormsByUrlUpload } from "./dialogs/CreateProjectByUrlUpload";
import { CreateEmptySurveyAsset } from "./dialogs/CreateEmptySurveyAsset";
import { CreateXlsFormsByWorkbookUpload } from "./dialogs/CreateProjectByWorkbookUpload";
import { Workbook } from "../routes/Workbook";
import { EmptyDocumentIcon, LinkIcon, WorkbookIcon, XlsxIcon } from "../../utils/icons";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}
type DialogType = "xlsUpload" | "emptyAsset" | "xlsUrlUpload" | "cloneAsset" | "workbookUpload";

const App: React.FC<AppProps> = ({ title, isOfficeInitialized }) => {
  if (!isOfficeInitialized) {
    return (
      <Progress title={title} logo={logo} message="Please sideload your addin to see app body." />
    );
  }
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const toasterId = useId("toaster");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const UploadIcon = bundleIcon(DocumentAdd16Filled, DocumentAdd16Regular);
  const [activeDialog, setActiveDialog] = React.useState<DialogType | null>(null);
  return (
    <div>
      <div className="flex flex-row items-baseline justify-between pr-4">
        <Tooltip content="Toggle navigation pane" relationship="label">
          <Hamburger onClick={toggleDrawer} {...restoreFocusTargetAttributes} />
        </Tooltip>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton shape="circular" appearance="primary" size="small" icon={<UploadIcon />} />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuGroup>
                <MenuGroupHeader>Create new asset</MenuGroupHeader>
                <MenuItem icon={<XlsxIcon />} onClick={() => setActiveDialog("xlsUpload")}>
                  Upload XLSForm
                </MenuItem>
                <MenuItem icon={<LinkIcon />} onClick={() => setActiveDialog("xlsUrlUpload")}>
                  Upload XLSForm via URL
                </MenuItem>
                <MenuItem icon={<WorkbookIcon />} onClick={() => setActiveDialog("workbookUpload")}>
                  Upload Current Workbook
                </MenuItem>
                <MenuItem
                  icon={<EmptyDocumentIcon />}
                  onClick={() => setActiveDialog("emptyAsset")}
                >
                  Create Empty Asset
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
      <Toaster toasterId={toasterId} />
      <AddinNavDrawer isOpen={drawerOpen} setIsOpen={setDrawerOpen} toggleOpen={toggleDrawer} />
      <CreateXlsFormsByFileUpload
        open={activeDialog === "xlsUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
      <CreateXlsFormsByUrlUpload
        open={activeDialog === "xlsUrlUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
      <CreateEmptySurveyAsset
        open={activeDialog === "emptyAsset"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
      <CreateXlsFormsByWorkbookUpload
        open={activeDialog === "workbookUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
      />
      <Routes>
        <Route index element={<About />} />
        <Route path="preferences" element={<Preferences />} />
        <Route path="token-manager" element={<TokenManager />} />
        <Route path="assets" element={<Assets />} />
        <Route path="create" element={<Create />} />
        <Route path="profile" element={<Profile />} />
        <Route path="workbook" element={<Workbook />} />
        <Route path="assets/:uid" element={<AssetDetailsLayout />}>
          <Route index element={<AssetDetailsSummary />} />
          <Route path="settings" element={<AssetDetailsSettings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
