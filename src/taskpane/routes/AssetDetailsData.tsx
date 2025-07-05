import { useSubmissionData } from "../hooks/useData";

export const AssetDetailsData = ({ assetUid }: { assetUid: string }) => {
  const { data: submissionData } = useSubmissionData({ assetUid });
  console.log(submissionData);
  return <div>AssetDetailsData {assetUid}</div>;
};
