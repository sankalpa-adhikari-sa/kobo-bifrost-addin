import { useNavigate } from "react-router";
import { useStoredToken } from "../hooks/AuthProvider";
import { useGetOwner } from "../hooks/useMe";
import { SettingsIcon } from "../components/primitives/icons";
import { Button, Card, CardPreview, Spinner, Text } from "@fluentui/react-components";
import { AssetGroupForm } from "../components/forms/AssetGroupForm";
export const AssetGroups = () => {
  const { data: profileData, isLoading: isProfileLoading } = useGetOwner();

  const { token, kpiUrl } = useStoredToken();
  const navigate = useNavigate();

  if (!token || !kpiUrl) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card
          style={{
            backgroundColor: "var(--colorNeutralBackground3)",
          }}
          appearance="filled-alternative"
          className="w-full border-l-4 border-l-orange-400"
        >
          <CardPreview className="p-3">
            <div className="flex flex-col gap-2">
              <div className="text-orange-700 w-full font-semibold">Setup Required</div>
              <Text
                style={{
                  color: "var(--colorNeutralForeground3Hover)",
                }}
                size={100}
                className=" mb-2"
              >
                Configure your account to get started
              </Text>
              <Button
                appearance="primary"
                size="small"
                icon={<SettingsIcon />}
                onClick={() => navigate("/token-manager")}
                className="float-right"
              >
                Setup Account
              </Button>
            </div>
          </CardPreview>
        </Card>
      </div>
    );
  }
  if (!profileData || isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-screen">
        <Spinner size="large" labelPosition="below" label="Loading Profile details..." />
      </div>
    );
  }
  return (
    <div className="p-4 min-h-screen  flex flex-col gap-2">
      <AssetGroupForm data={profileData.extra_details.asset_groups} />
    </div>
  );
};
