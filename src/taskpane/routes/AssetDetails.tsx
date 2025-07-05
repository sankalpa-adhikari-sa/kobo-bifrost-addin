import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue,
  Text,
  Title3,
} from "@fluentui/react-components";
import { useState } from "react";
import { useParams } from "react-router";
import { FormIcon, SummaryIcon } from "../components/primitives/icons";
import { AssetDetailsData } from "./AssetDetailsData";
import { AssetDetailsSummary } from "./AssetDetailsSummary";
import AssetDetailsForm from "./AssetDetailsForm";

export const AssetDetails = () => {
  const { uid } = useParams<{ uid: string }>();
  const [selectedValue, setSelectedValue] = useState<TabValue>("summary");

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  if (!uid) {
    return (
      <div className="p-4">
        <Title3>Error</Title3>
        <Text>Asset UID is missing from the URL.</Text>
      </div>
    );
  }
  return (
    <div>
      <TabList size="small" selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab id="Summary" icon={<SummaryIcon />} value="summary">
          Summary
        </Tab>
        <Tab id="Form" icon={<FormIcon />} value="form">
          Form
        </Tab>
        {/* <Tab id="Data" icon={<TableIcon />} value="data">
          Data
        </Tab> */}
      </TabList>
      <div className="mt-2">
        {selectedValue === "summary" && <AssetDetailsSummary assetUid={uid} />}
        {selectedValue === "form" && <AssetDetailsForm assetUid={uid} />}
        {selectedValue === "data" && <AssetDetailsData assetUid={uid} />}
      </div>
    </div>
  );
};
