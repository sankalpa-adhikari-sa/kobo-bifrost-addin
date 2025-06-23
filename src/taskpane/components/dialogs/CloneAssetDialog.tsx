import { ReusableDialog } from "./ReusableDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { useToastController, Toast, ToastTitle, ToastBody } from "@fluentui/react-components";
import { CloneAssetFormData, cloneAssetFormSchema } from "../../../validators/schema";
import { useCloneAsset } from "../../hooks/useClone";
import { useEffect } from "react";
import CloneAssetForm from "../forms/CloneAssetForm";

interface CloneFormsProps {
  open: boolean;
  onClose: () => void;
  toasterId: string;
  assetId: string;
  versionId?: string;
}

export const CloneAssetDialog = ({
  open,
  onClose,
  toasterId,
  assetId,
  versionId,
}: CloneFormsProps) => {
  const { mutate: cloneAssetMutation, isPending: isCloneAssetPending } = useCloneAsset();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CloneAssetFormData>({
    resolver: zodResolver(cloneAssetFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const { dispatchToast } = useToastController(toasterId);

  const onSubmit = (data: CloneAssetFormData) => {
    const payload: any = {
      name: data.name,
      clone_from: assetId,
    };

    if (versionId !== undefined) {
      payload.clone_from_version_id = versionId;
    }
    cloneAssetMutation(payload, {
      onSuccess: () => {
        dispatchToast(
          <Toast>
            <ToastTitle>Asset Cloned</ToastTitle>
            <ToastBody subtitle="Subtitle">Successfully Cloned an asset</ToastBody>
          </Toast>,
          { intent: "success" }
        );
        onClose();
        reset();
      },
      onError: (error: any) => {
        console.error("Clone asset error:", error);
        dispatchToast(
          <Toast>
            <ToastTitle>Failed</ToastTitle>
            <ToastBody subtitle="Error">Could not clone asset.</ToastBody>
          </Toast>,
          { intent: "error" }
        );
      },
    });
  };

  const handleClose = () => {
    if (isCloneAssetPending) return;
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <ReusableDialog
      open={open}
      onClose={handleClose}
      title={"Clone an asset"}
      onSubmit={handleSubmit(onSubmit)}
      submitText="Clone"
      isLoading={isCloneAssetPending}
    >
      <CloneAssetForm
        control={control as Control<CloneAssetFormData>}
        errors={errors}
        isLoading={isCloneAssetPending}
      />
    </ReusableDialog>
  );
};
