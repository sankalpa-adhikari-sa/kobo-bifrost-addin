import * as React from "react";
import {
  FolderRegular,
  DeleteRegular,
  bundleIcon,
  InfoRegular,
  PersonRegular,
  CalendarRegular,
  EyeFilled,
  EyeRegular,
} from "@fluentui/react-icons";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableSelectionCell,
  TableCellLayout,
  useTableFeatures,
  TableColumnDefinition,
  useTableSelection,
  useTableSort,
  createTableColumn,
  TableColumnId,
  Badge,
  useArrowNavigationGroup,
  Toolbar,
  ToolbarButton,
  TableCellActions,
  Button,
  useId,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  BadgeProps,
  SelectionItemId,
} from "@fluentui/react-components";
import { useAssets, useBulkAssetAction, useDeleteAsset } from "../hooks/useAssets";
import {
  TeachingPopover,
  TeachingPopoverBody,
  TeachingPopoverHeader,
  TeachingPopoverTitle,
  TeachingPopoverSurface,
  TeachingPopoverTrigger,
} from "@fluentui/react-components";
import { useNavigate } from "react-router";

interface RawAssetSettings {
  sector?: {
    label: string;
  };
  country?: Array<{
    label: string;
  }>;
}

interface RawAssetItem {
  name?: string;
  owner__username?: string;
  deployment_status?: string;
  date_modified?: string;
  date_deployed?: string | null;
  deployment__submission_count?: number;
  asset_type?: string;
  settings?: RawAssetSettings;
  uid?: string;
}

interface AssetsApiResponse {
  results?: RawAssetItem[];
}

interface AssetItem {
  name: string;
  owner_username: string;
  deployment_status: string;
  date_modified: string;
  date_deployed: string | null;
  deployment__submission_count: number;
  asset_type: string;
  sector: string;
  country: string;
  uid: string;
}

interface UseAssetsReturn {
  data?: AssetsApiResponse;
  isLoading: boolean;
  error: Error | null;
}

