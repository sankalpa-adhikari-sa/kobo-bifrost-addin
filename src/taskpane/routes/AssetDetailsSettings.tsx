import { Tab, TabList } from "@fluentui/react-components";
import type { SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";
import { useState } from "react";
import MediaSettings from "../components/MediaSettings";
import { useParams } from "react-router";
import { UpdateProjectMetadata } from "../components/UpdateProjectMetadata";
import { DangerZone } from "../components/DangerZone";
import {
  ActivityIcon,
  ErrorCircleIcon,
  GeneralIcon,
  MediaIcon,
} from "../components/primitives/icons";
import { AssetActivity } from "../components/AssetActivity";

const AssetDetailsSettings = () => {
  const [selectedValue, setSelectedValue] = useState<TabValue>("general");

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };
  const { uid } = useParams<{ uid: string }>();
  if (!uid) {
    return <div>Uid not availbale</div>;
  }

  return (
    <div>
      <TabList size="small" selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab id="General" icon={<GeneralIcon />} value="general">
          General
        </Tab>
        <Tab id="Media" icon={<MediaIcon />} value="media">
          Media
        </Tab>
        <Tab id="Action" icon={<ErrorCircleIcon />} value="action">
          Action
        </Tab>
        <Tab id="Activity" icon={<ActivityIcon />} value="activity">
          Activity
        </Tab>
      </TabList>
      <div>
        {selectedValue === "general" && <UpdateProjectMetadata assetUid={uid} />}
        {selectedValue === "media" && <MediaSettings assetUid={uid} />}
        {selectedValue === "action" && <DangerZone assetUid={uid} />}
        {selectedValue === "activity" && <AssetActivity assetUid={uid} />}
      </div>
    </div>
  );
};
export default AssetDetailsSettings;
