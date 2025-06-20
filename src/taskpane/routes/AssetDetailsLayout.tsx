import { useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router";
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
  SettingsFilled,
  SettingsRegular,
} from "@fluentui/react-icons";
import { useAssetsById } from "../hooks/useAssets";
import { UpdateXlsFormsByFileUpload } from "../components/dialogs/UpdateProjectByFileUpload";
import { useStoredToken } from "../hooks/useStoredToken";
import { useDownloadXlsForm, useDownloadXmlForm } from "../hooks/useDownload";
import { useGetAssetSnapshots } from "../hooks/usePreview";
import { UpdateXlsFormsByUrlUpload } from "../components/dialogs/UpdateProjectByUrlUpload";

type DialogType = "xlsUpload" | "editMetadata" | "xlsUrlUpload";

const AssetDetailsLayout = () => {
  const { uid } = useParams<{ uid: string }>();

  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const { data: asset, isLoading, error } = useAssetsById(uid ?? "");
  const { kpiUrl } = useStoredToken();
  const xlsDownloadMutation = useDownloadXlsForm();
  const xmlDownloadMutation = useDownloadXmlForm();
  const previewMutation = useGetAssetSnapshots();

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const SettingsIcon = bundleIcon(SettingsFilled, SettingsRegular);
  const EyeIcon = bundleIcon(EyeFilled, EyeRegular);
  const HorizontalOptionIcon = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);
  const XlsFileIcon = bundleIcon(DocumentBulletListFilled, DocumentBulletListRegular);
  const XmlFileIcon = bundleIcon(
    DocumentBulletListMultipleFilled,
    DocumentBulletListMultipleRegular
  );
  const CloneIcon = bundleIcon(DocumentCopyFilled, DocumentCopyRegular);
  const UploadIcon = bundleIcon(ArrowUploadRegular, ArrowUploadRegular);
  const navigate = useNavigate();

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
    <div className="p-2 min-h-screen  flex flex-col gap-2">
      <Toaster toasterId={toasterId} />
      <Card>
        <CardHeader
          header={
            <Link to={`/assets/${uid}`} className="text-base font-medium">
              {asset.name}
            </Link>
          }
          description={asset.settings.description || "No description available."}
          action={
            <Toolbar size="small">
              <Tooltip content="Asset Settings" relationship="description" withArrow>
                <ToolbarButton
                  icon={<SettingsIcon />}
                  onClick={() => navigate(`/assets/${uid}/settings`)}
                />
              </Tooltip>
              <Tooltip content="View project preview" relationship="description" withArrow>
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
                    <MenuItem onClick={() => setActiveDialog("xlsUpload")}>Upload XLSForm</MenuItem>
                    <MenuItem onClick={() => setActiveDialog("xlsUrlUpload")}>
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

      <UpdateXlsFormsByFileUpload
        open={activeDialog === "xlsUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
        assetUid={uid}
        surveyName={asset.name}
        destination={`${kpiUrl}/api/v2/assets/${uid}/`}
      />
      <UpdateXlsFormsByUrlUpload
        open={activeDialog === "xlsUrlUpload"}
        onClose={() => setActiveDialog(null)}
        toasterId={toasterId}
        assetUid={uid}
        surveyName={asset.name}
        destination={`${kpiUrl}/api/v2/assets/${uid}/`}
      />
      <Outlet />
    </div>
  );
};
export default AssetDetailsLayout;
