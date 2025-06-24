import { Tab, TabList } from "@fluentui/react-components";
import {
  bundleIcon,
  SlideSettingsFilled,
  SlideSettingsRegular,
  ImageFilled,
  ImageRegular,
  ErrorCircleFilled,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import type { SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";
import { useState } from "react";
import MediaSettings from "../components/MediaSettings";
import { useParams } from "react-router";
import { UpdateProjectMetadata } from "../components/UpdateProjectMetadata";
import { DangerZone } from "../components/DangerZone";

const GeneralIcon = bundleIcon(SlideSettingsFilled, SlideSettingsRegular);
const MediaIcon = bundleIcon(ImageFilled, ImageRegular);
const DangerZoneIcon = bundleIcon(ErrorCircleFilled, ErrorCircleRegular);

const AssetDetailsSettings = () => {
  const [selectedValue, setSelectedValue] = useState<TabValue>("general");

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    console.log(event);
    setSelectedValue(data.value);
  };
  const { uid } = useParams<{ uid: string }>();
  if (!uid) {
    return <div>Uid not availbale</div>;
  }

  return (
    <div>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab id="General" icon={<GeneralIcon />} value="general">
          General
        </Tab>
        <Tab id="Media" icon={<MediaIcon />} value="media">
          Media
        </Tab>
        <Tab id="Action" icon={<DangerZoneIcon />} value="action">
          Action
        </Tab>
      </TabList>
      <div>
        {selectedValue === "general" && <UpdateProjectMetadata assetUid={uid} />}
        {selectedValue === "media" && <MediaSettings assetUid={uid} />}
        {selectedValue === "action" && <DangerZone assetUid={uid} />}
      </div>
    </div>
  );
};
export default AssetDetailsSettings;
