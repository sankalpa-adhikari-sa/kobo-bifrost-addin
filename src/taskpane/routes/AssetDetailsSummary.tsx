import { ProjectInformationCard } from "../components/cards/ProjectInformationCard";
import { SubmissionsCard } from "../components/cards/SubmissionsCard";

export const AssetDetailsSummary = ({ assetUid }: { assetUid: string }) => {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <ProjectInformationCard assetUid={assetUid} />
      <SubmissionsCard assetUid={assetUid} />
    </div>
  );
};
