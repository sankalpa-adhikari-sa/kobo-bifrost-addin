import { useNavigate } from "react-router";
import { useGetOwner } from "../hooks/useMe";
import { useStoredToken } from "../hooks/AuthProvider";
import { AddIcon, InfoIcon, SettingsIcon } from "../components/primitives/icons";
import { Button, Card, CardPreview, Divider, Spinner, Text } from "@fluentui/react-components";
import AssetsTable from "../components/tables/AssetTable";

export const AssetGroupsLayout = () => {
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
      <div className="text-base font-medium flex flex-row items-center justify-between">
        <span>Asset Groups</span>
        <Button
          onClick={() => navigate("/asset-groups/add")}
          icon={<AddIcon fontSize={18} />}
          appearance="primary"
        >
          Add
        </Button>
      </div>
      {profileData.extra_details.asset_groups ? (
        profileData.extra_details.asset_groups.map((item: { label: string; value: string }) => (
          <div>
            <AssetsTable group={item} />
            <Divider className="my-4" />
          </div>
        ))
      ) : (
        <Card
          style={{
            backgroundColor: "var(--colorNeutralBackground3)",
            marginTop: "12px",
          }}
        >
          <div className="flex flex-col gap-2 items-center">
            <InfoIcon filled primaryFill="var(--colorNeutralForeground2)" fontSize={20} />
            <span style={{ color: "var(--colorNeutralForeground2)", fontSize: "14px" }}>
              No asset groups found
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};
