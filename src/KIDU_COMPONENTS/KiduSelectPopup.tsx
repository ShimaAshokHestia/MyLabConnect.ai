import React, {
  useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle,
  type CSSProperties,
} from "react";
import { Modal } from "react-bootstrap";
import HttpService from "../Services/Common/HttpService";
import "../Styles/KiduStyles/PopUp.css";

// ==================== TYPES ====================

export interface KiduSelectColumn<T> {
  key: keyof T;
  label: string;
  filterType?: "text" | "select";
  filterOptions?: string[];
  render?: (value: any, row: T) => React.ReactNode;
}

export interface KiduSelectPopupProps<T extends Record<string, any>> {
  show: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data?: T[];
  fetchEndpoint?: string;
  loading?: boolean;
  columns: KiduSelectColumn<T>[];
  onSelect: (item: T) => void;
  idKey?: keyof T;
  labelKey: keyof T;
  searchKeys?: (keyof T)[];
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  themeColor?: string;
  multiSelect?: boolean;
  AddModalComponent?: React.ComponentType<{
    show: boolean;
    handleClose: () => void;
    onAdded: (item: T) => void;
  }>;
  showAddButton?: boolean;
  addButtonLabel?: string;
  /** Name for reset ref registration */
  name?: string;
  /** Ref for reset functionality */
  resetRef?: React.MutableRefObject<{ [key: string]: () => void }> | null;
}

export interface KiduSelectPopupHandle {
  reset: () => void;
}

// ═══════════════════════════════════════════════════════════
// KiduSelectInputPill
// ═══════════════════════════════════════════════════════════

export interface KiduSelectInputPillProps {
  label?: string;
  value: string;
  onOpen: () => void;
  onClear: () => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  themeColor?: string;
  placeholder?: string;
  inputHeight?: string | number;
  inputWidth?: string | number;
  inputStyle?: CSSProperties;
  triggerClassName?: string;
}

export const KiduSelectInputPill: React.FC<KiduSelectInputPillProps> = ({
  label,
  value,
  onOpen,
  onClear,
  required,
  error,
  disabled,
  placeholder = "Click to select...",
  inputHeight = "40px",
  inputWidth = "100%",
  inputStyle = {},
  triggerClassName = "",
}) => {
  const h = typeof inputHeight === "number" ? `${inputHeight}px` : inputHeight;
  const w = typeof inputWidth === "number" ? `${inputWidth}px` : inputWidth;

  return (
    <div className="ksp-pill-wrap">
      {label && (
        <span className="ksp-pill-label">
          {label}{required && <span className="req">*</span>}
        </span>
      )}
      <div
        className={[
          "ksp-pill-trigger",
          error ? "ksp-pill-error-border" : "",
          triggerClassName,
        ].filter(Boolean).join(" ")}
        style={{ minHeight: h, width: w, ...inputStyle }}
        data-disabled={disabled || undefined}
        onClick={!disabled ? onOpen : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) onOpen();
        }}
      >
        {value ? (
          <span className="ksp-pill-tag">
            {value}
            <button
              className="ksp-pill-clear"
              type="button"
              aria-label="Clear selection"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
            >✕</button>
          </span>
        ) : (
          <span className="ksp-pill-placeholder">{placeholder}</span>
        )}
        <svg className="ksp-pill-search-ico" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" width="15" height="15">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      {error && <span className="ksp-pill-error-msg">{error}</span>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// KiduSelectPopup
// ═══════════════════════════════════════════════════════════

