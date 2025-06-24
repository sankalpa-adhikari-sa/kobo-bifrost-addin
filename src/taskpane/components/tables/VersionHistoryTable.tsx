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
import { Copy20Regular } from "@fluentui/react-icons";
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
    <div>
      <span className="text-xs font-medium">History</span>

      <Toaster toasterId={toasterId} />
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <DataGrid
          items={items}
          columns={columns}
          sortable
          getRowId={(item) => item.uid}
          focusMode="row_unstable"
          style={{ minWidth: "300px" }}
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
