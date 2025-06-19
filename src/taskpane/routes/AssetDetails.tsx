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
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
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
import { UploadProjectFileUploadDialog } from "../components/UploadDialog";
import { useStoredToken } from "../hooks/useStoredToken";
import { checkFormDeploymentStatus } from "../../utils/deploymentstatus";
import { useDownloadXlsForm, useDownloadXmlForm } from "../hooks/useDownload";
import { useGetAssetSnapshots } from "../hooks/usePreview";
import { useDeployForm, useRedeployForm } from "../hooks/useDeploy";

type DialogType = "uploadXls" | "editMetadata" | "viewPreview";

const AssetDetails = () => {
  const { uid } = useParams<{ uid: string }>();

  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const { data: asset, isLoading, error } = useAssetsById(uid ?? "");
  const { kpiUrl } = useStoredToken();
  const xlsDownloadMutation = useDownloadXlsForm();
  const xmlDownloadMutation = useDownloadXmlForm();
  const previewMutation = useGetAssetSnapshots();
  const deployMutation = useDeployForm();
  const redeployMutation = useRedeployForm();
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

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

  let currentVersion: number;

  if (needsFirstTimeDeployment || hasUndeployedChanges) {
    currentVersion = asset.deployed_versions.count + 1;
  } else if (isDeployedWithNoUndeployedChanges) {
    currentVersion = asset.deployed_versions.count;
  } else {
    currentVersion = 0;
  }

  const handleDeployment = () => {
    deployMutation.mutate(
      {
        assetUid: uid,
        payload: {
          active: true,
        },
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Deployment Successful</ToastTitle>
              <ToastBody subtitle="Success">Successfully deployed an Asset</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Deployment Failed</ToastTitle>
              <ToastBody subtitle="Error">Failed to deployed an Asset</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  const handleRedeployment = () => {
    redeployMutation.mutate(
      {
        assetUid: uid,
        payload: {
          active: true,
          version_id: asset.version_id,
        },
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>ReDeployment Successful</ToastTitle>
              <ToastBody subtitle="Success">Successfully redeployed an Asset</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>ReDeployment Failed</ToastTitle>
              <ToastBody subtitle="Error">Failed to redeployed an Asset</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  const handlePreview = () => {
    if (!uid) return;

    previewMutation.mutate(
      { asset: `${kpiUrl}/api/v2/assets/${uid}/` },
      {
        onSuccess: (data) => {
          const url = data?.enketopreviewlink;
          if (url) {
            window.open(url, "_blank");
          } else {
            dispatchToast(
              <Toast>
                <ToastTitle>Preview Failed</ToastTitle>
                <ToastBody subtitle="No preview URL">
                  Could not find a valid preview link.
                </ToastBody>
              </Toast>,
              { intent: "error" }
            );
          }
        },
        onError: (error) => {
          console.error("Preview error:", error);
          dispatchToast(
            <Toast>
              <ToastTitle>Preview Failed</ToastTitle>
              <ToastBody subtitle="error">Unable to fetch the preview link.</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  const handleXmlDownload = () => {
    xmlDownloadMutation.mutate(uid, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${asset.name}.xml`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        dispatchToast(
          <Toast>
            <ToastTitle>XML form downloaded successfully!</ToastTitle>
            <ToastBody>The file has been saved to your downloads folder.</ToastBody>
          </Toast>,
          { intent: "success" }
        );
      },
      onError: (err) => {
        console.error("XML Download error:", err);
        dispatchToast(
          <Toast>
            <ToastTitle>Download Failed</ToastTitle>
            <ToastBody subtitle="error">Could not download the XML form.</ToastBody>
          </Toast>,
          { intent: "error" }
        );
      },
    });
  };

  const handleXlsDownload = () => {
    xlsDownloadMutation.mutate(uid, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${asset.name}.xls`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        dispatchToast(
          <Toast>
            <ToastTitle>XLS form downloaded successfully!</ToastTitle>
            <ToastBody>The file has been saved to your downloads folder.</ToastBody>
          </Toast>,
          { intent: "success" }
        );
      },
      onError: (err) => {
        console.error("XLS Download error:", err);
        dispatchToast(
          <Toast>
            <ToastTitle>Download Failed</ToastTitle>
            <ToastBody subtitle="error">Could not download the XLS form.</ToastBody>
          </Toast>,
          { intent: "error" }
        );
      },
    });
  };

  return (
    <div className="p-2 h-screen  flex flex-col gap-2">
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
                  onClick={handlePreview}
                  disabled={previewMutation.isPending}
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
                    <MenuItem onClick={handleXlsDownload} icon={<XlsFileIcon />}>
                      Download XLSForm
                    </MenuItem>
                    <MenuItem onClick={handleXmlDownload} icon={<XmlFileIcon />}>
                      Download XML form
                    </MenuItem>
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
                onClick={handleDeployment}
                disabled={deployMutation.isPending}
              >
                {deployMutation.isPending ? "Deploying....." : "Deploy"}
              </Button>
            )}

            {hasUndeployedChanges && !isArchived && (
              <Button
                appearance="primary"
                size="medium"
                className="px-5 py-2 rounded-md font-medium"
                onClick={handleRedeployment}
                disabled={redeployMutation.isPending}
              >
                {redeployMutation.isPending ? "Redeploying....." : "Redploy"}
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
                UnArchive
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
