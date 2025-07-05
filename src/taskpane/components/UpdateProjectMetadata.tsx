import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import AssetMetadataForm from "./forms/AssetMetadataForm";
import {
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  useId,
  Button,
  Spinner,
  Card,
  Toaster,
} from "@fluentui/react-components";
import { ProjectMetadataFormData, projectMetadataFormSchema } from "../../validators/schema";
import { useAssetsById, useUpdateProjectMetadata } from "../hooks/useAssets";
import { useEffect } from "react";
import { useGetOwner } from "../hooks/useMe";

export const UpdateProjectMetadata = ({ assetUid }: { assetUid: string }) => {
  const { data: asset, isLoading: isAssetLoading, isError: isAssetError } = useAssetsById(assetUid);
  const { data: profileData, isLoading: isProfileLoading } = useGetOwner();

  const { mutate: updateMetadataMutation, isPending: isUpdateMetadataPending } =
    useUpdateProjectMetadata();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectMetadataFormData>({
    resolver: zodResolver(projectMetadataFormSchema),
    defaultValues: {
      name: "",
      settings: {
        description: "",
      },
    },
  });

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name || "",
        settings: {
          description: asset.settings?.description || "",
          sector: asset.settings?.sector || "",
          country: asset.settings?.country || [],
          group: asset.settings?.group || undefined,
        },
      });
    }
  }, [asset, reset]);

  const onSubmit = (data: ProjectMetadataFormData) => {
    updateMetadataMutation(
      { assetUid, payload: data },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Success</ToastTitle>
              <ToastBody subtitle="Updated">Successfully updated asset metadata.</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: (error: any) => {
          console.error("Update error:", error);
          dispatchToast(
            <Toast>
              <ToastTitle>Failed</ToastTitle>
              <ToastBody subtitle="Error">Could not update asset metadata.</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  if (isAssetLoading || isProfileLoading) return <Spinner label="Loading asset..." />;
  if (isAssetError || !asset) return <div>Error loading asset data or asset not found.</div>;
  const asset_groups = profileData.extra_details.asset_groups;

  return (
    <Card
      style={{
        backgroundColor: "var(--colorNeutralBackground3)",
      }}
      className="flex flex-col gap-2 mt-2"
    >
      <Toaster toasterId={toasterId} />
      <AssetMetadataForm
        control={control as Control<ProjectMetadataFormData>}
        errors={errors}
        isLoading={isUpdateMetadataPending}
        asset_groups={asset_groups}
      />
      <Button type="submit" onClick={handleSubmit(onSubmit)} appearance="primary">
        Submit
      </Button>
    </Card>
  );
};