interface UseDeleteAssetReturn {
  mutate: (
    uid: string,
    options?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => void;
  isPending: boolean;
}

interface BulkActionPayload {
  asset_uids: string[];
  action: "delete";
}

interface UseBulkAssetActionReturn {
  mutate: (
    data: { payload: BulkActionPayload },
    options?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => void;
  isPending: boolean;
}

interface StatusBadgeConfig {
  appearance: BadgeProps["appearance"];
  color: BadgeProps["color"];
}

const getStatusBadgeConfig = (status: string): StatusBadgeConfig => {
  const isDeployed = status.toLowerCase() === "deployed";
  return {
    appearance: isDeployed ? "filled" : "outline",
    color: isDeployed ? "success" : "warning",
  };
};

const transformData = (rawData: RawAssetItem[]): AssetItem[] => {
  return rawData.map(
    (item): AssetItem => ({
      name: item.name || "N/A",
      owner_username: item.owner__username || "N/A",
      deployment_status: item.deployment_status || "N/A",
      date_modified: item.date_modified || "N/A",
      date_deployed: item.date_deployed || null,
      deployment__submission_count: item.deployment__submission_count || 0,
      asset_type: item.asset_type || "N/A",
      sector: item.settings?.sector?.label || "N/A",
      country: item.settings?.country?.[0]?.label || "N/A",
      uid: item.uid || "",
    })
  );
};

const formatDateShort = (dateString: string | null): string => {
  if (!dateString) return "Not deployed";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string): React.ReactElement => {
  const config = getStatusBadgeConfig(status);
  return (
    <Badge appearance={config.appearance} color={config.color} size="small">
      {status}
    </Badge>
  );
};

const columns: TableColumnDefinition<AssetItem>[] = [
  createTableColumn<AssetItem>({
    columnId: "name",
    compare: (a, b) => a.name.localeCompare(b.name),
  }),
  createTableColumn<AssetItem>({
    columnId: "deployment_status",
    compare: (a, b) => a.deployment_status.localeCompare(b.deployment_status),
  }),
  createTableColumn<AssetItem>({
    columnId: "date_modified",
    compare: (a, b) => new Date(a.date_modified).getTime() - new Date(b.date_modified).getTime(),
  }),
  createTableColumn<AssetItem>({
    columnId: "deployment__submission_count",
    compare: (a, b) => a.deployment__submission_count - b.deployment__submission_count,
  }),
];

const Assets: React.FC = () => {
  const { data, isLoading, error } = useAssets() as UseAssetsReturn;
  const { mutate: deleteAssetMutation, isPending: isDeleting } =
    useDeleteAsset() as UseDeleteAssetReturn;
  const { mutate: bulkDeleteAssetMutation, isPending: isBulkDeleting } =
    useBulkAssetAction() as UseBulkAssetActionReturn;

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [selectedItems, setSelectedItems] = React.useState<Set<SelectionItemId>>(
    new Set<SelectionItemId>()
  );

  const items = React.useMemo((): AssetItem[] => {
    if (!data?.results || data.results.length === 0) return [];
    return transformData(data.results);
  }, [data]);

  const {
    getRows,
    selection: { allRowsSelected, someRowsSelected, toggleAllRows, toggleRow, isRowSelected },
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures(
    {
      columns,
      items,
      getRowId: (item: AssetItem) => item.uid,
    },
    [
      useTableSelection({
        selectionMode: "multiselect",
        selectedItems: selectedItems,
        onSelectionChange: (_, data) => setSelectedItems(data.selectedItems),
      }),
      useTableSort({
        defaultSortState: { sortColumn: "date_modified", sortDirection: "descending" },
      }),
    ]
  );

  const selectedUids: string[] = Array.from(selectedItems).map((id) => String(id));
  const selectedCount: number = selectedUids.length;
  const isDeleting_any: boolean = isDeleting || isBulkDeleting;

  const handleDialogClose = React.useCallback((): void => {
    setIsDialogOpen(false);
  }, []);

  const handleDelete = React.useCallback(async (): Promise<void> => {
    if (selectedCount === 0) return;

    const onSuccess = (): void => {
      const message = selectedCount === 1 ? "Project deleted!" : "Projects deleted!";
      dispatchToast(
        <Toast>
          <ToastTitle>{message}</ToastTitle>
        </Toast>,
        { intent: "success" }
      );

      setSelectedItems(new Set());
      handleDialogClose();
    };

    const onError = (err: any): void => {
      console.error("Delete operation failed:", err);
      const message =
        selectedCount === 1 ? "Failed to delete project" : "Failed to delete projects";
      dispatchToast(
        <Toast>
          <ToastTitle>{message}</ToastTitle>
          <ToastBody subtitle="error">{err.message || "An unknown error occurred."}</ToastBody>
        </Toast>,
        { intent: "error" }
      );
    };

    if (selectedCount === 1) {
      deleteAssetMutation(selectedUids[0], { onSuccess, onError });
    } else {
      bulkDeleteAssetMutation(
        { payload: { asset_uids: selectedUids, action: "delete" } },
        { onSuccess, onError }
      );
    }
  }, [
    selectedCount,
    selectedUids,
    deleteAssetMutation,
    bulkDeleteAssetMutation,
    dispatchToast,
    handleDialogClose,
    setSelectedItems,
  ]);

  const sortedRows = sort(
    getRows((row) => ({
      ...row,
      onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === " " && !e.defaultPrevented) {
          e.preventDefault();
          toggleRow(e, row.rowId);
        }
      },
      selected: isRowSelected(row.rowId),
      appearance: isRowSelected(row.rowId) ? ("brand" as const) : ("none" as const),
    }))
  );

  const onClickCellActions = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onKeyDownCellActions = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const keyboardNavAttr = useArrowNavigationGroup({ axis: "grid" });
  const EyeIcon = bundleIcon(EyeFilled, EyeRegular);

  const handleViewAsset = React.useCallback(
    (assetUid: string, e: React.MouseEvent): void => {
      e.stopPropagation();
      e.preventDefault();
      navigate(`${assetUid}`);
    },
    [navigate]
  );

  const headerSortProps = (columnId: TableColumnId) => ({
    onClick: (e: React.MouseEvent) => {
      toggleColumnSort(e, columnId);
    },
    sortDirection: getSortDirection(columnId),
  });

  if (isLoading) {
    return <div>Loading assets...</div>;
  }

