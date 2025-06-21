import { Tab, TabList } from "@fluentui/react-components";
import {
  bundleIcon,
  SlideSettingsFilled,
  SlideSettingsRegular,
  ImageFilled,
  ImageRegular,
} from "@fluentui/react-icons";
import type { SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";
import { useState } from "react";
import MediaSettings from "../components/MediaSettings";
import { useParams } from "react-router";

const GeneralIcon = bundleIcon(SlideSettingsFilled, SlideSettingsRegular);
const MediaIcon = bundleIcon(ImageFilled, ImageRegular);

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
      </TabList>
      <div>
        {selectedValue === "general" && <div>General</div>}
        {selectedValue === "media" && <MediaSettings assetUid={uid} />}
      </div>
    </div>
  );
};
export default AssetDetailsSettings;
