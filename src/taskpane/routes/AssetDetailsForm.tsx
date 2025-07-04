import { format } from "date-fns";
import {
  Card,
  Spinner,
  Text,
  Title3,
  useId,
  Toaster,
  MessageBar,
  MessageBarBody,
  Button,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
} from "@fluentui/react-components";
import { useAssetsById } from "../hooks/useAssets";
import { checkFormDeploymentStatus } from "../../utils/deploymentstatus";
import { useDeployForm, useRedeployForm } from "../hooks/useDeploy";
import { VersionHistoryTable } from "../components/tables/VersionHistoryTable";
import { CollectDataCard } from "../components/CollectDataCard";

const AssetDetailsForm = ({ assetUid }: { assetUid: string }) => {
  const { data: asset, isLoading, error } = useAssetsById(assetUid ?? "");
  const deployMutation = useDeployForm();
  const redeployMutation = useRedeployForm();
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  if (!assetUid) {
    return (
      <div className="p-4">
        <Title3>Error</Title3>
        <Text>Asset UID is missing from the URL.</Text>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading asset details..." />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="p-4">
        <Title3>Error</Title3>
        <Text>An error occurred while fetching asset details.</Text>
      </div>
    );
  }

  const {
    isArchived,
    isDeployedWithNoUndeployedChanges,
    needsFirstTimeDeployment,
    hasUndeployedChanges,
  } = checkFormDeploymentStatus(asset);

  let currentVersion: number;

  if (needsFirstTimeDeployment || hasUndeployedChanges) {
    currentVersion = asset.deployed_versions.count + 1;
  } else if (isDeployedWithNoUndeployedChanges) {
    currentVersion = asset.deployed_versions.count;
  } else {
    currentVersion = 0;
  }

  const handleDeployment = () => {
    deployMutation.mutate(
      {
        assetUid: assetUid,
        payload: {
          active: true,
        },
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Deployment Successful</ToastTitle>
              <ToastBody subtitle="Success">Successfully deployed an Asset</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Deployment Failed</ToastTitle>
              <ToastBody subtitle="Error">Failed to deployed an Asset</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  const handleRedeployment = () => {
    redeployMutation.mutate(
      {
        assetUid: assetUid,
        payload: {
          active: true,
          version_id: asset.version_id,
        },
      },
      {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>ReDeployment Successful</ToastTitle>
              <ToastBody subtitle="Success">Successfully redeployed an Asset</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>ReDeployment Failed</ToastTitle>
              <ToastBody subtitle="Error">Failed to redeployed an Asset</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      }
    );
  };

  return (
    <div className="pt-2 min-h-screen flex flex-col gap-2">
      <Toaster toasterId={toasterId} />
      <span className="text-sm font-medium ">Current Version</span>

      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
        }}
        className="p-6 space-y-2 shadow-lg rounded-lg"
      >
        {(hasUndeployedChanges || needsFirstTimeDeployment) && (
          <MessageBar style={{ minHeight: "auto" }} intent="warning" layout="multiline" as="div">
            <MessageBarBody>
              <span className="text-xs break-words whitespace-normal">
                If you want to make these changes public, you must deploy this form.
              </span>
            </MessageBarBody>
          </MessageBar>
        )}

        <div className="flex flex-row justify-between items-center gap-4">
          <div className="text-xs  space-y-2">
            <div>
              <span className="font-semibold italic">Version:</span> v{currentVersion}{" "}
              {needsFirstTimeDeployment || hasUndeployedChanges ? (
                <span className="text-orange-600 font-medium">(undeployed)</span>
              ) : null}
            </div>
            <div>
              <span className="font-semibold italic">Last Modified:</span>{" "}
              {asset.date_modified
                ? format(new Date(asset.date_modified), "MMMM d, yyyy h:mm a")
                : "N/A"}
            </div>
            <div>
              <span className="font-semibold italic">Questions:</span>{" "}
              {asset.summary.row_count ? asset.summary.row_count : "-"}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {needsFirstTimeDeployment && (
              <Button
                appearance="primary"
                size="medium"
                className="px-5 py-2 rounded-md font-medium"
                onClick={handleDeployment}
                disabled={deployMutation.isPending}
              >
                {deployMutation.isPending ? "Deploying....." : "Deploy"}
              </Button>
            )}

            {hasUndeployedChanges && !isArchived && (
              <Button
                appearance="primary"
                size="medium"
                className="px-5 py-2 rounded-md font-medium"
                onClick={handleRedeployment}
                disabled={redeployMutation.isPending}
              >
                {redeployMutation.isPending ? "Redeploying....." : "Redploy"}
              </Button>
            )}

            {isDeployedWithNoUndeployedChanges && !isArchived && (
              <Button
                appearance="secondary"
                size="medium"
                disabled
                className="px-5 py-2 rounded-md font-medium"
              >
                Up to Date
              </Button>
            )}

            {isArchived && (
              <Button
                appearance="secondary"
                size="medium"
                disabled
                className="px-5 py-2 rounded-md font-medium"
              >
                UnArchive
              </Button>
            )}
          </div>
        </div>
      </Card>
      {asset.deployed_versions.count > 0 && (
        <VersionHistoryTable assetUid={asset.uid} deployedVersion={asset.deployed_versions} />
      )}
      {asset.deployment__links && Object.keys(asset.deployment__links).length > 0 && (
        <CollectDataCard deploymentLinks={asset.deployment__links} assetUid={asset.uid} />
      )}
    </div>
  );
};

export default AssetDetailsForm;
