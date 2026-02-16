import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Pagination,
  Dropdown,
  Badge,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaColumns,
  FaDownload,
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEllipsisV,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaPrint,
  FaGripVertical,
  FaExpand,
  FaCompress,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../Styles/KiduStyles/ServerTable.css";

// ============================================
// Type Definitions
// ============================================

export interface KiduColumn {
  key: string;
  label: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  type?: "text" | "checkbox" | "image" | "rating" | "date" | "badge" | "currency";
  width?: number;
  minWidth?: number;
  render?: (value: any, row: any) => React.ReactNode;
  filterType?: "text" | "select" | "date" | "number";
  filterOptions?: string[];
}

export interface TableRequestParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  [key: string]: any; // For additional custom filters
}

export interface TableResponse<T> {
  data: T[];
  total: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface KiduServerTableProps<T> {
  // Core Configuration
  title?: string;
  subtitle?: string;
  columns: KiduColumn[];
  fetchData: (params: TableRequestParams) => Promise<TableResponse<T>>;
  rowKey?: keyof T;

  // Feature Toggles
  showSearch?: boolean;
  showFilters?: boolean;
  showColumnToggle?: boolean;
  showDensityToggle?: boolean;
  showExport?: boolean;
  showAddButton?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  showRowsPerPage?: boolean;

  // Actions
  addRoute?: string;
  editRoute?: string;
  viewRoute?: string;
  deleteRoute?: string;
  onAddClick?: () => void;
  onEditClick?: (row: T) => void;
  onViewClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  onRowClick?: (row: T) => void;

  // Customization
  addButtonLabel?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  defaultDensity?: "compact" | "comfortable" | "spacious";
  customFilters?: React.ReactNode;
  additionalButtons?: React.ReactNode;

  // Advanced Features
  enableMultiSort?: boolean;
  enableRowSelection?: boolean;
  stickyHeader?: boolean;
  highlightOnHover?: boolean;
  striped?: boolean;
}

type Density = "compact" | "comfortable" | "spacious";

// ============================================
// Utility Functions
// ============================================

const exportToExcel = (data: any[], columns: KiduColumn[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map((row) => {
      const obj: any = {};
      columns.forEach((col) => {
        if (col.key !== "actions") {
          obj[col.label] = row[col.key];
        }
      });
      return obj;
    })
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

const exportToCSV = (data: any[], columns: KiduColumn[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map((row) => {
      const obj: any = {};
      columns.forEach((col) => {
        if (col.key !== "actions") {
          obj[col.label] = row[col.key];
        }
      });
      return obj;
    })
  );
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

const exportToPDF = (data: any[], columns: KiduColumn[], filename: string, title: string) => {
  const doc = new jsPDF();
  const tableColumns = columns.filter((c) => c.key !== "actions").map((c) => c.label);
  const tableRows = data.map((row) =>
    columns.filter((c) => c.key !== "actions").map((col) => row[col.key] || "")
  );

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  (doc as any).autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [27, 55, 99] },
  });

  doc.save(`${filename}.pdf`);
};

// ============================================
// Main Component
// ============================================

function KiduServerTable<T extends Record<string, any>>({
  title = "Data Table",
  subtitle,
  columns: initialColumns,
  fetchData,
  rowKey = "id" as keyof T,

  showSearch = true,
  showFilters = true,
  showColumnToggle = true,
  showDensityToggle = true,
  showExport = true,
  showAddButton = false,
  showActions = true,
  showPagination = true,
  showRowsPerPage = true,

  addRoute,
  editRoute,
  viewRoute,
  deleteRoute,
  onAddClick,
  onEditClick,
  onViewClick,
  onDeleteClick,
  onRowClick,

  addButtonLabel = "Add New",
  rowsPerPageOptions = [10, 25, 50, 100],
  defaultRowsPerPage = 10,
  defaultDensity = "comfortable",
  customFilters,
  additionalButtons,

  enableMultiSort = false,
  enableRowSelection = false,
  stickyHeader = true,
  highlightOnHover = true,
  striped = true,
}: KiduServerTableProps<T>) {
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);

  // ============================================
  // State Management
  // ============================================

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [density, setDensity] = useState<Density>(defaultDensity);
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ============================================
  // Effects
  // ============================================

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: TableRequestParams = {
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        searchTerm: debouncedSearch,
        sortBy: sorting[0]?.id,
        sortDescending: sorting[0]?.desc,
        ...columnFilters,
      };

