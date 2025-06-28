import EmptyAssetForm from "../forms/EmptyAssetForm";
import { ReusableDialog } from "./ReusableDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { useToastController, Toast, ToastTitle, ToastBody } from "@fluentui/react-components";
import { EmptySurveyAssetFormData, emptySurveyAssetFormSchema } from "../../../validators/schema";
import { useCreateEmptySurveyAsset } from "../../hooks/useAssets";
import { useEffect } from "react";

interface CreateEmptyFormsProps {
  open: boolean;
  onClose: () => void;
  toasterId: string;
}

export const CreateEmptySurveyAsset = ({ open, onClose, toasterId }: CreateEmptyFormsProps) => {
  const { mutate: createSurveyAsset, isPending: isCreateSurveyAssetPending } =
    useCreateEmptySurveyAsset();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EmptySurveyAssetFormData>({
    resolver: zodResolver(emptySurveyAssetFormSchema),
    defaultValues: {
      name: "",
      settings: {
        description: "",
        operational_purpose: null,
        collects_pii: null,
      },
      asset_type: "survey",
    },
  });
  const { dispatchToast } = useToastController(toasterId);

  const onSubmit = (data: EmptySurveyAssetFormData) => {
    createSurveyAsset(data, {
      onSuccess: () => {
        dispatchToast(
          <Toast>
            <ToastTitle>Asset created</ToastTitle>
            <ToastBody subtitle="Subtitle">Successfully created an Empty asset</ToastBody>
          </Toast>,
          { intent: "success" }
        );

        handleClose();
      },
      onError: (error: any) => {
        console.error("Create asset error:", error);
        dispatchToast(
          <Toast>
            <ToastTitle>Failed</ToastTitle>
            <ToastBody subtitle="Error">Could not create asset.</ToastBody>
          </Toast>,
          { intent: "error" }
        );
      },
    });
  };

  const handleClose = () => {
    if (isCreateSurveyAssetPending) return;
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
      title={"Create a new survey"}
      onSubmit={handleSubmit(onSubmit)}
      submitText="Create"
      isLoading={isCreateSurveyAssetPending}
    >
      <EmptyAssetForm
        control={control as Control<EmptySurveyAssetFormData>}
        errors={errors}
        isLoading={isCreateSurveyAssetPending}
      />
    </ReusableDialog>
  );
};
