import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import {
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  useId,
  Button,
  Spinner,
  Toaster,
} from "@fluentui/react-components";
import { ProfileFormData, profileSchema } from "../../validators/schema";
import { useEffect } from "react";
import ProfileForms from "./forms/ProfileForm";
import { useGetOwner, useUpdateProfile } from "../hooks/useMe";

export const UpdateProfile = () => {
  const { data: owner, isLoading: isOwnerLoading, isError: isOwnerError } = useGetOwner();
  const { mutate: updateProfileMutation, isPending: isUpdateProfilePending } = useUpdateProfile();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      country: undefined,
      city: "",
      sector: undefined,
      organization_type: undefined,
      organization: "",
      organization_website: "",
      bio: "",
      linkedin: "",
    },
  });

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  useEffect(() => {
    if (owner?.extra_details) {
      console.log("Resetting form with:", owner.extra_details);

      const resetData: ProfileFormData = {
        name: owner.extra_details.name || "",
        country: owner.extra_details.country || undefined,
        city: owner.extra_details.city || "",
        sector: owner.extra_details.sector || undefined,
        organization_type: owner.extra_details.organization_type || undefined,
        organization: owner.extra_details.organization || "",
        organization_website: owner.extra_details.organization_website || "",
        bio: owner.extra_details.bio || "",
        linkedin: owner.extra_details.linkedin || "",
      };

      reset(resetData);
    }
  }, [owner, reset]);

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form submitted with data:", data);

    const cleanedData: ProfileFormData = {
      ...data,
      organization_website:
        data.organization_website === "" ? undefined : data.organization_website,
      linkedin: data.linkedin === "" ? undefined : data.linkedin,
    };

    updateProfileMutation(
      {
        payload: cleanedData,
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Success</ToastTitle>
              <ToastBody subtitle="Updated">Successfully updated Profile.</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: (error: any) => {
          console.error("Update error:", error);
          dispatchToast(
            <Toast>
              <ToastTitle>Failed</ToastTitle>
              <ToastBody subtitle="Error">Could not update Profile.</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  if (isOwnerLoading) return <Spinner label="Loading User details..." />;
  if (isOwnerError || !owner) return <div>Error loading profile or profile not found.</div>;

  return (
    <div className="flex flex-col gap-2">
      <Toaster toasterId={toasterId} />

      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <ProfileForms
          control={control as Control<ProfileFormData>}
          errors={errors}
          isLoading={isUpdateProfilePending}
        />
        <Button type="submit" disabled={isUpdateProfilePending} appearance="primary">
          {isUpdateProfilePending ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};
