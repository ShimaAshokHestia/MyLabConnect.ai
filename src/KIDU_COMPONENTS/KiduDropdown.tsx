import React, { useState, useEffect, useRef, useCallback } from "react";
import "../Styles/KiduStyles/Dropdown.css";

// ==================== TYPES ====================

export interface KiduDropdownOption {
  value: string | number;
  label: string;
}

export interface KiduDropdownPaginatedParams {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
}

export interface KiduDropdownPaginatedResult {
  data: any[];
  total: number;
  totalPages?: number;
}

export interface KiduDropdownProps {
  /** Currently selected value (the ID / key sent to backend) */
  value: string | number | null | undefined;
  /** Called with the raw value (id) when user picks an option */
  onChange: (value: string | number | null) => void;
  /** Placeholder shown when nothing is selected */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error message to show below the input */
  error?: string;
  /** Full width of the dropdown trigger */
  inputWidth?: string;

  // ── Static options (mutually exclusive with paginatedFetch) ──
  /** Static list of { value, label } options */
  staticOptions?: KiduDropdownOption[];

  // ── Paginated API options ─────────────────────────────────────
  /**
   * Async function that returns paginated options.
   * Receives { pageNumber, pageSize, searchTerm }.
   */
  paginatedFetch?: (params: KiduDropdownPaginatedParams) => Promise<KiduDropdownPaginatedResult>;
  /**
   * Map a raw API row to { value, label }.
   * e.g. (row) => ({ value: row.id, label: row.name })
   */
  mapOption?: (row: any) => KiduDropdownOption;
  /** Page size for paginated fetch (default: 10) */
  pageSize?: number;
}

// ==================== COMPONENT ====================

const KiduDropdown: React.FC<KiduDropdownProps> = ({
  value,
  onChange,
  placeholder = "Select an option...",

  disabled,
  error,
  inputWidth = "100%",
  staticOptions,
  paginatedFetch,
  mapOption,
  pageSize = 10,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<KiduDropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [displayLabel, setDisplayLabel] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Resolve display label from value ──────────────────────────────────────
  useEffect(() => {
    if (value === null || value === undefined || value === "") {
      setDisplayLabel("");
      return;
    }
    // Check already-loaded options first
    const found = options.find((o) => String(o.value) === String(value));
    if (found) {
      setDisplayLabel(found.label);
    } else if (staticOptions) {
      const s = staticOptions.find((o) => String(o.value) === String(value));
      setDisplayLabel(s?.label ?? String(value));
    }
    // For paginated: label will resolve once options load (handled below in fetchPage)
  }, [value, options, staticOptions]);

  // ── Static options ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!staticOptions) return;
    const filtered = staticOptions.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
    setOptions(filtered);
    setHasMore(false);
  }, [staticOptions, search]);

  // ── Paginated fetch ───────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (pg: number, term: string, reset: boolean) => {
      if (!paginatedFetch || !mapOption) return;
      setLoading(true);
      try {
        const result = await paginatedFetch({ pageNumber: pg, pageSize, searchTerm: term });
        const mapped: KiduDropdownOption[] = (result.data ?? []).map(mapOption);
        setOptions((prev) => (reset ? mapped : [...prev, ...mapped]));
        const total = result.total ?? 0;
        setHasMore(pg * pageSize < total);

        // Resolve display label if value is set but label unknown
        if (value !== null && value !== undefined && value !== "") {
          const found = mapped.find((o) => String(o.value) === String(value));
          if (found) setDisplayLabel(found.label);
        }
      } finally {
        setLoading(false);
      }
    },
    [paginatedFetch, mapOption, pageSize, value]
  );

  // Trigger initial load when dropdown opens (paginated mode)
  useEffect(() => {
    if (!open || staticOptions) return;
    setPage(1);
    fetchPage(1, search, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Debounced search for paginated
  useEffect(() => {
    if (!open || staticOptions) return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchPage(1, search, true);
    }, 300);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Infinite scroll ───────────────────────────────────────────────────────
  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      const next = page + 1;
      setPage(next);
      fetchPage(next, search, false);
    }
  };

  // ── Selection ─────────────────────────────────────────────────────────────
  const handleSelect = (opt: KiduDropdownOption) => {
    onChange(opt.value);
    setDisplayLabel(opt.label);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setDisplayLabel("");
    setSearch("");
  };

  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div
      className="kidu-dropdown-wrapper"
      style={{ width: inputWidth }}
      ref={containerRef}
    >
      {/* ── Trigger pill ── */}
      <div
        className={`kidu-dropdown-trigger ${open ? "open" : ""} ${error ? "has-error" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setOpen((p) => !p)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); !disabled && setOpen((p) => !p); }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span className={`kidu-dropdown-value ${!hasValue ? "placeholder" : ""}`}>
          {hasValue ? displayLabel : placeholder}
        </span>
        <span className="kidu-dropdown-icons">
          {hasValue && !disabled && (
            <button
              type="button"
              className="kidu-dropdown-clear"
              onClick={handleClear}
              aria-label="Clear"
              tabIndex={-1}
            >
              ×
            </button>
          )}
          <span className={`kidu-dropdown-arrow ${open ? "up" : ""}`}>▾</span>
        </span>
      </div>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="kidu-dropdown-panel">
          {/* Search */}
          <div className="kidu-dropdown-search-wrap">
            <input
              ref={searchRef}
              className="kidu-dropdown-search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* List */}
          <div
            className="kidu-dropdown-list"
            ref={listRef}
            onScroll={handleScroll}
            role="listbox"
          >
            {options.length === 0 && !loading && (
              <div className="kidu-dropdown-empty">No options found</div>
            )}
            {options.map((opt) => (
              <div
                key={String(opt.value)}
                className={`kidu-dropdown-item ${String(opt.value) === String(value) ? "selected" : ""}`}
                role="option"
                aria-selected={String(opt.value) === String(value)}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
                {String(opt.value) === String(value) && (
                  <span className="kidu-dropdown-check">✓</span>
                )}
              </div>
            ))}
            {loading && (
              <div className="kidu-dropdown-loading">
                <span className="spinner-border spinner-border-sm me-2" />
                Loading...
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Error message ── */}
      {error && <div className="kidu-error-message">{error}</div>}
    </div>
  );
};

export default KiduDropdown;