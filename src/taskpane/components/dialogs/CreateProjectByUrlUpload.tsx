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

interface CreateXlsFormsProps {
  open: boolean;
  onClose: () => void;
  toasterId: string;
}

export const CreateXlsFormsByUrlUpload = ({ open, onClose, toasterId }: CreateXlsFormsProps) => {
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
  const { mutate: createProjectMutation, isPending: isCreateProjectPending } =
    useCreateProjectFromUrl();

  const handleClose = () => {
    if (isCreateProjectPending) return;
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
    createProjectMutation(
      {
        form_url: data.url,
        name: data.name,
        asset_type: "empty",
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project Created</ToastTitle>
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
              <ToastTitle>Project Creation Failed</ToastTitle>
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
      title={"Create a new survey"}
      onSubmit={handleSubmit(onSubmit)}
      submitText="Create"
      isLoading={isCreateProjectPending}
    >
      <ProjectUrlUploadForm
        control={control}
        errors={errors}
        progress={progress}
        isLoading={isCreateProjectPending}
      />
    </ReusableDialog>
  );
};
