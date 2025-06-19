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
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
} from "@fluentui/react-components";
type AssetItem = {
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
};

const transformData = (rawData: any[]): AssetItem[] => {
  return rawData.map((item) => ({
    name: item.name || "N/A",
    owner_username: item.owner__username || "N/A",
    deployment_status: item.deployment_status || "N/A",
    date_modified: item.date_modified || "N/A",
    date_deployed: item.date_deployed,
    deployment__submission_count: item.deployment__submission_count || 0,
    asset_type: item.asset_type || "N/A",
    sector: item.settings?.sector?.label || "N/A",
    country: item.settings?.country?.[0]?.label || "N/A",
    uid: item.uid || "",
  }));
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not deployed";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const formatDateShort = (dateString: string | null) => {
  if (!dateString) return "Not deployed";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const appearance = status.toLowerCase() === "deployed" ? "filled" : "outline";
  const color = status.toLowerCase() === "deployed" ? "success" : "warning";

  return (
    <Badge appearance={appearance} color={color} size="small">
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

const Assets = () => {
  const { data, isLoading, error } = useAssets();

  const { mutate: deleteAssetMutation } = useDeleteAsset();
  const { mutate: bulkDeleteAssetMutation } = useBulkAssetAction();
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const navigate = useNavigate();

  const items = React.useMemo(() => {
    if (!data?.results || data.results.length === 0) return [];
    return transformData(data.results);
  }, [data]);

  const {
    getRows,
    selection: {
      allRowsSelected,
      someRowsSelected,
      toggleAllRows,
      toggleRow,
      isRowSelected,
      selectedRows,
    },
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures(
    {
      columns,
      items,
    },
    [
      useTableSelection({
        selectionMode: "multiselect",
        defaultSelectedItems: new Set(),
      }),
      useTableSort({
        defaultSortState: { sortColumn: "name", sortDirection: "ascending" },
      }),
    ]
  );

  const getSelectedUids = React.useCallback(() => {
    const selectedUids: string[] = [];
    selectedRows.forEach((rowId: any) => {
      const itemIndex = parseInt(rowId, 10);
      if (!isNaN(itemIndex) && itemIndex >= 0 && itemIndex < items.length) {
        selectedUids.push(items[itemIndex].uid);
      }
    });
    console.log("Selected UIDs:", selectedUids);
    return selectedUids;
  }, [selectedRows, items]);

  const handleDelete = React.useCallback(async () => {
    const selectedUids = getSelectedUids();
    if (selectedUids.length === 0) {
      console.log("No items selected for deletion");
      return;
    }

    if (selectedUids.length === 1) {
      console.log("Deleting ", selectedUids[0]);
      deleteAssetMutation(selectedUids[0], {
        onSuccess: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Project deleted successfully!</ToastTitle>
              <ToastBody subtitle="success">Your project has been deleted.</ToastBody>
            </Toast>,
            { intent: "success" }
          );
        },
        onError: () => {
          dispatchToast(
            <Toast>
              <ToastTitle>Error</ToastTitle>
              <ToastBody subtitle="error">Unable to delete project.</ToastBody>
            </Toast>,
            { intent: "error" }
          );
        },
      });
      return;
    }

    if (selectedUids.length > 1) {
      console.log("Deleting ", selectedUids);
      bulkDeleteAssetMutation(
        {
          payload: {
            asset_uids: selectedUids,
            action: "delete",
          },
        },
        {
          onSuccess: () => {
            dispatchToast(
              <Toast>
                <ToastTitle>Projects deleted successfully!</ToastTitle>
                <ToastBody subtitle="success">Your projects have been deleted.</ToastBody>
              </Toast>,
              { intent: "success" }
            );
          },
          onError: () => {
            dispatchToast(
              <Toast>
                <ToastTitle>Error</ToastTitle>
                <ToastBody subtitle="error">Unable to delete projects.</ToastBody>
              </Toast>,
              { intent: "error" }
            );
          },
        }
      );
      return;
    }

    console.log("Deleting items with UIDs:", selectedUids);
  }, [getSelectedUids, deleteAssetMutation, bulkDeleteAssetMutation, dispatchToast]);

  const handleViewAsset = React.useCallback(
    (assetUid: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      navigate(`${assetUid}`);
    },
    [navigate]
  );

  const rows = sort(
    getRows((row) => {
      const selected = isRowSelected(row.rowId);
      return {
        ...row,
        onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === " " && !e.defaultPrevented) {
            e.preventDefault();
            toggleRow(e, row.rowId);
          }
        },
        selected,
        appearance: selected ? ("brand" as const) : ("none" as const),
      };
    })
  );

  const headerSortProps = (columnId: TableColumnId) => ({
    onClick: (e: React.MouseEvent) => {
      toggleColumnSort(e, columnId);
    },
    sortDirection: getSortDirection(columnId),
  });

  const keyboardNavAttr = useArrowNavigationGroup({ axis: "grid" });

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

  const selectedCount = selectedRows.size;
  const EyeIcon = bundleIcon(EyeFilled, EyeRegular);

  const onClickCellActions = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onKeyDownCellActions = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Toaster toasterId={toasterId} />
      <Toolbar style={{ marginBottom: "8px", padding: "4px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "8px" }}>
          {selectedCount > 0 && (
            <span style={{ fontSize: "12px", color: "#666" }}>{selectedCount} selected</span>
          )}
          <Dialog modalType="alert">
            <DialogTrigger disableButtonEnhancement>
              <ToolbarButton
                disabled={selectedCount < 1}
                icon={<DeleteRegular />}
                appearance="primary"
              />
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Alert dialog title</DialogTitle>
                <DialogContent>
                  This dialog cannot be dismissed by clicking on the backdrop nor by pressing
                  Escape. Close button should be pressed to dismiss this Alert
                </DialogContent>
                <DialogActions>
                  <ToolbarButton
                    disabled={selectedCount < 1}
                    icon={<DeleteRegular />}
                    onClick={handleDelete}
                    appearance="primary"
                  >
                    Delete
                  </ToolbarButton>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary">Close</Button>
                  </DialogTrigger>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>
      </Toolbar>

      <div
        style={{
          width: "100%",
          height: "300px",
          overflow: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <Table {...keyboardNavAttr} role="grid" sortable aria-label="KoboToolbox Assets Table">
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
                aria-checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
                role="checkbox"
                onClick={toggleAllRows}
                checkboxIndicator={{ "aria-label": "Select all rows" }}
              />
              <TableHeaderCell
                {...headerSortProps("name")}
                style={{ width: "45%", minWidth: "200px" }}
              >
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
            {rows.map(({ item, selected, onClick, onKeyDown, appearance }) => (
              <TableRow
                key={item.uid}
                onClick={onClick}
                onKeyDown={onKeyDown}
                aria-selected={selected}
                appearance={appearance}
              >
                <TableSelectionCell
                  role="gridcell"
                  aria-selected={selected}
                  checked={selected}
                  checkboxIndicator={{ "aria-label": "Select row" }}
                />

                <TableCell
                  tabIndex={0}
                  role="gridcell"
                  style={{
                    width: "45%",
                    minWidth: "200px",
                    maxWidth: "300px",
                  }}
                >
                  <TableCellLayout
                    description={`${item.owner_username}`}
                    truncate
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: "500",
                      }}
                      title={item.name}
                    >
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
                              <strong>Deployed:</strong> {formatDate(item.date_deployed)}
                            </div>
                          </div>
                        </TeachingPopoverBody>
                      </TeachingPopoverSurface>
                    </TeachingPopover>
                  </TableCellActions>
                </TableCell>

                <TableCell tabIndex={0} role="gridcell" style={{ width: "20%" }}>
                  <TableCellLayout description={<div>{item.asset_type}</div>}>
                    {getStatusBadge(item.deployment_status)}
                  </TableCellLayout>
                </TableCell>

                <TableCell tabIndex={0} role="gridcell" style={{ width: "20%" }}>
                  <div style={{ fontSize: "12px" }}>{formatDateShort(item.date_modified)}</div>
                </TableCell>

                <TableCell tabIndex={0} role="gridcell" style={{ width: "15%" }}>
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
