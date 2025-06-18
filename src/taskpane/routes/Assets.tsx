import * as React from "react";
import {
  FolderRegular,
  DocumentRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  EditRegular,
  DeleteRegular,
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
} from "@fluentui/react-components";
import { useAssets } from "../hooks/useAssets";

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

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "deployed":
      return <CheckmarkCircleRegular />;
    case "draft":
      return <EditRegular />;
    default:
      return <ClockRegular />;
  }
};

const getStatusBadge = (status: string) => {
  const appearance = status.toLowerCase() === "deployed" ? "filled" : "outline";
  const color = status.toLowerCase() === "deployed" ? "success" : "warning";

  return (
    <Badge appearance={appearance} color={color}>
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
    columnId: "owner_username",
    compare: (a, b) => a.owner_username.localeCompare(b.owner_username),
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
    columnId: "date_deployed",
    compare: (a, b) => {
      const aDate = a.date_deployed ? new Date(a.date_deployed).getTime() : 0;
      const bDate = b.date_deployed ? new Date(b.date_deployed).getTime() : 0;
      return aDate - bDate;
    },
  }),
  createTableColumn<AssetItem>({
    columnId: "deployment__submission_count",
    compare: (a, b) => a.deployment__submission_count - b.deployment__submission_count,
  }),
  createTableColumn<AssetItem>({
    columnId: "asset_type",
    compare: (a, b) => a.asset_type.localeCompare(b.asset_type),
  }),
  createTableColumn<AssetItem>({
    columnId: "sector",
    compare: (a, b) => a.sector.localeCompare(b.sector),
  }),
  createTableColumn<AssetItem>({
    columnId: "country",
    compare: (a, b) => a.country.localeCompare(b.country),
  }),
];

const Assets = () => {
  const { data, isLoading, error } = useAssets();

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

    console.log("Deleting items with UIDs:", selectedUids);
  }, [getSelectedUids]);

  const rows = sort(
    getRows((row) => {
      const selected = isRowSelected(row.rowId);
      return {
        ...row,
        onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === " ") {
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

  return (
    <div style={{ width: "100%", maxWidth: "1400px" }}>
      {selectedCount > 0 && (
        <Toolbar style={{ marginBottom: "8px", padding: "8px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", color: "#666" }}>
              {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
            </span>
            <ToolbarButton icon={<DeleteRegular />} onClick={handleDelete} appearance="primary">
              Delete Selected
            </ToolbarButton>
          </div>
        </Toolbar>
      )}

      <div
        style={{
          width: "100%",
          height: "250px",
          overflow: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <Table
          {...keyboardNavAttr}
          role="grid"
          sortable
          aria-label="KoboToolbox Assets Table"
          style={{ minWidth: "1600px" }}
        >
          <TableHeader>
            <TableRow>
              <TableSelectionCell
                checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
                aria-checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
                role="checkbox"
                onClick={toggleAllRows}
                checkboxIndicator={{ "aria-label": "Select all rows" }}
              />
              <TableHeaderCell {...headerSortProps("name")}>Name</TableHeaderCell>
              <TableHeaderCell {...headerSortProps("owner_username")}>Owner</TableHeaderCell>
              <TableHeaderCell {...headerSortProps("deployment_status")}>Status</TableHeaderCell>
              <TableHeaderCell {...headerSortProps("date_modified")}>Date Modified</TableHeaderCell>
              <TableHeaderCell {...headerSortProps("date_deployed")}>Date Deployed</TableHeaderCell>
              <TableHeaderCell {...headerSortProps("deployment__submission_count")}>
                Submissions
              </TableHeaderCell>
              <TableHeaderCell {...headerSortProps("asset_type")}>Type</TableHeaderCell>
              <TableHeaderCell {...headerSortProps("sector")}>Sector</TableHeaderCell>
              <TableHeaderCell {...headerSortProps("country")}>Country</TableHeaderCell>
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
                <TableCell tabIndex={0} role="gridcell">
                  <TableCellLayout media={<DocumentRegular />}>{item.name}</TableCellLayout>
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  {item.owner_username}
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  <TableCellLayout media={getStatusIcon(item.deployment_status)}>
                    {getStatusBadge(item.deployment_status)}
                  </TableCellLayout>
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  {formatDate(item.date_modified)}
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  {formatDate(item.date_deployed)}
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  <Badge appearance="outline" color="informative">
                    {item.deployment__submission_count}
                  </Badge>
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  <TableCellLayout media={<FolderRegular />}>{item.asset_type}</TableCellLayout>
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  {item.sector}
                </TableCell>
                <TableCell tabIndex={0} role="gridcell">
                  {item.country}
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
