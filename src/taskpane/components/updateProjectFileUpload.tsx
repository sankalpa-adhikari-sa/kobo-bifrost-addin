import { useState, useEffect } from "react";
import {
  useCreateProjectFromFile,
  ProjectCreationProgress,
  ProjectCreationError,
} from "../hooks/useAssets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Input,
  Field,
  useToastController,
  ProgressBar,
  Text,
  Card,
  CardHeader,
  Toast,
  ToastTitle,
  ToastBody,
} from "@fluentui/react-components";
import { ProjectFileUploadFormData, projectFileUploadschema } from "../../validators/schema";
import { AttachRegular } from "@fluentui/react-icons";

interface UploadProjectFileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  toasterId: string;
  assetUid: string;
  surveyName: string;
  destination: string;
}

export const UploadProjectFileUploadDialog = ({
  surveyName,
  assetUid,
  destination,
  open,
  onClose,
  toasterId,
}: UploadProjectFileUploadDialogProps) => {
  const [progress, setProgress] = useState<ProjectCreationProgress | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectFileUploadFormData>({
    resolver: zodResolver(projectFileUploadschema),
  });

  const { dispatchToast } = useToastController(toasterId);
  const { mutate: createProjectMutation, isPending: isCreateProjectPending } =
    useCreateProjectFromFile();

  const handleClose = () => {
    if (isCreateProjectPending) return;
    reset({ name: "", file: undefined });
    setProgress(null);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      reset({ name: "", file: undefined });
      setProgress(null);
    }
  }, [open, reset]);

  const getStepSpecificErrorMessage = (error: ProjectCreationError) => {
    switch (error.step) {
      case "asset_creation":
        return "Failed to initialize project.";
      case "file_import":
        return "Failed to upload file.";
      case "status_check":
        return "File uploaded but processing failed.";
      default:
        return "An unexpected error occurred.";
    }
  };

  const onSubmit = (data: ProjectFileUploadFormData) => {
    createProjectMutation(
      {
        assetUid: assetUid,
        destination: destination,
        file: data.file,
        name: data.name || data.file.name,
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
    <Dialog modalType="alert" open={open} onOpenChange={(_, data) => !data.open && handleClose()}>
      <DialogSurface className="max-w-xl w-full rounded-lg shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <DialogTitle className="text-sm font-bold mb-4 border-b pb-2">
              Update {surveyName}
            </DialogTitle>
            <DialogContent className="overflow-y-auto max-h-[70vh] pr-2 space-y-4">
              <Field label="Project Name (Optional)" validationMessage={errors.name?.message}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="If empty, filename will be used"
                      disabled={isCreateProjectPending}
                    />
                  )}
                />
              </Field>

              <Field
                label="XLSForm File"
                validationState={errors.file ? "error" : undefined}
                validationMessage={errors.file?.message as string}
              >
                <Controller
                  name="file"
                  control={control}
                  render={({ field }) => (
                    <div style={{ position: "relative" }}>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        style={{
                          position: "absolute",
                          opacity: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          zIndex: 1,
                        }}
                        aria-label="File upload"
                        disabled={isCreateProjectPending}
                      />
                      <Input
                        placeholder={field.value?.name || "Choose a .xls or .xlsx file..."}
                        readOnly
                        contentAfter={<AttachRegular />}
                        style={{ cursor: "pointer", width: "100%", height: "100%" }}
                        disabled={isCreateProjectPending}
                      />
                    </div>
                  )}
                />
              </Field>

              {progress && (
                <Card className="space-y-3 p-4 rounded-md">
                  <CardHeader
                    header={
                      <div className="flex justify-between items-center">
                        <Text weight="semibold">Creating Project...</Text>
                        <Text size={200}>{progress.progress}%</Text>
                      </div>
                    }
                  />
                  <ProgressBar value={progress.progress / 100} />
                  <div className="space-y-2">
                    {progress.steps.map((step, index) => (
                      <div
                        key={step.step}
                        className={`flex items-center space-x-2 text-sm ${step.completed ? "text-green-600" : progress.currentStep === step.step ? "text-blue-600 font-medium" : "text-gray-500"}`}
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">
                          {step.completed ? "✓" : index + 1}
                        </span>
                        <span>{step.message}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </DialogContent>
            <DialogActions className="pt-4 flex justify-end gap-2">
              <Button type="submit" appearance="primary" disabled={isCreateProjectPending}>
                {isCreateProjectPending ? "Creating..." : "Create"}
              </Button>
              <Button
                appearance="secondary"
                onClick={handleClose}
                disabled={isCreateProjectPending}
              >
                Cancel
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
