import {
  Body1,
  Button,
  Caption1,
  Checkbox,
  Divider,
  Spinner,
  Toast,
  Toaster,
  ToastTitle,
  useId,
  useToastController,
  MessageBar,
  MessageBarBody,
} from "@fluentui/react-components";
import { useAssetsById } from "../hooks/useAssets";
import { useArchiveAsset, useDeleteAsset } from "../hooks/useDanger";
import { ReusableDialog } from "./dialogs/ReusableDialog";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArchiveIcon,
  DeleteIcon,
  ErrorCircleIcon,
  UnArchiveIcon,
  WarningIcon,
} from "./primitives/icons";
import { useDestructiveStyles } from "./primitives/styles";

type DialogType = "deleteAsset" | "archiveAsset" | "unarchiveAsset";

interface DeleteCheckboxes {
  dataWillBeDeleted: boolean;
  formWillBeDeleted: boolean;
  understandPermanent: boolean;
}

export const DangerZone = ({ assetUid }: { assetUid: string }) => {
  const destructiveStyles = useDestructiveStyles();
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const [deleteCheckboxes, setDeleteCheckboxes] = useState<DeleteCheckboxes>({
    dataWillBeDeleted: false,
    formWillBeDeleted: false,
    understandPermanent: false,
  });

  const navigate = useNavigate();
  const { data: asset, isLoading: isAssetLoading, isError: isAssetError } = useAssetsById(assetUid);
  const { mutate: archiveMutation, isPending: isArchiveMutationPending } = useArchiveAsset();
  const { mutate: deleteMutation, isPending: isDeleteMutationPending } = useDeleteAsset();

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const handleDialogClose = () => {
    setActiveDialog(null);
    setDeleteCheckboxes({
      dataWillBeDeleted: false,
      formWillBeDeleted: false,
      understandPermanent: false,
    });
  };

  const handleCheckboxChange = (key: keyof DeleteCheckboxes, checked: boolean) => {
    setDeleteCheckboxes((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const areAllCheckboxesChecked = () => {
    return Object.values(deleteCheckboxes).every(Boolean);
  };

  if (isAssetLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="large" labelPosition="below" label="Loading asset details..." />
      </div>
    );
  }

  if (isAssetError || !asset) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ErrorCircleIcon filled className="text-red-600 text-5xl mb-4" />
        <Body1 className="text-xl font-semibold  mb-2">Failed to load asset</Body1>
        <Caption1 className=" max-w-md">
          There was an error retrieving the asset data. Please refresh the page or try again later.
        </Caption1>
      </div>
    );
  }

  const handleDelete = async (assetUid: string) => {
    deleteMutation(assetUid, {
      onSuccess: () => {
        navigate("/assets");
        dispatchToast(
          <Toast>
            <ToastTitle>Project Successfully Deleted</ToastTitle>
          </Toast>,
          { intent: "success" }
        );
      },
      onError: () => {
        dispatchToast(
          <Toast>
            <ToastTitle>Failed to Delete Project</ToastTitle>
          </Toast>,
          { intent: "error" }
        );
      },
    });
  };

  const handleArchive = async (assetUid: string) => {
    archiveMutation(
      {
        assetUid,
        payload: {
          active: false,
        },
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project Successfully Archived</ToastTitle>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Failed to Archive Project</ToastTitle>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  const handleUnArchive = async (assetUid: string) => {
    archiveMutation(
      {
        assetUid,
        payload: {
          active: true,
        },
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project Successfully Unarchived</ToastTitle>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Failed to Unarchive Project</ToastTitle>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <Toaster toasterId={toasterId} />

      <MessageBar
        style={{ minHeight: "auto" }}
        intent="error"
        layout="multiline"
        as="div"
        icon={<WarningIcon filled />}
      >
        <MessageBarBody>
          <div className="text-xs">
            These actions may be irreversible and may permanently affect your project. Please
            proceed with caution.
          </div>
        </MessageBarBody>
      </MessageBar>

      <div className="space-y-2">
        {asset.deployment_status === "deployed" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
            <div className="flex items-center gap-3">
              <ArchiveIcon filled className="shrink-0" />
              <div>
                <div className="text-sm font-medium ">Archive Project</div>
                <div className="text-xs  mt-0.5">
                  Temporarily disable this project. Forms will not accept new submissions while
                  archived.
                </div>
              </div>
            </div>
            <Button
              appearance="secondary"
              onClick={() => setActiveDialog("archiveAsset")}
              className="text-sm px-3 py-1.5 w-full sm:w-auto"
            >
              Archive
            </Button>
          </div>
        )}

        {asset.deployment_status === "archived" && asset.deployment__active === false && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
            <div className="flex items-center gap-3">
              <UnArchiveIcon filled className="shrink-0" />
              <div>
                <div className="text-sm font-medium ">Unarchive Project</div>
                <div className="text-xs  mt-0.5">
                  Restore this project to active status. Forms will resume accepting submissions.
                </div>
              </div>
            </div>
            <Button
              appearance="secondary"
              onClick={() => setActiveDialog("unarchiveAsset")}
              className="text-sm px-3 py-1.5 w-full sm:w-auto"
            >
              Unarchive
            </Button>
          </div>
        )}
        <Divider />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
          <div className="flex items-center gap-3">
            <DeleteIcon filled className="text-red-500 shrink-0" />
            <div>
              <div className="text-sm font-medium ">Delete Project</div>
              <div className="text-xs  mt-0.5">
                Permanently delete this project and all associated data. This action cannot be
                undone.
              </div>
            </div>
          </div>
          <Button
            className={destructiveStyles.destructive}
            icon={<DeleteIcon fontSize={16} className={destructiveStyles.destructiveIcon} />}
            appearance="primary"
            onClick={() => setActiveDialog("deleteAsset")}
          >
            Delete
          </Button>
        </div>
      </div>

      <ReusableDialog
        open={activeDialog === "deleteAsset"}
        onClose={handleDialogClose}
        title={`Delete "${asset.name}"`}
        onSubmit={() => {
          handleDelete(assetUid);
          handleDialogClose();
        }}
        submitText="Delete Project"
        isLoading={isDeleteMutationPending}
        submitDisabled={!areAllCheckboxesChecked()}
      >
        <div className="space-y-4">
          <MessageBar style={{ minHeight: "auto" }} intent="warning" layout="multiline" as="div">
            <MessageBarBody>
              <span className="text-xs">
                This action is permanent and irreversible Once deleted, this project and all its
                data cannot be recovered.
              </span>
            </MessageBarBody>
          </MessageBar>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={deleteCheckboxes.dataWillBeDeleted}
                onChange={(_, data) => handleCheckboxChange("dataWillBeDeleted", !!data.checked)}
              />
              <span className="text-xs ">
                I understand that all form submissions and data collected for this project will be
                permanently deleted.
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={deleteCheckboxes.formWillBeDeleted}
                onChange={(_, data) => handleCheckboxChange("formWillBeDeleted", !!data.checked)}
              />
              <span className="text-xs ">
                I understand that the form configuration and structure will be permanently deleted.
              </span>
            </label>

            <Divider />

            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={deleteCheckboxes.understandPermanent}
                onChange={(_, data) => handleCheckboxChange("understandPermanent", !!data.checked)}
              />
              <span className="text-xs font-medium ">
                I understand that this action is permanent and cannot be undone.
              </span>
            </label>
          </div>
        </div>
      </ReusableDialog>

      <ReusableDialog
        open={activeDialog === "archiveAsset"}
        onClose={handleDialogClose}
        title="Archive Project"
        onSubmit={() => {
          handleArchive(assetUid);
          handleDialogClose();
        }}
        submitText="Archive"
        isLoading={isArchiveMutationPending}
      >
        <div className="space-y-4">
          <MessageBar style={{ minHeight: "auto" }} intent="warning" layout="multiline" as="div">
            <MessageBarBody>
              <span className="text-xs">
                This project will be temporarily disabled but can be restored at any time.
              </span>
            </MessageBarBody>
          </MessageBar>

          <span className="text-xs">
            Your form will not accept new submissions while archived, but all existing data will be
            preserved.
          </span>
        </div>
      </ReusableDialog>

      <ReusableDialog
        open={activeDialog === "unarchiveAsset"}
        onClose={handleDialogClose}
        title="Unarchive Project"
        onSubmit={() => {
          handleUnArchive(assetUid);
          handleDialogClose();
        }}
        submitText="Unarchive"
        isLoading={isArchiveMutationPending}
      >
        <div className="space-y-4">
          <MessageBar style={{ minHeight: "auto" }} intent="info" layout="multiline" as="div">
            <MessageBarBody>
              <span className="text-xs">
                This project will be restored to active status and resume normal operation.
              </span>
            </MessageBarBody>
          </MessageBar>

          <span className="text-xs">
            Your form will resume accepting submissions and all functionality will be restored.
          </span>
        </div>
      </ReusableDialog>
    </div>
  );
};
