import { Badge, Card, Divider, Label, makeStyles, tokens } from "@fluentui/react-components";
import { useAssetsById } from "../../hooks/useAssets";
import { LoadingSkeleton } from "../primitives/LoadingSkeleton";

const useStyles = makeStyles({
  label: {
    color: tokens.colorNeutralForeground3,
  },
});

export const ProjectInformationCard = ({ assetUid }: { assetUid: string }) => {
  const { data: asset, isLoading: isAssetLoading } = useAssetsById(assetUid);
  const styles = useStyles();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Project Information</span>
      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label className={styles.label}>Description</Label>
            {isAssetLoading ? (
              <LoadingSkeleton size={24} />
            ) : (
              <span>{asset?.settings?.description || "No description available"}</span>
            )}
          </div>
          <Divider />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <Label className={styles.label}>Status</Label>
              {isAssetLoading ? (
                <LoadingSkeleton size={12} />
              ) : (
                <span>
                  <Badge appearance="tint" shape="rounded" className="capitalize">
                    {asset?.deployment_status}
                  </Badge>
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className={styles.label}>Questions</Label>
              {isAssetLoading ? (
                <LoadingSkeleton size={12} />
              ) : (
                <span>{asset?.summary?.row_count || 0}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className={styles.label}>Owner</Label>
              {isAssetLoading ? (
                <LoadingSkeleton size={12} />
              ) : (
                <span>{asset?.owner__username || "Unknown"}</span>
              )}
            </div>
          </div>
          <Divider />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <Label className={styles.label}>Last Modified</Label>
              {isAssetLoading ? (
                <LoadingSkeleton size={12} />
              ) : (
                <span>{asset?.date_modified || "N/A"}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className={styles.label}>Last Deployed</Label>
              {isAssetLoading ? (
                <LoadingSkeleton size={12} />
              ) : (
                <span>{asset?.date_deployed || "N/A"}</span>
              )}
            </div>
          </div>
          <Divider />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <Label className={styles.label}>Sector</Label>
              {isAssetLoading ? (
                <LoadingSkeleton size={12} />
              ) : (
                <span>{asset?.settings.sector.label}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className={styles.label}>Country</Label>
              {isAssetLoading ? (
                <LoadingSkeleton size={12} />
              ) : (
                <span>
                  {asset?.settings?.country
                    ?.map((items: { label: string; value: string }) => items.label)
                    .join(", ") || "N/A"}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
