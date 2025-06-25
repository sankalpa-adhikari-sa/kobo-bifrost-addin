import { Avatar, Spinner } from "@fluentui/react-components";
import { useGetOwner } from "../hooks/useMe";
import { UpdateProfile } from "../components/UpdateProfile";

const Profile = () => {
  const { data: profileData, isLoading: isProfileLoading } = useGetOwner();

  if (!profileData || isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="large" labelPosition="below" label="Loading Profile details..." />
      </div>
    );
  }

  return (
    <div className="p-2 min-h-screen  flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <Avatar />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{profileData.username}</span>
          <span className="text-xs italic">{profileData.email}</span>
        </div>
      </div>
      <UpdateProfile />
    </div>
  );
};

export default Profile;
