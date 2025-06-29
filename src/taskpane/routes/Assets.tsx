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
  DocumentCopyFilled,
  DocumentCopyRegular,
} from "@fluentui/react-icons";
import {
  TableCell,
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
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
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  Spinner,
} from "@fluentui/react-components";
import { useAssets, useBulkAssetAction } from "../hooks/useAssets";
import { useDeleteAsset } from "../hooks/useDanger";
import {
  TeachingPopover,
  TeachingPopoverBody,
  TeachingPopoverHeader,
  TeachingPopoverTitle,
  TeachingPopoverSurface,
  TeachingPopoverTrigger,
} from "@fluentui/react-components";
import { useNavigate } from "react-router";
import { CloneAssetDialog } from "../components/dialogs/CloneAssetDialog";
import { useDestructiveStyles } from "../components/primitives/styles";

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

type DialogType = "cloneAsset";
const CloneIcon = bundleIcon(DocumentCopyFilled, DocumentCopyRegular);

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

const Assets: React.FC = () => {
  const destructiveStyles = useDestructiveStyles();
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

  const columns: TableColumnDefinition<AssetItem>[] = [
    createTableColumn<AssetItem>({
      columnId: "name",
      renderHeaderCell: () => <span className="text-xs">Project Name</span>,
      compare: (a, b) => a.name.localeCompare(b.name),
      renderCell: (item) => (
        <TableCell>
          <TableCellLayout
            description={
              <div>
                <PersonRegular style={{ marginRight: "4px" }} />
                {item.owner_username}{" "}
              </div>
            }
            truncate
          >
            <div className="text-xs font-medium" title={item.name}>
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
      ),
    }),
    createTableColumn<AssetItem>({
      columnId: "deployment_status",
      renderHeaderCell: () => <span className="text-xs">Status</span>,
      compare: (a, b) => a.deployment_status.localeCompare(b.deployment_status),
      renderCell: (item) => (
        <TableCellLayout className="text-xs">
          {getStatusBadge(item.deployment_status)}
        </TableCellLayout>
      ),
    }),
    createTableColumn<AssetItem>({
      columnId: "asset_type",
      renderHeaderCell: () => <span className="text-xs">Type</span>,
      compare: (a, b) => a.asset_type.localeCompare(b.asset_type),
      renderCell: (item) => (
        <TableCellLayout className="text-xs">{item.asset_type}</TableCellLayout>
      ),
    }),
    createTableColumn<AssetItem>({
      columnId: "date_modified",
      renderHeaderCell: () => <span className="text-xs">Modified</span>,
      compare: (a, b) => new Date(a.date_modified).getTime() - new Date(b.date_modified).getTime(),
      renderCell: (item) => (
        <TableCellLayout className="text-xs">{formatDateShort(item.date_modified)}</TableCellLayout>
      ),
    }),
    createTableColumn<AssetItem>({
      columnId: "deployment__submission_count",
      renderHeaderCell: () => <span className="text-xs">Submissions</span>,
      compare: (a, b) => a.deployment__submission_count - b.deployment__submission_count,
      renderCell: (item) => (
        <TableCellLayout className="text-xs">
          <Badge appearance="outline" color="informative" size="small">
            {item.deployment__submission_count}
          </Badge>
        </TableCellLayout>
      ),
    }),
  ];

  const selectedUids: string[] = Array.from(selectedItems).map((id) => String(id));
  const [activeDialog, setActiveDialog] = React.useState<DialogType | null>(null);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading asset ..." />
      </div>
    );
  }

  if (error) {
    return <div>Error loading assets: {error.message}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-4 min-h-screen flex flex-col gap-4 items-center justify-center ">
        No assets available
      </div>
    );
  }
  const columnSizingOptions = {
    name: {
      minWidth: 180,
      defaultWidth: 200,
    },
    status: {
      defaultWidth: 180,
      minWidth: 120,
      idealWidth: 180,
    },
  };

  return (
    <div className="px-4 pt-4 min-h-screen flex flex-col gap-2 ">
      <span className="text-base font-medium">My Assets</span>
      <Toaster toasterId={toasterId} />
      <Toolbar
        style={{
          marginBottom: "8px",
          marginTop: "8px",
          paddingLeft: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
        size="small"
      >
        <div style={{ fontSize: "14px", color: "#666", fontWeight: 500 }}>
          {items.length} Asset{items.length !== 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {selectedCount > 0 && (
            <span style={{ fontSize: "13px", color: "#666", fontWeight: 500 }}>
              {selectedCount} selected
            </span>
          )}
          {selectedCount == 1 && selectedUids.length == 1 ? (
            <div>
              <Button
                disabled={selectedCount !== 1}
                appearance="primary"
                onClick={() => setActiveDialog("cloneAsset")}
                icon={<CloneIcon />}
              />
              <CloneAssetDialog
                open={activeDialog === "cloneAsset"}
                assetId={selectedUids[0]}
                toasterId={toasterId}
                onClose={() => setActiveDialog(null)}
              />
            </div>
          ) : null}
          <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
            <DialogTrigger disableButtonEnhancement>
              <ToolbarButton
                disabled={selectedCount < 1 || isDeleting_any}
                icon={<DeleteRegular className={destructiveStyles.destructiveIcon} />}
                className={destructiveStyles.destructive}
                onClick={() => setIsDialogOpen(true)}
              />
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Delete {selectedCount === 1 ? "Asset" : "Assets"}</DialogTitle>
                <DialogContent>
                  <div className="text-xs">
                    Are you sure you want to delete{" "}
                    {selectedCount === 1 ? "this asset" : `these ${selectedCount} assets`}? This
                    action cannot be undone.
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    className={destructiveStyles.destructive}
                    disabled={isDeleting_any}
                    icon={<DeleteRegular className={destructiveStyles.destructiveIcon} />}
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

      <div style={{ width: "100%", maxHeight: "400px", overflowX: "auto" }}>
        <DataGrid
          items={items}
          columns={columns}
          sortable
          getRowId={(item) => item.uid}
          selectionMode="multiselect"
          selectedItems={selectedItems}
          onSelectionChange={(_, data) => setSelectedItems(data.selectedItems)}
          resizableColumns
          {...keyboardNavAttr}
          columnSizingOptions={columnSizingOptions}
          resizableColumnsOptions={{
            autoFitColumns: false,
          }}
          focusMode="row_unstable"
        >
          <DataGridHeader>
            <DataGridRow
              selectionCell={{
                checkboxIndicator: { "aria-label": "Select all rows" },
              }}
            >
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody>
            {({ item, rowId }) => (
              <DataGridRow
                key={rowId}
                selectionCell={{
                  checkboxIndicator: { "aria-label": "Select row" },
                }}
              >
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
    </div>
  );
};

export default Assets;