      const response = await fetchData(params);

      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, debouncedSearch, sorting, columnFilters, fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ============================================
  // Computed Values
  // ============================================

  const totalPages = Math.ceil(total / rowsPerPage);

  const densityClasses = {
    compact: "py-1 px-2",
    comfortable: "py-2 px-3",
    spacious: "py-3 px-4",
  };

  const densityFontSize = {
    compact: "11px",
    comfortable: "13px",
    spacious: "14px",
  };

  // ============================================
  // Table Columns Definition
  // ============================================

  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = initialColumns.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      enableSorting: col.enableSorting !== false,
      size: col.width,
      minSize: col.minWidth,
      cell: ({ getValue, row }) => {
        const value = getValue();

        if (col.render) {
          return col.render(value, row.original);
        }

        if (value === null || value === undefined || value === "") {
          return <span className="text-muted">-</span>;
        }

        switch (col.type) {
          case "checkbox":
            return (
              <Form.Check
                type="checkbox"
                checked={!!value}
                disabled
                style={{ accentColor: "#1B3763" }}
              />
            );

          case "image":
            return (
              <img
                src={String(value)}
                alt="Preview"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #1B3763",
                }}
                onError={(e: any) => {
                  e.target.src = "/assets/Images/profile.jpeg";
                }}
              />
            );

