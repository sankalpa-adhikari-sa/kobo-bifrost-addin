import { useState } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Text,
  Title3,
  Toolbar,
  ToolbarButton,
  Tooltip,
  useId,
  Toaster,
  MessageBar,
  MessageBarBody,
  Button,
} from "@fluentui/react-components";
import {
  ArrowUploadRegular,
  bundleIcon,
  DocumentBulletListFilled,
  DocumentBulletListMultipleFilled,
  DocumentBulletListMultipleRegular,
  DocumentBulletListRegular,
  DocumentCopyFilled,
  DocumentCopyRegular,
  EyeFilled,
  EyeRegular,
  MoreHorizontalFilled,
  MoreHorizontalRegular,
  PenFilled,
  PenRegular,
} from "@fluentui/react-icons";
import { useAssetsById } from "../hooks/useAssets";
import { UploadProjectFileUploadDialog } from "../components/updateProjectFileUpload";
import { useStoredToken } from "../hooks/useStoredToken";
import { checkFormDeploymentStatus } from "../../utils/deploymentstatus";

type DialogType = "uploadXls" | "editMetadata" | "viewPreview";

const AssetDetails = () => {
  const { uid } = useParams<{ uid: string }>();
  const PenIcon = bundleIcon(PenFilled, PenRegular);
  const EyeIcon = bundleIcon(EyeFilled, EyeRegular);
  const HorizontalOptionIcon = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);
  const XlsFileIcon = bundleIcon(DocumentBulletListFilled, DocumentBulletListRegular);
  const XmlFileIcon = bundleIcon(
    DocumentBulletListMultipleFilled,
    DocumentBulletListMultipleRegular
  );
  const CloneIcon = bundleIcon(DocumentCopyFilled, DocumentCopyRegular);
  const UploadIcon = bundleIcon(ArrowUploadRegular, ArrowUploadRegular);
  const toasterId = useId("toaster");
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const { data: asset, isLoading, error } = useAssetsById(uid ?? "");
  const { kpiUrl } = useStoredToken();

  if (!uid) {
    return (
      <div className="p-4">
        <Title3>Error</Title3>

        <Text>Asset UID is missing from the URL.</Text>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading asset details..." />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="p-4">
        <Title3>Error</Title3>
        <Text>An error occurred while fetching asset details.</Text>
      </div>
    );
  }

  const {
    isArchived,
    isDeployedWithNoUndeployedChanges,
    needsFirstTimeDeployment,
    hasUndeployedChanges,
  } = checkFormDeploymentStatus(asset);
  console.log(
    `isArchived: ${isArchived} \n`,
    `isDeployedWithNoUndeployedChanges:${isDeployedWithNoUndeployedChanges} \n`,
    `needsFirstTimeDeployment:${needsFirstTimeDeployment} \n`,
    `hasUndeployedChanges:${hasUndeployedChanges} \n`
  );
  let currentVersion: number;

  if (needsFirstTimeDeployment || hasUndeployedChanges) {
    currentVersion = asset.deployed_versions.count + 1;
  } else if (isDeployedWithNoUndeployedChanges) {
    currentVersion = asset.deployed_versions.count;
  } else {
    currentVersion = 0;
  }
  return (
    <div className="p-2 h-screen bg-gray-50 flex flex-col gap-2">
      <Toaster toasterId={toasterId} />
      <Card>
        <CardHeader
          header={<span className="text-base font-medium">{asset.name}</span>}
          description={asset.settings.description || "No description available."}
          action={
            <Toolbar size="small">
              <Tooltip content="Edit project Metadata" relationship="description" withArrow>
                <ToolbarButton icon={<PenIcon />} onClick={() => setActiveDialog("editMetadata")} />
              </Tooltip>
              <Tooltip
                content="View project preview (Not implemented)"
                relationship="description"
                withArrow
              >
                <ToolbarButton
                  icon={<EyeIcon />}
                  onClick={() => alert("Preview not implemented.")}
                />
              </Tooltip>
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <Tooltip content="Upload Asset" relationship="label">
                    <MenuButton appearance="subtle" icon={<UploadIcon />} />
                  </Tooltip>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem onClick={() => setActiveDialog("uploadXls")}>Upload XLSForm</MenuItem>
                    <MenuItem onClick={() => alert("URL upload not implemented.")}>
                      Upload XLSForm via URL
                    </MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <Tooltip content="Other Options " relationship="label">
                    <MenuButton appearance="subtle" icon={<HorizontalOptionIcon />} />
                  </Tooltip>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem icon={<XlsFileIcon />}>Download XLSForm</MenuItem>
                    <MenuItem icon={<XmlFileIcon />}>Download XML form</MenuItem>
                    <MenuItem icon={<CloneIcon />}>Clone Project</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            </Toolbar>
          }
        />
      </Card>
      <span className="text-xs font-medium">Current Version</span>

      <Card className="p-6 space-y-6 shadow-lg rounded-lg">
        {(hasUndeployedChanges || needsFirstTimeDeployment) && (
          <MessageBar intent="warning" className="rounded-md">
            <MessageBarBody className="text-wrap text-base">
              If you want to make these changes public, you must deploy this form.
            </MessageBarBody>
          </MessageBar>
        )}

        <div className="flex flex-row justify-between items-center gap-4">
          <div className="text-sm  space-y-2">
            <div>
              <strong className="font-semibold">Version:</strong> v{currentVersion}{" "}
              {needsFirstTimeDeployment || hasUndeployedChanges ? (
                <span className="text-orange-600 font-medium">(undeployed)</span>
              ) : null}
            </div>
            <div>
              <strong className="font-semibold">Last Modified:</strong>{" "}
              {asset.date_modified
                ? format(new Date(asset.date_modified), "MMMM d, yyyy h:mm a")
                : "N/A"}
            </div>
            <div>
              <strong className="font-semibold">Questions:</strong> {asset.summary.row_count}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {needsFirstTimeDeployment && (
              <Button
                appearance="primary"
                size="medium"
                className="px-5 py-2 rounded-md font-medium"
              >
                Deploy
              </Button>
            )}

            {hasUndeployedChanges && !isArchived && (
              <Button
                appearance="primary"
                size="medium"
                className="px-5 py-2 rounded-md font-medium"
              >
                Redeploy
              </Button>
            )}

            {isDeployedWithNoUndeployedChanges && !isArchived && (
              <Button
                appearance="secondary"
                size="medium"
                disabled
                className="px-5 py-2 rounded-md font-medium"
              >
                Up to Date
              </Button>
            )}

            {isArchived && (
              <Button
                appearance="secondary"
                size="medium"
                disabled
                className="px-5 py-2 rounded-md font-medium"
              >
                Archived
              </Button>
            )}
          </div>
        </div>
      </Card>
      <span className="text-xs font-medium">History</span>
      <Card>
        <span>Version History Table</span>
      </Card>
      <UploadProjectFileUploadDialog
        open={activeDialog === "uploadXls"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
        assetUid={uid}
        surveyName={asset.name}
        destination={`${kpiUrl}/api/v2/assets/${uid}/`}
      />
    </div>
  );
};

export default AssetDetails;