  if (error) {
    return <div>Error loading assets: {error.message}</div>;
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        No assets available
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <Toaster toasterId={toasterId} />
      <Toolbar
        style={{
          marginBottom: "8px",
          paddingLeft: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
        size="small"
      >
        <div style={{ fontSize: "14px", color: "#666", fontWeight: 500 }}>
          {items.length} asset{items.length !== 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {selectedCount > 0 && (
            <span style={{ fontSize: "13px", color: "#666", fontWeight: 500 }}>
              {selectedCount} selected
            </span>
          )}
          <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
              <ToolbarButton
                disabled={selectedCount < 1 || isDeleting_any}
                icon={<DeleteRegular />}
                appearance="primary"
                onClick={() => setIsDialogOpen(true)}
              />
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Delete {selectedCount === 1 ? "Asset" : "Assets"}</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete{" "}
                  {selectedCount === 1 ? "this asset" : `these ${selectedCount} assets`}? This
                  action cannot be undone.
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={isDeleting_any}
                    icon={<DeleteRegular />}
                    onClick={handleDelete}
                    appearance="primary"
                  >
                    {isDeleting_any ? "Deleting..." : "Delete"}
                  </Button>
                  <Button
                    appearance="secondary"
                    onClick={handleDialogClose}
                    disabled={isDeleting_any}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>
      </Toolbar>

      <div
        style={{
          width: "100%",
          height: "400px",
          overflow: "auto",
          border: "1px solid #e1e1e1",
          borderRadius: "6px",
          backgroundColor: "#ffffff",
        }}
      >
        <Table {...keyboardNavAttr} sortable aria-label="KoboToolbox Assets Table">
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
                onClick={toggleAllRows}
                checkboxIndicator={{ "aria-label": "Select all rows" }}
              />
              <TableHeaderCell {...headerSortProps("name")} style={{ width: "45%" }}>
                Project Name
              </TableHeaderCell>
              <TableHeaderCell {...headerSortProps("deployment_status")} style={{ width: "20%" }}>
                Status
              </TableHeaderCell>
              <TableHeaderCell {...headerSortProps("date_modified")} style={{ width: "20%" }}>
                Modified
              </TableHeaderCell>
              <TableHeaderCell
                {...headerSortProps("deployment__submission_count")}
                style={{ width: "15%" }}
              >
                Submissions
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map(({ item, selected, onClick, onKeyDown, appearance }) => (
              <TableRow
                key={item.uid}
                onClick={onClick}
                onKeyDown={onKeyDown}
                aria-selected={selected}
                appearance={appearance}
              >
                <TableSelectionCell
                  checked={selected}
                  checkboxIndicator={{ "aria-label": "Select row" }}
                />
                <TableCell style={{ width: "45%" }}>
                  <TableCellLayout
                    description={
                      <div>
                        <PersonRegular style={{ marginRight: "4px" }} />
                        {item.owner_username}{" "}
                      </div>
                    }
                    truncate
                  >
                    <div style={{ fontWeight: 600 }} title={item.name}>
                      {item.name}
                    </div>
                  </TableCellLayout>
                  <TableCellActions onClick={onClickCellActions} onKeyDown={onKeyDownCellActions}>
                    <Button
                      icon={<EyeIcon />}
                      appearance="subtle"
                      aria-label="View"
                      size="small"
                      onClick={(e) => handleViewAsset(item.uid, e)}
                    />
                    <TeachingPopover>
                      <TeachingPopoverTrigger>
                        <Button
                          icon={<InfoRegular />}
                          appearance="subtle"
                          aria-label="More details"
                          size="small"
                        />
                      </TeachingPopoverTrigger>
                      <TeachingPopoverSurface>
                        <TeachingPopoverHeader>Asset Details</TeachingPopoverHeader>
                        <TeachingPopoverBody>
                          <TeachingPopoverTitle>{item.name}</TeachingPopoverTitle>
                          <div style={{ fontSize: "12px", lineHeight: "1.4", marginTop: "8px" }}>
                            <div style={{ marginBottom: "4px" }}>
                              <PersonRegular style={{ marginRight: "4px" }} />
                              <strong>Owner:</strong> {item.owner_username}
                            </div>
                            <div style={{ marginBottom: "4px" }}>
                              <FolderRegular style={{ marginRight: "4px" }} />
                              <strong>Type:</strong> {item.asset_type}
                            </div>
                            <div style={{ marginBottom: "4px" }}>
                              <strong>Sector:</strong> {item.sector}
                            </div>
                            <div style={{ marginBottom: "4px" }}>
                              <strong>Country:</strong> {item.country}
                            </div>
                            <div style={{ marginBottom: "4px" }}>
                              <CalendarRegular style={{ marginRight: "4px" }} />
                              <strong>Deployed:</strong> {formatDateShort(item.date_deployed)}
                            </div>
                          </div>
                        </TeachingPopoverBody>
                      </TeachingPopoverSurface>
                    </TeachingPopover>
                  </TableCellActions>
                </TableCell>
                <TableCell style={{ width: "20%" }}>
                  {getStatusBadge(item.deployment_status)}
                </TableCell>
                <TableCell style={{ width: "20%" }}>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    {formatDateShort(item.date_modified)}
                  </div>
                </TableCell>
                <TableCell style={{ width: "15%" }}>
                  <Badge appearance="outline" color="informative" size="small">
                    {item.deployment__submission_count}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Assets;
