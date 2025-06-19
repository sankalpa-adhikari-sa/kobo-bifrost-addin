import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input, Field, ProgressBar, Text, Card, CardHeader } from "@fluentui/react-components";
import { ProjectFileUploadFormData } from "../../validators/schema";
import { ProjectCreationProgress } from "../hooks/useAssets";
import { AttachRegular } from "@fluentui/react-icons";

interface ProjectFileUploadFormProps {
  control: Control<ProjectFileUploadFormData>;
  errors: FieldErrors<ProjectFileUploadFormData>;
  progress: ProjectCreationProgress | null;
  isLoading: boolean;
}

export const ProjectFileUploadForm = ({
  control,
  errors,
  progress,
  isLoading,
}: ProjectFileUploadFormProps) => {
  return (
    <div className="space-y-4">
      <Field label="Project Name (Optional)" validationMessage={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="If empty, filename will be used" disabled={isLoading} />
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
                disabled={isLoading}
              />
              <Input
                placeholder={field.value?.name || "Choose a .xls or .xlsx file..."}
                readOnly
                contentAfter={<AttachRegular />}
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
                disabled={isLoading}
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
                className={`flex items-center space-x-2 text-sm ${
                  step.completed
                    ? "text-green-600"
                    : progress.currentStep === step.step
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                }`}
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
    </div>
  );
};
