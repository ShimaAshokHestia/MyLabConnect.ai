import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from "react";
import { Form, Button } from "react-bootstrap";
import {
  FaSort, FaSortUp, FaSortDown,
  FaEllipsisV, FaEye, FaEdit, FaTrash,
  FaChevronLeft, FaChevronRight, FaDownload,
  FaHistory,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, flexRender,
  type SortingState, type ColumnDef, type VisibilityState,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import KiduCreateModal, { type KiduCreateModalProps } from "./KiduCreateModal";
import KiduAuditLogs from "./KiduAuditLogs";
import "../Styles/KiduStyles/ServerTable.css";
import type { Density, ExportFormat, ToolbarColumnConfig } from "./KiduToolbar";
import KiduToolbar from "./KiduToolbar";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface KiduColumn {
  key:              string;
  label:            string;
  enableSorting?:   boolean;
  enableFiltering?: boolean;
  type?:            "text" | "checkbox" | "image" | "rating" | "date" | "badge" | "currency" | "avatar";
  width?:           number;
  minWidth?:        number;
  render?:          (value: any, row: any) => React.ReactNode;
  filterType?:      "text" | "select" | "date" | "number";
  filterOptions?:   string[];
  pinned?:          "left" | "right" | false;
}

export interface TableRequestParams {
  pageNumber:       number;
  pageSize:         number;
  searchTerm?:      string;
  sortBy?:          string;
  sortDescending?:  boolean;
  [key: string]:    any;
}

export interface TableResponse<T> {
  data:        T[];
  total:       number;
  totalPages?: number;
  [key: string]: any;
}

export type ManagedModalProps = Omit<KiduCreateModalProps, "show" | "onHide">;

export interface KiduServerTableProps<T> {
  title?:    string;
  subtitle?: string;
  columns:   KiduColumn[];
  fetchData: (params: TableRequestParams) => Promise<TableResponse<T>>;
  rowKey?:   keyof T;

  showSearch?:          boolean;
  showFilters?:         boolean;
  showColumnToggle?:    boolean;
  showDensityToggle?:   boolean;
  showExport?:          boolean;
  showFullscreen?:      boolean;
  showAddButton?:       boolean;
  showActions?:         boolean;
  showPagination?:      boolean;
  showRowsPerPage?:     boolean;
  showCheckboxes?:      boolean;
  showSelectionToggle?: boolean;

  addButtonLabel?: string;
  addModal?:       ManagedModalProps;
  onAddClick?:     () => void;
  addRoute?:       string;

  editModal?:   (row: T) => ManagedModalProps;
  onEditClick?: (row: T) => void;
  editRoute?:   string;

  viewModal?:   (row: T) => ManagedModalProps;
  onViewClick?: (row: T) => void;
  viewRoute?:   string;

  onDeleteClick?: (row: T) => void;
  onBulkDelete?:  (rows: T[]) => void;
  onRowClick?:    (row: T) => void;

  auditLogTableName?: string;
  onAuditLogClick?: (row: T) => void;

  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  defaultDensity?:     Density;
  stickyHeader?:       boolean;
  highlightOnHover?:   boolean;
  striped?:            boolean;
  customFilters?:      React.ReactNode;
  additionalButtons?:  React.ReactNode;
}

type ModalKind = "add" | "edit" | "view" | null;

interface ModalState<T> {
  kind:  ModalKind;
  row:   T | null;
  props: ManagedModalProps | null;
}

interface AuditState {
  open:     boolean;
  recordId: number | string;
}

// ─────────────────────────────────────────────────────────────
// Export helpers
// ─────────────────────────────────────────────────────────────

function toExportRows(data: any[], columns: KiduColumn[]) {
  return data.map((row) => {
    const obj: Record<string, any> = {};
    columns.filter((c) => c.key !== "actions").forEach((c) => { obj[c.label] = row[c.key]; });
    return obj;
  });
}

function exportExcel(data: any[], columns: KiduColumn[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(toExportRows(data, columns));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

function exportCSV(data: any[], columns: KiduColumn[], filename: string) {
  const ws  = XLSX.utils.json_to_sheet(toExportRows(data, columns));
  const csv = XLSX.utils.sheet_to_csv(ws);
  const a   = document.createElement("a");
  a.href     = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  a.download = `${filename}.csv`;
  a.click();
}

function exportPDF(data: any[], columns: KiduColumn[], filename: string, title: string) {
  const doc  = new jsPDF();
  const cols = columns.filter((c) => c.key !== "actions");
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  (doc as any).autoTable({
    head:       [cols.map((c) => c.label)],
    body:       data.map((row) => cols.map((c) => row[c.key] ?? "")),
    startY:     25,
    theme:      "grid",
    styles:     { fontSize: 8 },
    headStyles: { fillColor: [239, 13, 80] },
  });
  doc.save(`${filename}.pdf`);
}

// ─────────────────────────────────────────────────────────────
// Avatar cell
// ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#ef0d50", "#3b82f6", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

function AvatarCell({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const bg       = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className="kidu-avatar-cell">
      <div className="kidu-avatar" style={{ background: bg }}>{initials}</div>
      <span className="kidu-avatar-name">{name}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cell renderer
// ─────────────────────────────────────────────────────────────

function renderCell(col: KiduColumn, value: any, row: any): React.ReactNode {
  if (col.render) return col.render(value, row);

  if (value === null || value === undefined || value === "") {
    return <span className="kidu-cell-empty">—</span>;
  }

  switch (col.type) {
    case "avatar":
      return <AvatarCell name={String(value)} />;

    case "checkbox":
      return <Form.Check type="checkbox" checked={!!value} disabled readOnly />;

    case "image":
      return (
        <img
          src={String(value)} alt="img"
          className="kidu-table-image"
          onError={(e: any) => { e.target.src = "/assets/Images/profile.jpeg"; }}
        />
      );

    case "rating": {
      const r     = Math.min(Math.max(Number(value) || 0, 0), 5);
      const full  = Math.floor(r);
      const half  = r - full >= 0.5;
      const empty = 5 - full - (half ? 1 : 0);
      return (
        <div className="kidu-rating">
          {Array.from({ length: full  }).map((_, i) => <span key={`f${i}`} className="kidu-star full">★</span>)}
          {half                                      && <span className="kidu-star half">★</span>}
          {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="kidu-star empty">★</span>)}
          <span className="kidu-rating-val">({r.toFixed(1)})</span>
        </div>
      );
    }

    case "date": {
      try {
        const d = new Date(String(value));
        if (!isNaN(d.getTime()))
          return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      } catch (_) {}
      return String(value);
    }

    case "badge": {
      const val = String(value);
      const cls = val.toLowerCase() === "active"   ? "active"
                : val.toLowerCase() === "inactive" ? "inactive"
                : "default";
      return <span className={`kidu-badge kidu-badge--${cls}`}>{val}</span>;
    }

    case "currency":
      return <span>${Number(value).toFixed(2)}</span>;

    default:
      return <span>{String(value)}</span>;
  }
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

function KiduServerTable<T extends Record<string, any>>({
  title    = "Data Table",
  subtitle,
  columns: initialColumns,
  fetchData,
  rowKey = "id" as keyof T,
  showSearch          = true,
  showFilters         = true,
  showColumnToggle    = true,
  showDensityToggle   = true,
  showExport          = true,
  showFullscreen      = true,
  showAddButton       = false,
  showActions         = true,
  showPagination      = true,
  showRowsPerPage     = true,
  showSelectionToggle = true,
  addButtonLabel = "Add New",
  addModal,
  onAddClick,
  addRoute,
  editModal,
  onEditClick,
  editRoute,
  viewModal,
  onViewClick,
  viewRoute,
  onDeleteClick,
  onBulkDelete,
  onRowClick,
  auditLogTableName,
  onAuditLogClick,
  rowsPerPageOptions = [5, 10, 20, 50, 100],
  defaultRowsPerPage = 10,
  defaultDensity     = "comfortable",
  stickyHeader       = true,
  highlightOnHover   = true,
  striped            = false,
  customFilters,
  additionalButtons,
}: KiduServerTableProps<T>) {

  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);

  // ── Data ────────────────────────────────────────────────────
  const [data,        setData]        = useState<T[]>([]);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  // ── Search ──────────────────────────────────────────────────
  const [searchTerm,      setSearchTerm]      = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // ── Sorting / column filters ─────────────────────────────────
  const [sorting,       setSorting]       = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [filtersOpen,   setFiltersOpen]   = useState(false);

  // ── Column state ─────────────────────────────────────────────
  const [columns,          ]          = useState<KiduColumn[]>(initialColumns);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [density,          setDensity]          = useState<Density>(defaultDensity);

  // ── Selection — disabled by default ────────────────────────
  const [selectionEnabled, setSelectionEnabled] = useState(false);
  const [selectedRows,     setSelectedRows]     = useState<Set<any>>(new Set());

  // ── Go-to-page input ────────────────────────────────────────
  const [goToPageInput, setGoToPageInput] = useState("");

  // ── UI ───────────────────────────────────────────────────────
  const [isFullscreen,   setIsFullscreen]   = useState(false);
  // Track which row's action dropdown is open (only one at a time)
  const [openDropdownId, setOpenDropdownId] = useState<any>(null);

  // ── CRUD modal ───────────────────────────────────────────────
  const [modal, setModal] = useState<ModalState<T>>({ kind: null, row: null, props: null });
  const closeModal = () => setModal({ kind: null, row: null, props: null });

  // ── Built-in Audit Log modal state ───────────────────────────
  const [auditState, setAuditState] = useState<AuditState>({ open: false, recordId: "" });
  const closeAudit  = () => setAuditState({ open: false, recordId: "" });

  // ── Fetch ────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchData({
        pageNumber:     currentPage,
        pageSize:       rowsPerPage === 0 ? 9999 : rowsPerPage,
        searchTerm:     debouncedSearch,
        sortBy:         sorting[0]?.id,
        sortDescending: sorting[0]?.desc,
        ...columnFilters,
      });
      setData(res.data  ?? []);
      setTotal(res.total ?? 0);
    } catch (e: any) {
      setError(e.message ?? "Failed to load data");
      setData([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearch, sorting, columnFilters, fetchData]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, columnFilters, rowsPerPage]);

  // Close action menu when clicking outside
  useEffect(() => {
    if (!openDropdownId) return;
    const handler = () => setOpenDropdownId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openDropdownId]);

  // ── Derived ──────────────────────────────────────────────────
  const totalPages    = rowsPerPage === 0 ? 1 : Math.ceil(total / rowsPerPage);
  const visibleCols   = columns.filter((c) => !columnVisibility[c.key]);
  const activeFilters = Object.values(columnFilters).filter(Boolean).length;

  const densityClass: Record<Density, string> = {
    compact:     "kidu-density-compact",
    comfortable: "kidu-density-comfortable",
    spacious:    "kidu-density-spacious",
  };

  const allSelected = data.length > 0 && data.every((r) => selectedRows.has(r[rowKey]));

  // ── Selection helpers ────────────────────────────────────────

  function toggleSelectRow(rowId: any) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }

  function togglePage() {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (allSelected) { data.forEach((r) => next.delete(r[rowKey])); }
      else             { data.forEach((r) => next.add(r[rowKey]));    }
      return next;
    });
  }

  // ── Export ───────────────────────────────────────────────────
  const handleExport = (format: ExportFormat) => {
    const filename   = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`;
    const exportData = selectedRows.size > 0
      ? data.filter((r) => selectedRows.has(r[rowKey]))
      : data;

    if (format === "print") { window.print(); return; }
    if (format === "excel") exportExcel(exportData, columns, filename);
    if (format === "csv")   exportCSV(exportData, columns, filename);
    if (format === "pdf")   exportPDF(exportData, columns, filename, title);
  };

  // ── Fullscreen ───────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!isFullscreen) tableRef.current?.requestFullscreen?.();
    else               document.exitFullscreen?.();
    setIsFullscreen((p) => !p);
  };

  // ── CRUD action handlers ─────────────────────────────────────
  function handleAdd() {
    if (addModal)   { setModal({ kind: "add", row: null, props: addModal }); return; }
    if (onAddClick) { onAddClick(); return; }
    if (addRoute)   { navigate(addRoute); }
  }

  function handleEdit(row: T) {
    if (editModal)   { setModal({ kind: "edit", row, props: editModal(row) }); return; }
    if (onEditClick) { onEditClick(row); return; }
    if (editRoute)   { navigate(`${editRoute}/${row[rowKey]}`); }
  }

  function handleView(row: T) {
    if (viewModal)   { setModal({ kind: "view", row, props: viewModal(row) }); return; }
    if (onViewClick) { onViewClick(row); return; }
    if (viewRoute)   { navigate(`${viewRoute}/${row[rowKey]}`); }
  }

  function handleAuditLog(row: T) {
    if (onAuditLogClick) {
      onAuditLogClick(row);
      return;
    }
    if (auditLogTableName) {
      setAuditState({ open: true, recordId: row[rowKey] as number | string });
    }
  }

  const showAudit = !!(auditLogTableName || onAuditLogClick);
  const hasActions = showActions && (
    editModal || editRoute || onEditClick ||
    viewModal || viewRoute || onViewClick ||
    onDeleteClick || showAudit
  );

  // ── TanStack columns ─────────────────────────────────────────
  // FIX: selectionEnabled, selectedRows, allSelected added to deps
  // so the checkbox column is added/removed reactively
  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [];

    // ── Checkbox column (only when selection is enabled) ───────
    if (selectionEnabled) {
      cols.push({
        id: "select",
        enableSorting: false,
        size: 40,
        minSize: 40,
        header: () => (
          <input
            type="checkbox"
            className="kidu-checkbox"
            checked={allSelected}
            onChange={togglePage}
            title={allSelected ? "Deselect all on page" : "Select all on page"}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="kidu-checkbox"
            checked={selectedRows.has(row.original[rowKey])}
            onChange={() => toggleSelectRow(row.original[rowKey])}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      });
    }

    // ── Data columns ───────────────────────────────────────────
    cols.push(
      ...columns.map((col) => ({
        id: col.key,
        accessorKey: col.key,
        header: col.label,
        enableSorting: col.enableSorting !== false,
        size: col.width,
        minSize: col.minWidth,
        cell: ({ getValue, row }: any) => renderCell(col, getValue(), row.original),
      }))
    );

    // ── Actions column ─────────────────────────────────────────
    if (hasActions) {
      cols.push({
        id: "actions",
        header: "ACTIONS",
        enableSorting: false,
        size: 80,
        minSize: 60,
        cell: ({ row }) => {
          const rowId  = row.original[rowKey];
          const isOpen = openDropdownId === rowId;
          return (
            <div
              className="kidu-actions-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Trigger — plain <button>, no <a>, no URL in status bar */}
              <button
                type="button"
                className="kidu-action-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenDropdownId(isOpen ? null : rowId);
                }}
              >
                <FaEllipsisV />
              </button>

              {/* Custom menu — pure <div> + <button> elements */}
              {isOpen && (
                <div className="kidu-actions-menu kidu-actions-menu--custom">
                  {(viewModal || viewRoute || onViewClick) && (
                    <button
                      type="button"
                      className="kidu-dropdown-item"
                      onClick={() => { setOpenDropdownId(null); handleView(row.original); }}
                    >
                      <FaEye className="me-2" /> View
                    </button>
                  )}
                  {(editModal || editRoute || onEditClick) && (
                    <button
                      type="button"
                      className="kidu-dropdown-item"
                      onClick={() => { setOpenDropdownId(null); handleEdit(row.original); }}
                    >
                      <FaEdit className="me-2" /> Edit
                    </button>
                  )}
                  {showAudit && (
                    <button
                      type="button"
                      className="kidu-dropdown-item"
                      onClick={() => { setOpenDropdownId(null); handleAuditLog(row.original); }}
                    >
                      <FaHistory className="me-2" /> Audit Logs
                    </button>
                  )}
                  {onDeleteClick && (
                    <>
                      <div className="kidu-menu-divider" />
                      <button
                        type="button"
                        className="kidu-dropdown-item kidu-delete-item"
                        onClick={() => { setOpenDropdownId(null); onDeleteClick(row.original); }}
                      >
                        <FaTrash className="me-2" /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        },
      });
    }

    return cols;
  // FIX: include selectionEnabled, selectedRows, allSelected in deps
  }, [
    columns, hasActions, selectionEnabled, selectedRows, allSelected, openDropdownId,
    editModal, editRoute, onEditClick,
    viewModal, viewRoute, onViewClick,
    onDeleteClick, showAudit,
  ]);

  // ── Table instance ───────────────────────────────────────────
  const table = useReactTable({
    data,
    columns: tableColumns,
    state:   { sorting, columnVisibility },
    onSortingChange:          setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel:          getCoreRowModel(),
    getSortedRowModel:        getSortedRowModel(),
    manualPagination: true,
    manualFiltering:  true,
    manualSorting:    true,
    pageCount:        totalPages,
  });

  // ── Pagination numbers ───────────────────────────────────────
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4)              return [1, 2, 3, 4, 5, "…", totalPages];
    if (currentPage >= totalPages - 3) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages];
  }, [currentPage, totalPages]);

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const toolbarCols: ToolbarColumnConfig[] = columns.map((c) => ({
    key: c.key, label: c.label, pinned: c.pinned,
  }));

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div className={`kidu-server-table ${isFullscreen ? "kidu-fullscreen" : ""}`} ref={tableRef}>

      {/* Toolbar */}
      <KiduToolbar
        title={title}    subtitle={subtitle}
        showSearch={showSearch}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        activeFilterCount={activeFilters}
        filtersOpen={filtersOpen}
        onFiltersToggle={() => setFiltersOpen((p) => !p)}
        showColumnToggle={showColumnToggle}
        columns={toolbarCols}
        columnVisibility={columnVisibility}
        onColumnVisibilityToggle={(key) => setColumnVisibility((p) => ({ ...p, [key]: !p[key] }))}
        onColumnPin={() => {}}
        showDensityToggle={showDensityToggle}
        density={density}
        onDensityChange={setDensity}
        showSelectionToggle={showSelectionToggle}
        selectionEnabled={selectionEnabled}
        onSelectionToggle={() => { setSelectionEnabled((p) => !p); setSelectedRows(new Set()); }}
        showExport={showExport}
        onExport={handleExport}
        showFullscreen={showFullscreen}
        isFullscreen={isFullscreen}
        onFullscreenToggle={toggleFullscreen}
        showAddButton={showAddButton}
        addButtonLabel={addButtonLabel}
        onAddClick={handleAdd}
        additionalButtons={additionalButtons}
      />

      {/* Selection Bar — only shown when selection is enabled AND rows are selected */}
      {selectionEnabled && selectedRows.size > 0 && (
        <div className="kidu-selection-bar">
          <span className="kidu-sel-count">
            {selectedRows.size} row{selectedRows.size > 1 ? "s" : ""} selected
          </span>
          <button
            className="kidu-sel-btn"
            onClick={() => setSelectedRows(new Set(data.map((r) => r[rowKey])))}
          >
            Select all ({data.length})
          </button>
          <button className="kidu-sel-btn" onClick={togglePage}>
            {allSelected ? "Deselect page" : "Select page"}
          </button>
          <button className="kidu-sel-btn" onClick={() => setSelectedRows(new Set())}>
            Deselect all
          </button>
          <span className="kidu-sel-spacer" />
          <Button
            size="sm"
            variant="outline-secondary"
            className="kidu-sel-action"
            onClick={() => handleExport("csv")}
          >
            <FaDownload className="me-1" /> Export selected
          </Button>
          {(onBulkDelete || onDeleteClick) && (
            <Button
              size="sm"
              variant="danger"
              className="kidu-sel-action"
              onClick={() => {
                const rows = data.filter((r) => selectedRows.has(r[rowKey]));
                if (onBulkDelete) onBulkDelete(rows);
                else if (onDeleteClick && rows.length) onDeleteClick(rows[0]);
              }}
            >
              <FaTrash className="me-1" /> Delete
            </Button>
          )}
        </div>
      )}

      {/* Filter Row */}
      {filtersOpen && (
        <div className="kidu-filter-row">
          {visibleCols
            .filter((c) => c.enableFiltering !== false && c.key !== "actions")
            .map((col) => (
              <div key={col.key} className="kidu-filter-field">
                <label className="kidu-filter-label">{col.label}</label>
                {col.filterType === "select" && col.filterOptions ? (
                  <Form.Select
                    size="sm"
                    value={columnFilters[col.key] ?? ""}
                    onChange={(e) => setColumnFilters((p) => ({ ...p, [col.key]: e.target.value }))}
                    className="kidu-filter-input"
                  >
                    <option value="">All</option>
                    {col.filterOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </Form.Select>
                ) : (
                  <Form.Control
                    size="sm"
                    type={col.filterType === "number" ? "number" : col.filterType === "date" ? "date" : "text"}
                    placeholder={`Filter ${col.label}...`}
                    value={columnFilters[col.key] ?? ""}
                    onChange={(e) => setColumnFilters((p) => ({ ...p, [col.key]: e.target.value }))}
                    className="kidu-filter-input"
                  />
                )}
              </div>
            ))}
          <div className="kidu-filter-actions">
            <button className="kidu-filter-clear-btn" onClick={() => setColumnFilters({})}>
              Clear All
            </button>
          </div>
          {customFilters && <div className="kidu-custom-filters">{customFilters}</div>}
        </div>
      )}

      {/* Table */}
      <div className="kidu-table-scroll">
        <table className={`kidu-table ${striped ? "kidu-striped" : ""}`}>

          {/* HEADER */}
          <thead className={stickyHeader ? "kidu-thead-sticky" : ""}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const col      = columns.find((c) => c.key === header.id);
                  const isAction = header.id === "actions";
                  const isSelect = header.id === "select";
                  const canSort  = header.column.getCanSort();
                  const sorted   = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      className={[
                        "kidu-th",
                        densityClass[density],
                        canSort   ? "kidu-th-sortable" : "",
                        isAction  ? "kidu-th-actions"  : "",
                        isSelect  ? "kidu-th-checkbox"  : "",
                      ].filter(Boolean).join(" ")}
                      style={{
                        width:    isSelect ? 40 : col?.width    || (isAction ? 80  : "auto"),
                        minWidth: isSelect ? 40 : col?.minWidth || (isAction ? 60  : 100),
                      }}
                    >
                      <div className="kidu-th-inner">
                        <span className="kidu-th-label">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {canSort && (
                          <span className="kidu-sort-icon">
                            {sorted === "asc"  ? <FaSortUp />   :
                             sorted === "desc" ? <FaSortDown /> : <FaSort />}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* BODY */}
          <tbody>
            {/* Loading skeleton */}
            {loading && Array.from({ length: rowsPerPage }).map((_, i) => (
              <tr key={`sk-${i}`} className="kidu-skeleton-row">
                {tableColumns.map((col) => {
                  const colId = col.id ?? (col as any).accessorKey;
                  return (
                    <td
                      key={String(colId)}
                      className={`kidu-td ${densityClass[density]}`}
                      style={{
                        width:    colId === "select" ? 40 : col.size    || (colId === "actions" ? 80  : "auto"),
                        minWidth: colId === "select" ? 40 : col.minSize || (colId === "actions" ? 60  : 100),
                      }}
                    >
                      <div className={`kidu-skeleton ${colId === "actions" || colId === "select" ? "kidu-skel-xs" : "kidu-skel-md"}`} />
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={tableColumns.length} className="kidu-empty-cell">
                  <div className="kidu-error-state">
                    <p className="kidu-error-msg">⚠ {error}</p>
                    <Button size="sm" variant="primary" onClick={loadData}>Retry</Button>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={tableColumns.length} className="kidu-empty-cell">
                  <p className="kidu-empty-msg">No records found.</p>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && !error && table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={[
                  "kidu-tr",
                  highlightOnHover ? "kidu-tr-hover" : "",
                  selectedRows.has(row.original[rowKey]) ? "kidu-tr-selected" : "",
                  onRowClick ? "kidu-tr-clickable" : "",
                ].filter(Boolean).join(" ")}
              >
                {row.getVisibleCells().map((cell) => {
                  const col      = columns.find((c) => c.key === cell.column.id);
                  const isAction = cell.column.id === "actions";
                  const isSelect = cell.column.id === "select";

                  return (
                    <td
                      key={cell.id}
                      className={[
                        "kidu-td",
                        densityClass[density],
                        isAction ? "kidu-td-actions"  : "",
                        isSelect ? "kidu-td-checkbox" : "",
                      ].filter(Boolean).join(" ")}
                      style={{
                        width:    isSelect ? 40 : col?.width    || (isAction ? 80  : "auto"),
                        minWidth: isSelect ? 40 : col?.minWidth || (isAction ? 60  : 100),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      {showPagination && (
        <div className="kidu-footer">

          {/* LEFT — Showing X to Y of Z */}
          <span className="kidu-footer-info">
            Showing{" "}
            <strong>{total === 0 ? 0 : Math.min((currentPage - 1) * (rowsPerPage || total) + 1, total)}</strong>
            {" "}to{" "}
            <strong>{rowsPerPage === 0 ? total : Math.min(currentPage * rowsPerPage, total)}</strong>
            {" "}of <strong>{total}</strong>
          </span>

          {/* CENTER — navigation + go-to-page */}
          <div className="kidu-pagination">
            {/* First */}
            <button
              className="kidu-page-btn kidu-page-nav"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              title="First page"
            >
              <FaChevronLeft style={{ marginRight: "-4px" }} /><FaChevronLeft />
            </button>
            {/* Prev */}
            <button
              className="kidu-page-btn kidu-page-nav"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              title="Previous page"
            >
              <FaChevronLeft />
            </button>

            {/* Page numbers */}
            {totalPages > 1 && pageNumbers.map((p, i) =>
              p === "…" ? (
                <span key={`el-${i}`} className="kidu-page-ellipsis">…</span>
              ) : (
                <button
                  key={p}
                  className={`kidu-page-btn ${p === currentPage ? "kidu-page-active" : ""}`}
                  onClick={() => handlePageChange(Number(p))}
                >
                  {p}
                </button>
              )
            )}
            {totalPages <= 1 && (
              <button className="kidu-page-btn kidu-page-active">1</button>
            )}

            {/* Next */}
            <button
              className="kidu-page-btn kidu-page-nav"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => handlePageChange(currentPage + 1)}
              title="Next page"
            >
              <FaChevronRight />
            </button>
            {/* Last */}
            <button
              className="kidu-page-btn kidu-page-nav"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => handlePageChange(totalPages)}
              title="Last page"
            >
              <FaChevronRight /><FaChevronRight style={{ marginLeft: "-4px" }} />
            </button>

            {/* Go-to-page input */}
            {totalPages > 1 && (
              <div className="kidu-goto-page">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const p = parseInt(goToPageInput, 10);
                      if (!isNaN(p)) { handlePageChange(p); setGoToPageInput(""); }
                    }
                  }}
                  className="kidu-goto-input"
                  placeholder="Page"
                />
                <button
                  className="kidu-goto-btn"
                  onClick={() => {
                    const p = parseInt(goToPageInput, 10);
                    if (!isNaN(p)) { handlePageChange(p); setGoToPageInput(""); }
                  }}
                >
                  Go
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — Records per page */}
          {showRowsPerPage && (
            <div className="kidu-page-size">
              <span className="kidu-footer-info">Records per page:</span>
              <Form.Select
                size="sm"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="kidu-page-size-select"
              >
                {rowsPerPageOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
                <option value={0}>ALL</option>
              </Form.Select>
            </div>
          )}

        </div>
      )}

      {/* CRUD Modal */}
      {modal.kind && modal.props && (
        <KiduCreateModal
          {...modal.props}
          show={true}
          onHide={closeModal}
          onSuccess={() => {
            loadData();
            modal.props?.onSuccess?.();
          }}
        />
      )}

      {/* Audit Log Modal */}
      {auditLogTableName && (
        <KiduAuditLogs
          key={`audit-${auditState.recordId}`}
          tableName={auditLogTableName}
          recordId={auditState.recordId}
          open={auditState.open}
          onClose={closeAudit}
          showTrigger={false}
        />
      )}

    </div>
  );
}

export default KiduServerTable;