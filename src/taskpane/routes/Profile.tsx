import { Avatar, Button, Card, CardPreview, Spinner, Text } from "@fluentui/react-components";
import { useGetOwner } from "../hooks/useMe";
import { UpdateProfile } from "../components/UpdateProfile";
import { useStoredToken } from "../hooks/useStoredToken";
import { SettingsIcon } from "../components/primitives/icons";
import { useNavigate } from "react-router";

const Profile = () => {
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
      <div className="flex flex-row items-center gap-2">
        <Avatar />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{profileData.username}</span>
          <span className="text-xs italic">{profileData.email}</span>
        </div>
      </div>
      <Card
        style={{
          backgroundColor: "var(--colorNeutralBackground3)",
        }}
      >
        <UpdateProfile />
      </Card>
    </div>
  );
};

export default Profile;
