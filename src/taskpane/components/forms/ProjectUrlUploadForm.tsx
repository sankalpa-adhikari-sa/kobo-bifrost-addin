import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input, Field, ProgressBar, Text, Card, CardHeader } from "@fluentui/react-components";
import { ProjectUrlUploadFormData } from "../../../validators/schema";
import { ProjectCreationProgress } from "../../hooks/useAssets";

interface ProjectUrlUploadFormProps {
  control: Control<ProjectUrlUploadFormData>;
  errors: FieldErrors<ProjectUrlUploadFormData>;
  progress: ProjectCreationProgress | null;
  isLoading: boolean;
}

export const ProjectUrlUploadForm = ({
  control,
  errors,
  progress,
  isLoading,
}: ProjectUrlUploadFormProps) => {
  return (
    <div className="space-y-4">
      <Field label="Project Name (Optional)" validationMessage={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Used only if form title is unspecified"
              disabled={isLoading}
            />
          )}
        />
      </Field>

      <Field
        label="XLSForm Url"
        validationState={errors.url ? "error" : undefined}
        validationMessage={errors.url?.message as string}
      >
        <Controller
          name="url"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Valid XLSform URL" disabled={isLoading} />
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
