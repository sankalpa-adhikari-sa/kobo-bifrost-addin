import {
  PresenceBadgeStatus,
  Avatar,
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  Button,
  useId,
  Toaster,
} from "@fluentui/react-components";
import { useState } from "react";
import { CloneAssetDialog } from "../dialogs/CloneAssetDialog";
import { CloneIcon } from "../primitives/icons";
import { formatDate } from "../../../utils/utils";

interface deployedVerionType {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    content_hash: string;
    date_deployed: string;
    date_modified: string;
    uid: string;
    url: string;
  }[];
}

interface VersionItem {
  version: string;
  content_hash: string;
  date_deployed: string;
  date_modified: string;
  uid: string;
  url: string;
  status: PresenceBadgeStatus;
}

export const VersionHistoryTable = ({
  assetUid,
  deployedVersion,
}: {
  assetUid: string;
  deployedVersion: deployedVerionType;
}) => {
  const toasterId = useId("toaster");
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");

  const items: VersionItem[] = deployedVersion.results.map((result, index) => ({
    ...result,
    version: `v${deployedVersion.results.length - index}`,
    status: index === 0 ? "available" : "away",
  }));

  const handleCloneClick = (uid: string) => {
    setSelectedVersionId(uid);
    setCloneDialogOpen(true);
  };

  const handleCloneDialogClose = () => {
    setCloneDialogOpen(false);
    setSelectedVersionId("");
  };

  const columns: TableColumnDefinition<VersionItem>[] = [
    createTableColumn<VersionItem>({
      columnId: "version",
      compare: (a, b) => a.version.localeCompare(b.version),
      renderHeaderCell: () => <span className="text-xs">Version</span>,
      renderCell: (item) => (
        <TableCellLayout
          className="text-xs"
          media={
            <Avatar
              aria-label={item.version}
              name={item.version}
              badge={{ status: item.status }}
              size={32}
            />
          }
        >
          <div>
            <div style={{ fontWeight: 600 }}>{item.version}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {item.status === "available" ? "Current" : "Previous"}
            </div>
          </div>
        </TableCellLayout>
      ),
    }),

    createTableColumn<VersionItem>({
      columnId: "date_modified",
      compare: (a, b) => new Date(a.date_modified).getTime() - new Date(b.date_modified).getTime(),
      renderHeaderCell: () => <span className="text-xs">Modified</span>,
      renderCell: (item) => (
        <TableCellLayout className="text-xs">
          {formatDate(item.date_modified, "en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </TableCellLayout>
      ),
    }),
    createTableColumn<VersionItem>({
      columnId: "clone",
      renderHeaderCell: () => <span className="text-xs">Clone</span>,
      renderCell: (item) => (
        <TableCellLayout className="text-xs">
          <Button
            appearance="subtle"
            icon={<CloneIcon />}
            aria-label="Clone Asset"
            size="small"
            onClick={() => handleCloneClick(item.uid)}
          />
        </TableCellLayout>
      ),
    }),
  ];

  return (
    <div className="flex flex-col gap-2 pt-2">
      <span className="text-sm font-medium ">History</span>
      <Toaster toasterId={toasterId} />
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <DataGrid
          items={items}
          columns={columns}
          sortable
          getRowId={(item) => item.uid}
          focusMode="row_unstable"
          style={{
            minWidth: "300px",
            backgroundColor: "var(--colorNeutralBackground3)",
            borderRadius: "4px",
          }}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<VersionItem>>
            {({ item, rowId }) => (
              <DataGridRow<VersionItem> key={rowId}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>

      <CloneAssetDialog
        onClose={handleCloneDialogClose}
        assetId={assetUid}
        toasterId={toasterId}
        versionId={selectedVersionId}
        open={cloneDialogOpen}
      />
    </div>
  );
};