          case "rating":
            const rating = Math.min(Math.max(Number(value) || 0, 0), 5);
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating - fullStars >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return (
              <div className="d-flex align-items-center gap-1">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <span key={`full-${i}`} style={{ color: "#FFD700", fontSize: "14px" }}>
                    ★
                  </span>
                ))}
                {hasHalfStar && (
                  <span style={{ position: "relative", display: "inline-block" }}>
                    <span style={{ color: "#e0e0e0", fontSize: "14px" }}>★</span>
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        color: "#FFD700",
                        fontSize: "14px",
                        width: "50%",
                        overflow: "hidden",
                      }}
                    >
                      ★
                    </span>
                  </span>
                )}
                {Array.from({ length: emptyStars }).map((_, i) => (
                  <span key={`empty-${i}`} style={{ color: "#e0e0e0", fontSize: "14px" }}>
                    ★
                  </span>
                ))}
                <span className="ms-1 text-muted" style={{ fontSize: "11px" }}>
                  ({rating.toFixed(1)})
                </span>
              </div>
            );

          case "date":
            try {
              const date = new Date(String(value));
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
            } catch (e) {
              // Fall through to default
            }
            break;

          case "badge":
            return (
              <Badge bg="primary" style={{ backgroundColor: "#1B3763" }}>
                {String(value)}
              </Badge>
            );

          case "currency":
            return `$${Number(value).toFixed(2)}`;

          default:
            return String(value);
        }

        return String(value);
      },
    }));

    // Add actions column
    if (showActions && (editRoute || viewRoute || deleteRoute || onEditClick || onViewClick || onDeleteClick)) {
      cols.push({
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle
              variant="link"
              size="sm"
              className="text-dark p-0"
              style={{ border: "none", boxShadow: "none" }}
            >
              <FaEllipsisV />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              {(viewRoute || onViewClick) && (
                <Dropdown.Item
                  onClick={() => {
                    if (onViewClick) onViewClick(row.original);
                    else if (viewRoute) navigate(`${viewRoute}/${row.original[rowKey]}`);
                  }}
                >
                  <FaEye className="me-2" /> View
                </Dropdown.Item>
              )}

              {(editRoute || onEditClick) && (
                <Dropdown.Item
                  onClick={() => {
                    if (onEditClick) onEditClick(row.original);
                    else if (editRoute) navigate(`${editRoute}/${row.original[rowKey]}`);
                  }}
                >
                  <FaEdit className="me-2" /> Edit
                </Dropdown.Item>
              )}

              {(deleteRoute || onDeleteClick) && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="text-danger"
                    onClick={() => {
                      if (onDeleteClick) onDeleteClick(row.original);
                    }}
                  >
                    <FaTrash className="me-2" /> Delete
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        ),
      });
    }

    return cols;
  }, [initialColumns, showActions, editRoute, viewRoute, deleteRoute, onEditClick, onViewClick, onDeleteClick, navigate, rowKey]);

  // ============================================
  // Table Instance
  // ============================================

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  // ============================================
  // Event Handlers
  // ============================================

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      tableRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExport = (format: "excel" | "csv" | "pdf") => {
    const filename = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}`;

    switch (format) {
      case "excel":
        exportToExcel(data, initialColumns, filename);
        break;
      case "csv":
        exportToCSV(data, initialColumns, filename);
        break;
      case "pdf":
        exportToPDF(data, initialColumns, filename, title);
        break;
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      tableRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // ============================================
  // Render Pagination
  // ============================================

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    const pages: number[] = [];
    const maxPages = 5;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxPages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxPages + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return (
      <Pagination size="sm" className="mb-0">
        <Pagination.First disabled={currentPage === 1} onClick={() => handlePageChange(1)} />
        <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />

        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
            style={{
              backgroundColor: page === currentPage ? "#1B3763" : "transparent",
              borderColor: "#1B3763",
              color: page === currentPage ? "white" : "#1B3763",
            }}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
        <Pagination.Last disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)} />
      </Pagination>
    );
  };

  // ============================================
  // Render Component
  // ============================================

  return (
    <Container fluid className="kidu-server-table" ref={tableRef}>
      {/* Header */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h4 className="mb-0 fw-bold" style={{ fontFamily: "Urbanist", color: "#1B3763" }}>
            {title}
          </h4>
          {subtitle && (
            <p className="text-muted mb-0" style={{ fontFamily: "Urbanist", fontSize: "13px" }}>
              {subtitle}
            </p>
          )}
        </Col>
      </Row>

      {/* Toolbar */}
      <Row className="mb-3 g-2">
        {/* Search */}
        {showSearch && (
          <Col xs={12} md={6} lg={4}>
            <InputGroup size="sm">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: "13px" }}
              />
              {searchTerm && (
                <Button variant="outline-secondary" size="sm" onClick={() => setSearchTerm("")}>
                  <FaTimes />
                </Button>
              )}
            </InputGroup>
          </Col>
        )}

        <Col xs="auto" className="ms-auto d-flex gap-2 flex-wrap">
          {/* Filters Toggle */}
          {showFilters && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowFilterRow(!showFilterRow)}
              style={{
                borderColor: "#1B3763",
                color: "#1B3763",
                fontSize: "12px",
              }}
            >
              <FaFilter className="me-1" />
              Filters
              {Object.values(columnFilters).filter(Boolean).length > 0 && (
                <Badge bg="danger" className="ms-2">
                  {Object.values(columnFilters).filter(Boolean).length}
                </Badge>
              )}
            </Button>
          )}

          {/* Column Toggle */}
          {showColumnToggle && (
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" size="sm" style={{ borderColor: "#1B3763", color: "#1B3763", fontSize: "12px" }}>
                <FaColumns className="me-1" />
                Columns
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {initialColumns.map((col) => (
                  <Dropdown.Item
                    key={col.key}
                    onClick={() =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [col.key]: !prev[col.key],
                      }))
                    }
                  >
                    <Form.Check
                      type="checkbox"
                      label={col.label}
                      checked={!columnVisibility[col.key]}
                      onChange={() => {}}
                      style={{ pointerEvents: "none" }}
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Density Toggle */}
          {showDensityToggle && (
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" size="sm" style={{ borderColor: "#1B3763", color: "#1B3763", fontSize: "12px" }}>
                <FaCog className="me-1" />
                Density
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {(["compact", "comfortable", "spacious"] as Density[]).map((d) => (
                  <Dropdown.Item key={d} onClick={() => setDensity(d)} className="text-capitalize">
                    {density === d && "✓ "}
                    {d}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Export */}
          {showExport && (
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" size="sm" style={{ borderColor: "#1B3763", color: "#1B3763", fontSize: "12px" }}>
                <FaDownload className="me-1" />
                Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleExport("excel")}>
                  <FaFileExcel className="me-2 text-success" />
                  Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleExport("csv")}>
                  <FaFileCsv className="me-2 text-info" />
                  CSV
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleExport("pdf")}>
                  <FaFilePdf className="me-2 text-danger" />
                  PDF
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => window.print()}>
                  <FaPrint className="me-2" />
                  Print
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Fullscreen */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={toggleFullscreen}
            style={{ borderColor: "#1B3763", color: "#1B3763", fontSize: "12px" }}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </Button>

          {/* Additional Buttons */}
          {additionalButtons}

          {/* Add Button */}
          {showAddButton && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (onAddClick) onAddClick();
                else if (addRoute) navigate(addRoute);
              }}
              style={{
                backgroundColor: "#1B3763",
                border: "none",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <FaPlus className="me-1" />
              {addButtonLabel}
            </Button>
          )}
        </Col>
      </Row>

      {/* Filter Row */}
      {showFilterRow && (
        <Row className="mb-3 p-3 bg-light rounded">
          {initialColumns
            .filter((col) => col.enableFiltering !== false)
            .map((col) => (
              <Col xs={12} sm={6} md={4} lg={3} key={col.key} className="mb-2">
                <Form.Label className="text-muted small fw-semibold">{col.label}</Form.Label>
                {col.filterType === "select" && col.filterOptions ? (
                  <Form.Select
                    size="sm"
                    value={columnFilters[col.key] || ""}
                    onChange={(e) =>
                      setColumnFilters((prev) => ({
                        ...prev,
                        [col.key]: e.target.value,
                      }))
                    }
                    style={{ fontSize: "12px" }}
                  >
                    <option value="">All</option>
                    {col.filterOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={col.filterType === "number" ? "number" : col.filterType === "date" ? "date" : "text"}
                    size="sm"
                    placeholder={`Filter ${col.label}...`}
                    value={columnFilters[col.key] || ""}
                    onChange={(e) =>
                      setColumnFilters((prev) => ({
                        ...prev,
                        [col.key]: e.target.value,
                      }))
                    }
                    style={{ fontSize: "12px" }}
                  />
                )}
              </Col>
            ))}
          <Col xs={12} className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setColumnFilters({})}
              style={{ fontSize: "12px" }}
            >
              Clear Filters
            </Button>
          </Col>

          {customFilters && <Col xs={12}>{customFilters}</Col>}
        </Row>
      )}

      {/* Table */}
      <Row>
        <Col>
          <div className="table-responsive" style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #dee2e6" }}>
            <table
              className={`table table-hover mb-0 ${striped ? "table-striped" : ""}`}
              style={{
                fontSize: densityFontSize[density],
                fontFamily: "Urbanist",
              }}
            >
              <thead
                className={`text-center ${stickyHeader ? "sticky-top" : ""}`}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderBottom: "2px solid #1B3763",
                }}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={densityClasses[density]}
                        style={{
                          cursor: header.column.getCanSort() ? "pointer" : "default",
                          userSelect: "none",
                          fontWeight: 600,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "#1B3763",
                          verticalAlign: "middle",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span>
                              {header.column.getIsSorted() === "asc" ? (
                                <FaSortUp />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <FaSortDown />
                              ) : (
                                <FaSort style={{ opacity: 0.3 }} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="text-center">
                {loading ? (
                  <tr>
                    <td colSpan={tableColumns.length} className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2 text-muted">Loading data...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={tableColumns.length} className="text-center py-5">
                      <div className="text-danger">
                        <p className="fw-bold">Error: {error}</p>
                        <Button variant="primary" size="sm" onClick={loadData} style={{ backgroundColor: "#1B3763" }}>
                          Retry
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={tableColumns.length} className="text-center py-5">
                      <p className="text-muted mb-0">No records found</p>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      style={{
                        cursor: onRowClick ? "pointer" : "default",
                        transition: "background-color 0.2s",
                      }}
                      className={highlightOnHover ? "table-row-hover" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={densityClasses[density]}
                          style={{
                            verticalAlign: "middle",
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>

      {/* Footer */}
      {showPagination && (
        <Row className="mt-3 align-items-center">
          <Col xs={12} md={6}>
            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px", fontFamily: "Urbanist" }}>
              <span>
                Showing {(currentPage - 1) * rowsPerPage + 1} -{" "}
                {Math.min(currentPage * rowsPerPage, total)} of {total}
              </span>
              {showRowsPerPage && (
                <>
                  <Form.Select
                    size="sm"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ width: "auto", fontSize: "12px" }}
                  >
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                  <span>per page</span>
                </>
              )}
            </div>
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
            {renderPagination()}
          </Col>
        </Row>
      )}

      {/* Custom Styles */}
      <style>{`
        .kidu-server-table .table-row-hover:hover {
          background-color: #f8f9fa !important;
        }

        .kidu-server-table .sticky-top {
          position: sticky;
          top: 0;
          z-index: 10;
        }

        @media print {
          .kidu-server-table .no-print {
            display: none !important;
          }
        }

        .kidu-server-table .pagination .page-link {
          color: #1B3763;
        }

        .kidu-server-table .pagination .page-item.active .page-link {
          background-color: #1B3763;
          border-color: #1B3763;
        }
      `}</style>
    </Container>
  );
}

export default KiduServerTable;