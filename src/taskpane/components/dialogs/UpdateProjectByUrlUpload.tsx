import { useState, useEffect } from "react";
import {
  ProjectCreationProgress,
  ProjectCreationError,
  useCreateProjectFromUrl,
} from "../../hooks/useAssets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToastController, Toast, ToastTitle, ToastBody } from "@fluentui/react-components";
import { ProjectUrlUploadFormData, projectUrlUploadschema } from "../../../validators/schema";

import { ReusableDialog } from "./ReusableDialog";
import { ProjectUrlUploadForm } from "../forms/ProjectUrlUploadForm";

interface UpdateXlsFormsProps {
  open: boolean;
  onClose: () => void;
  toasterId: string;
  assetUid: string;
  surveyName: string;
  destination: string;
}

export const UpdateXlsFormsByUrlUpload = ({
  surveyName,
  assetUid,
  destination,
  open,
  onClose,
  toasterId,
}: UpdateXlsFormsProps) => {
  const [progress, setProgress] = useState<ProjectCreationProgress | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectUrlUploadFormData>({
    resolver: zodResolver(projectUrlUploadschema),
  });

  const { dispatchToast } = useToastController(toasterId);
  const { mutate: updateProjectMutation, isPending: isUpdateProjectPending } =
    useCreateProjectFromUrl();

  const handleClose = () => {
    if (isUpdateProjectPending) return;
    reset({ name: "", url: undefined });
    setProgress(null);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset({ name: "", url: undefined });
      setProgress(null);
    }
  }, [open, reset]);

  const getStepSpecificErrorMessage = (error: ProjectCreationError) => {
    switch (error.step) {
      case "asset_creation":
        return "Failed to initialize project.";
      case "file_import":
        return "Failed to import XLSform url.";
      case "status_check":
        return "XLSfrom import processing failed.";
      default:
        return "An unexpected error occurred.";
    }
  };

  const onSubmit = (data: ProjectUrlUploadFormData) => {
    updateProjectMutation(
      {
        assetUid: assetUid,
        destination: destination,
        form_url: data.url,
        name: data.name,
        asset_type: "empty",
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project Updated</ToastTitle>
            </Toast>,
            { intent: "success" }
          );
          handleClose();
        },
        onError: (error: Error) => {
          const creationError = error as ProjectCreationError;
          const specificMessage = getStepSpecificErrorMessage(creationError);
          dispatchToast(
            <Toast>
              <ToastTitle>Project Update Failed</ToastTitle>
              <ToastBody subtitle={`Error: ${creationError.step || "Unknown"}`}>
                {specificMessage}
              </ToastBody>
            </Toast>,
            { intent: "error" }
          );
          setProgress(null);
        },
      }
    );
  };

  return (
    <ReusableDialog
      open={open}
      onClose={handleClose}
      title={`Update ${surveyName}`}
      onSubmit={handleSubmit(onSubmit)}
      submitText="Update"
      isLoading={isUpdateProjectPending}
    >
      <ProjectUrlUploadForm
        control={control}
        errors={errors}
        progress={progress}
        isLoading={isUpdateProjectPending}
      />
    </ReusableDialog>
  );
};
