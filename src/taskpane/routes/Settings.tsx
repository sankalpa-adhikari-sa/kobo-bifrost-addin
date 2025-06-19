import { useForm } from "react-hook-form";
import { useImportSurveyAssetFromFile } from "../hooks/useAssets";

type FormInputs = {
  file: FileList;
  destination: string;
  assetUid: string;
  name: string;
};

const Settings = () => {
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const mutation = useImportSurveyAssetFromFile();

  const onSubmit = (data: FormInputs) => {
    const file = data.file[0];
    mutation.mutate(
      {
        file,
        destination: data.destination,
        assetUid: data.assetUid,
        name: data.name,
      },
      {
        onSuccess: () => {
          console.log("Survey imported successfully!");
          reset();
        },
        onError: (error) => {
          console.error("Import failed:", error);
          console.log("Import failed.");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("destination")} placeholder="Destination URL" required />
      <input {...register("assetUid")} placeholder="Asset UID" required />
      <input {...register("name")} placeholder="Survey Name" required />
      <input type="file" {...register("file")} required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Importing..." : "Import Survey"}
      </button>
    </form>
  );
};
export default Settings;