function KiduSelectPopupInner<T extends Record<string, any>>({
  show,
  onClose,
  title,
  subtitle,
  data: externalData,
  fetchEndpoint,
  loading: externalLoading = false,
  columns,
  onSelect,
  idKey = "id" as keyof T,
  searchKeys,
  rowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 20, 50],
  themeColor = "#ef0d50",
  multiSelect = false,
  AddModalComponent,
  showAddButton = false,
  addButtonLabel = "Add New",
  name,
  resetRef,
}: KiduSelectPopupProps<T>, ref: React.Ref<KiduSelectPopupHandle>) {

  const [allData, setAllData]     = useState<T[]>([]);
  const [filtered, setFiltered]   = useState<T[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [search, setSearch]               = useState("");
  const [filtersOpen, setFiltersOpen]     = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [page, setPage]       = useState(1);
  const [perPage, setPerPage] = useState(rowsPerPage);
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());
  const [showAdd, setShowAdd]         = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // ── FIX: guard against Strict Mode double-invoke ──────────────────────────
  // React 18 Strict Mode mounts → unmounts → remounts every component in dev,
  // causing useEffect to fire twice. Without this guard, every popup open
  // triggers two identical API calls. The ref resets to false when show goes
  // false (popup closed), so the next open always fetches fresh data.
  const fetchCalledRef = useRef(false);

  const isLoading = fetchLoading || externalLoading;
  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;

  // ── Reset function ────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setSearch("");
    setColumnFilters({});
    setSelectedIds(new Set());
    setPage(1);
    setFiltersOpen(false);
    setPerPage(rowsPerPage);
  }, [rowsPerPage]);

  // Expose reset function via ref
  useImperativeHandle(ref, () => ({
    reset
  }));

  // Register reset function with parent
  useEffect(() => {
    if (name && resetRef?.current) {
      resetRef.current[name] = reset;
      return () => {
        delete resetRef.current[name];
      };
    }
  }, [name, reset, resetRef]);

  // ── Fetch / sync data on open ────────────────────────────────────────────
  useEffect(() => {
    // When popup closes: reset the fetch guard so next open fetches fresh data
    if (!show) {
      fetchCalledRef.current = false;
      return;
    }

    // Guard: skip if this open has already triggered a fetch
    // Prevents the Strict Mode double-invoke from making two identical API calls
    if (fetchCalledRef.current) return;
    fetchCalledRef.current = true;

    setSearch("");
    setColumnFilters({});
    setSelectedIds(new Set());
    setPage(1);
    setFiltersOpen(false);
    setPerPage(rowsPerPage);

    if (externalData !== undefined) {
      setAllData(externalData);
      setFiltered(externalData);
      setTimeout(() => searchRef.current?.focus(), 120);
      return;
    }

    if (!fetchEndpoint) return;
    setFetchLoading(true);
    HttpService.callApi<any>(fetchEndpoint, "GET")
      .then((res) => {
        const items: T[] =
          Array.isArray(res)         ? res         :
          Array.isArray(res?.value)  ? res.value   :
          Array.isArray(res?.data)   ? res.data    : [];
        setAllData(items);
        setFiltered(items);
      })
      .catch(() => { setAllData([]); setFiltered([]); })
      .finally(() => {
        setFetchLoading(false);
        setTimeout(() => searchRef.current?.focus(), 120);
      });
  }, [show, fetchEndpoint, rowsPerPage, externalData]);

  useEffect(() => {
    if (!show || externalData === undefined) return;
    setAllData(externalData);
    setFiltered(externalData);
  }, [externalData, show]);

  // ── Combined filter ──────────────────────────────────────────────────────
  useEffect(() => {
    let result = allData;
    const q = search.toLowerCase().trim();
    if (q) {
      const keys = searchKeys ?? columns.map((c) => c.key);
      result = result.filter((row) =>
        keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val) return;
      result = result.filter((row) =>
        String(row[key] ?? "").toLowerCase().includes(val.toLowerCase())
      );
    });
    setFiltered(result);
    setPage(1);
  }, [search, columnFilters, allData, searchKeys, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData   = filtered.slice((page - 1) * perPage, page * perPage);

  const allPageSelected  = pageData.length > 0 && pageData.every((r) => selectedIds.has(r[idKey]));
  const somePageSelected = pageData.some((r) => selectedIds.has(r[idKey]));

  const toggleRowId = (id: any) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePageAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) { pageData.forEach((r) => next.delete(r[idKey])); }
      else { pageData.forEach((r) => next.add(r[idKey])); }
      return next;
    });
  };

  const handleSingleSelect = useCallback((item: T) => {
    onSelect(item);
    onClose();
  }, [onSelect, onClose]);

  const handleConfirmMulti = useCallback(() => {
    allData.filter((r) => selectedIds.has(r[idKey])).forEach((r) => onSelect(r));
    onClose();
  }, [allData, selectedIds, idKey, onSelect, onClose]);

  const handleAdded = useCallback((item: T) => {
    setAllData((prev) => [item, ...prev]);
    setShowAdd(false);
  }, []);

  const highlight = (text: string) => {
    if (!search.trim()) return <>{text}</>;
    const q   = search.toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{
          background: `${themeColor}28`, color: themeColor,
          padding: "0 2px", borderRadius: 3, fontWeight: 700,
        }}>
          {text.slice(idx, idx + search.length)}
        </mark>
        {text.slice(idx + search.length)}
      </>
    );
  };

  const visiblePages = () => {
    const count = Math.min(totalPages, 5);
    let start = 1;
    if (totalPages > 5) {
      if (page <= 3) start = 1;
      else if (page >= totalPages - 2) start = totalPages - 4;
      else start = page - 2;
    }
    return Array.from({ length: count }, (_, i) => start + i);
  };

  const filterableCols = columns.filter((c) => !!c.filterType);

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg" centered
        className="ksp-modal" backdrop="static">

        <Modal.Header closeButton>
          <div>
            <p className="ksp-title">{title}</p>
            {subtitle && <p className="ksp-subtitle">{subtitle}</p>}
          </div>
        </Modal.Header>

        {/* Search + Filter toggle */}
        <div className="ksp-search-zone">
          <div className="ksp-search-wrap">
            <svg className="ksp-search-svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchRef}
              className="ksp-search-input"
              placeholder={`Search ${title.replace("Select ", "").toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!isLoading && (
              <span className="ksp-result-badge">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {filterableCols.length > 0 && (
            <button
              className={`ksp-filter-toggle${filtersOpen ? " active" : ""}`}
              type="button"
              onClick={() => setFiltersOpen((p) => !p)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" width="13" height="13">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="ksp-filter-badge">{activeFilterCount}</span>
              )}
            </button>
          )}
        </div>

        {/* Column filters */}
        {filtersOpen && filterableCols.length > 0 && (
          <div className="ksp-filter-row">
            {filterableCols.map((col) => (
              <div key={String(col.key)} className="ksp-filter-field">
                <label className="ksp-filter-label">{col.label}</label>
                {col.filterType === "select" && col.filterOptions ? (
                  <select
                    className="ksp-filter-input"
                    value={columnFilters[String(col.key)] ?? ""}
                    onChange={(e) =>
                      setColumnFilters((p) => ({ ...p, [String(col.key)]: e.target.value }))
                    }
                  >
                    <option value="">All</option>
                    {col.filterOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="ksp-filter-input"
                    type="text"
                    placeholder={`Filter ${col.label}...`}
                    value={columnFilters[String(col.key)] ?? ""}
                    onChange={(e) =>
                      setColumnFilters((p) => ({ ...p, [String(col.key)]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
            <button className="ksp-filter-clear-btn" type="button"
              onClick={() => setColumnFilters({})}>
              Clear All
            </button>
          </div>
        )}

        {/* Multi-select count banner */}
        {multiSelect && selectedIds.size > 0 && (
          <div className="ksp-sel-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" width="13" height="13">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {selectedIds.size} row{selectedIds.size !== 1 ? "s" : ""} selected
            <button className="ksp-sel-bar-clear" type="button"
              onClick={() => setSelectedIds(new Set())}>Clear</button>
          </div>
        )}

        {/* Table body */}
        <div className="ksp-body">
          {isLoading ? (
            <table className="ksp-tbl">
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="ksp-skel-row">
                    {multiSelect && <td><div className="ksp-skel" style={{ width: 15 }} /></td>}
                    {columns.map((_, ci) => (
                      <td key={ci}>
                        <div className="ksp-skel" style={{ width: `${50 + (ci * 17) % 38}%` }} />
                      </td>
                    ))}
                    <td><div className="ksp-skel" style={{ width: 60 }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : filtered.length === 0 ? (
            <div className="ksp-empty">
              <div className="ksp-empty-icon">🔍</div>
              <p className="ksp-empty-text">
                {search || activeFilterCount > 0
                  ? "No results match your filters"
                  : "No records found"}
              </p>
            </div>
          ) : (
            <table className="ksp-tbl">
              <thead>
                <tr>
                  {multiSelect && (
                    <th className="ksp-th-check">
                      <input type="checkbox" className="ksp-checkbox"
                        checked={allPageSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = somePageSelected && !allPageSelected;
                        }}
                        onChange={togglePageAll}
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th key={String(col.key)}>{col.label}</th>
                  ))}
                  {!multiSelect && <th style={{ width: 90 }} />}
                </tr>
              </thead>
              <tbody>
                {pageData.map((row) => {
                  const id         = row[idKey];
                  const isSelected = selectedIds.has(id);
                  return (
                    <tr key={String(id)}
                      className={isSelected ? "ksp-row-selected" : ""}
                      onClick={() => {
                        if (multiSelect) toggleRowId(id);
                        else handleSingleSelect(row);
                      }}
                    >
                      {multiSelect && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="ksp-checkbox"
                            checked={isSelected} onChange={() => toggleRowId(id)} />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={String(col.key)}>
                          {col.render
                            ? col.render(row[col.key], row)
                            : highlight(String(row[col.key] ?? "—"))}
                        </td>
                      ))}
                      {!multiSelect && (
                        <td style={{ textAlign: "right" }}>
                          <button className="ksp-row-pill" type="button"
                            onClick={(e) => { e.stopPropagation(); handleSingleSelect(row); }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                              strokeWidth="3" width="10" height="10">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Select
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="ksp-footer">
          <div className="ksp-footer-left">
            {showAddButton && AddModalComponent && (
              <button className="ksp-add-btn" type="button" onClick={() => setShowAdd(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" width="13" height="13">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {addButtonLabel}
              </button>
            )}
            <div className="ksp-rpp-wrap">
              <span className="ksp-rpp-label">Rows per page</span>
              <select className="ksp-rpp-select" value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                {rowsPerPageOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ksp-footer-right">
            {totalPages > 1 && (
              <>
                <span className="ksp-pg-info">Page {page} of {totalPages}</span>
                <div className="ksp-pg">
                  <button className="ksp-pg-btn" disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}>‹</button>
                  {visiblePages().map((n) => (
                    <button key={n}
                      className={`ksp-pg-btn${n === page ? " active" : ""}`}
                      onClick={() => setPage(n)}>{n}</button>
                  ))}
                  <button className="ksp-pg-btn" disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}>›</button>
                </div>
              </>
            )}
            {multiSelect && (
              <button className="ksp-confirm-btn" type="button"
                disabled={selectedIds.size === 0} onClick={handleConfirmMulti}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" width="13" height="13">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Confirm{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
              </button>
            )}
          </div>
        </div>
      </Modal>

      {AddModalComponent && (
        <AddModalComponent
          show={showAdd}
          handleClose={() => setShowAdd(false)}
          onAdded={handleAdded}
        />
      )}
    </>
  );
}

const KiduSelectPopup = forwardRef(KiduSelectPopupInner) as <T extends Record<string, any>>(
  props: KiduSelectPopupProps<T> & { ref?: React.Ref<KiduSelectPopupHandle> }
) => React.ReactElement;

export default KiduSelectPopup;