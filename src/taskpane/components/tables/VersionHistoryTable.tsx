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
import { History20Regular, Copy20Regular } from "@fluentui/react-icons";
import { useState } from "react";
import { CloneAssetDialog } from "../dialogs/CloneAssetDialog";

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

  const handleCloneClick = (uid: string, url: string) => {
    console.log({ uid, url });
    setSelectedVersionId(uid);
    setCloneDialogOpen(true);
  };

  const handleCloneDialogClose = () => {
    setCloneDialogOpen(false);
    setSelectedVersionId("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: TableColumnDefinition<VersionItem>[] = [
    createTableColumn<VersionItem>({
      columnId: "version",
      compare: (a, b) => a.version.localeCompare(b.version),
      renderHeaderCell: () => "Version",
      renderCell: (item) => (
        <TableCellLayout
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
      columnId: "date_deployed",
      compare: (a, b) => new Date(a.date_deployed).getTime() - new Date(b.date_deployed).getTime(),
      renderHeaderCell: () => "Deployed",
      renderCell: (item) => (
        <TableCellLayout media={<History20Regular />}>
          {formatDate(item.date_deployed)}
        </TableCellLayout>
      ),
    }),
    createTableColumn<VersionItem>({
      columnId: "date_modified",
      compare: (a, b) => new Date(a.date_modified).getTime() - new Date(b.date_modified).getTime(),
      renderHeaderCell: () => "Modified",
      renderCell: (item) => <TableCellLayout>{formatDate(item.date_modified)}</TableCellLayout>,
    }),
    createTableColumn<VersionItem>({
      columnId: "clone",
      renderHeaderCell: () => "Clone",
      renderCell: (item) => (
        <TableCellLayout>
          <Button
            appearance="subtle"
            icon={<Copy20Regular />}
            aria-label="Clone Asset"
            size="small"
            onClick={() => handleCloneClick(item.uid, item.url)}
          />
        </TableCellLayout>
      ),
    }),
  ];

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ margin: 0, marginBottom: "8px" }}>Version History</h3>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          {deployedVersion.count} version{deployedVersion.count !== 1 ? "s" : ""} total
        </p>
      </div>
      <Toaster toasterId={toasterId} />

      <DataGrid
        items={items}
        columns={columns}
        sortable
        getRowId={(item) => item.uid}
        focusMode="row_unstable"
        style={{ minWidth: "100%" }}
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
