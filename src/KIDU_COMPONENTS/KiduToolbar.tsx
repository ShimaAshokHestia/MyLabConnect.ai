/**
 * KiduToolbar.tsx
 * ─────────────────────────────────────────────────────────────────
 * Fully-controlled standalone toolbar used by KiduServerTable.
 * All state lives in the parent — this component is pure UI.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { Form, Button, Dropdown, Badge } from "react-bootstrap";
import {
  FaSearch, FaTimes, FaFilter, FaColumns, FaCog,
  FaCheckSquare, FaSquare, FaDownload, FaFileExcel,
  FaFileCsv, FaFilePdf, FaPrint, FaPlus, FaCheck,
  FaThumbtack, FaExpand, FaCompress,
} from "react-icons/fa";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type Density       = "compact" | "comfortable" | "spacious";
export type ExportFormat  = "excel" | "csv" | "pdf" | "print";

export interface ToolbarColumnConfig {
  key:     string;
  label:   string;
  pinned?: "left" | "right" | false;
}

export interface KiduToolbarProps {
  // Header
  title?:    string;
  subtitle?: string;

  // Search
  showSearch?:    boolean;
  searchValue:    string;
  onSearchChange: (value: string) => void;

  // Filters
  showFilters?:      boolean;
  activeFilterCount?: number;
  filtersOpen?:      boolean;
  onFiltersToggle?:  () => void;

  // Column toggle & pin
  showColumnToggle?:        boolean;
  columns?:                 ToolbarColumnConfig[];
  columnVisibility?:        Record<string, boolean>;
  onColumnVisibilityToggle?: (key: string) => void;
  onColumnPin?:             (key: string, side: "left" | "right") => void;

  // Density
  showDensityToggle?: boolean;
  density?:           Density;
  onDensityChange?:   (d: Density) => void;

  // Row-selection checkbox toggle
  showSelectionToggle?: boolean;
  selectionEnabled?:    boolean;
  onSelectionToggle?:   () => void;

  // Export
  showExport?: boolean;
  onExport?:   (format: ExportFormat) => void;

  // Fullscreen
  showFullscreen?:    boolean;
  isFullscreen?:      boolean;
  onFullscreenToggle?: () => void;

  // Add button
  showAddButton?:  boolean;
  addButtonLabel?: string;
  onAddClick?:     () => void;

  // Extra button slot (rendered just before the Add button)
  additionalButtons?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

const KiduToolbar: React.FC<KiduToolbarProps> = ({
  title, subtitle,
  showSearch = true, searchValue, onSearchChange,
  showFilters = true, activeFilterCount = 0, filtersOpen = false, onFiltersToggle,
  showColumnToggle = true, columns = [], columnVisibility = {},
  onColumnVisibilityToggle, onColumnPin,
  showDensityToggle = true, density = "comfortable", onDensityChange,
  showSelectionToggle = true, selectionEnabled = true, onSelectionToggle,
  showExport = true, onExport,
  showFullscreen = true, isFullscreen = false, onFullscreenToggle,
  showAddButton = false, addButtonLabel = "Add New", onAddClick,
  additionalButtons,
}) => (
  <div className="kidu-toolbar">

    {/* ── Header ─────────────────────────────────────────────── */}
    {(title || subtitle) && (
      <div className="kidu-toolbar-header">
        {title    && <h5 className="kidu-toolbar-title">{title}</h5>}
        {subtitle && <p  className="kidu-toolbar-subtitle">{subtitle}</p>}
      </div>
    )}

    {/* ── Controls row ───────────────────────────────────────── */}
    <div className="kidu-toolbar-row">

      {/* Search */}
      {showSearch && (
        <div className="kidu-search-wrapper">
          <FaSearch className="kidu-search-icon" />
          <Form.Control
            type="text"
            placeholder={title ? `Search ${title.toLowerCase()}...` : "Search..."}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="kidu-search-input"
          />
          {searchValue && (
            <button
              type="button"
              className="kidu-search-clear"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      )}

      {/* Right-side actions */}
      <div className="kidu-toolbar-actions">

        {/* Filters */}
        {showFilters && (
          <Button
            variant="outline-secondary" size="sm"
            onClick={onFiltersToggle}
            className={`kidu-toolbar-btn ${filtersOpen ? "kidu-toolbar-btn--active" : ""}`}
          >
            <FaFilter />
            <span className="kidu-btn-label">Filters</span>
            {activeFilterCount > 0 && (
              <Badge bg="danger" pill className="kidu-filter-badge">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}

        {/* Columns */}
        {showColumnToggle && columns.length > 0 && (
          <Dropdown autoClose="outside">
            <Dropdown.Toggle variant="outline-secondary" size="sm" className="kidu-toolbar-btn">
              <FaColumns />
              <span className="kidu-btn-label">Columns</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="kidu-column-menu">
              <div className="kidu-column-menu-header">Toggle Columns</div>

              {columns.map((col) => (
                <div key={col.key} className="kidu-column-item">
                  <label
                    className="kidu-column-item-label"
                    onClick={() => onColumnVisibilityToggle?.(col.key)}
                  >
                    <span className={`kidu-col-check-icon ${!columnVisibility[col.key] ? "on" : ""}`}>
                      {!columnVisibility[col.key] && <FaCheck size={8} />}
                    </span>
                    <span>{col.label}</span>
                  </label>

                  {onColumnPin && (
                    <Dropdown drop="end" autoClose="outside">
                      <Dropdown.Toggle
                        variant="link" size="sm"
                        className={`kidu-pin-btn ${col.pinned ? "active" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaThumbtack size={10} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => { e.stopPropagation(); onColumnPin(col.key, "left"); }}>
                          {col.pinned === "left" && <FaCheck className="me-2 text-primary" size={10} />}
                          Pin Left
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => { e.stopPropagation(); onColumnPin(col.key, "right"); }}>
                          {col.pinned === "right" && <FaCheck className="me-2 text-primary" size={10} />}
                          Pin Right
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* Density */}
        {showDensityToggle && (
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm" className="kidu-toolbar-btn">
              <FaCog />
              <span className="kidu-btn-label">Density</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {(["compact", "comfortable", "spacious"] as Density[]).map((d) => (
                <Dropdown.Item
                  key={d} onClick={() => onDensityChange?.(d)}
                  className="kidu-dropdown-item text-capitalize"
                >
                  {density === d && <FaCheck className="me-2" size={10} />}
                  {d}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* Row-selection toggle */}
        {showSelectionToggle && (
          <Button
            variant="outline-secondary" size="sm"
            onClick={onSelectionToggle}
            title={selectionEnabled ? "Disable row selection" : "Enable row selection"}
            className="kidu-toolbar-btn"
          >
            {selectionEnabled ? <FaCheckSquare /> : <FaSquare />}
          </Button>
        )}

        <div className="kidu-toolbar-divider" />

        {/* Export */}
        {showExport && (
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-secondary" size="sm" className="kidu-toolbar-btn">
              <FaDownload />
              <span className="kidu-btn-label">Export</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onExport?.("excel")} className="kidu-dropdown-item">
                <FaFileExcel className="me-2 text-success" /> Excel
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onExport?.("csv")} className="kidu-dropdown-item">
                <FaFileCsv className="me-2 text-info" /> CSV
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onExport?.("pdf")} className="kidu-dropdown-item">
                <FaFilePdf className="me-2 text-danger" /> PDF
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => onExport?.("print")} className="kidu-dropdown-item">
                <FaPrint className="me-2" /> Print
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

        {/* Fullscreen */}
        {showFullscreen && (
          <Button
            variant="outline-secondary" size="sm"
            onClick={onFullscreenToggle}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="kidu-toolbar-btn"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </Button>
        )}

        {/* Extra slot */}
        {additionalButtons}

        {/* Add / Create */}
        {showAddButton && (
          <Button variant="primary" size="sm" onClick={onAddClick} className="kidu-add-btn">
            <FaPlus className="me-1" />
            {addButtonLabel}
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default KiduToolbar;