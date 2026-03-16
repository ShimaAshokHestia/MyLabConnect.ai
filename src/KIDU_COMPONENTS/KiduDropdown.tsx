import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
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
  /** Name for reset ref registration */
  name?: string;
  /** Ref for reset functionality */
  resetRef?: React.MutableRefObject<{ [key: string]: () => void }> | null;

  // ── Static options (mutually exclusive with paginatedFetch) ──
  /** Static list of { value, label } options */
  staticOptions?: KiduDropdownOption[];

  // ── Paginated API options ─────────────────────────────────────
  paginatedFetch?: (params: KiduDropdownPaginatedParams) => Promise<KiduDropdownPaginatedResult>;
  mapOption?: (row: any) => KiduDropdownOption;
  pageSize?: number;
}

export interface KiduDropdownHandle {
  reset: () => void;
}

// ==================== COMPONENT ====================

const KiduDropdown = forwardRef<KiduDropdownHandle, KiduDropdownProps>(({
  value: externalValue,
  onChange,
  placeholder = "Select an option...",
  disabled,
  error,
  inputWidth = "100%",
  name,
  resetRef,
  staticOptions,
  paginatedFetch,
  mapOption,
  pageSize = 10,
}, ref) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<KiduDropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [displayLabel, setDisplayLabel] = useState<string>("");
  const [internalValue, setInternalValue] = useState<string | number | null | undefined>(externalValue);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use external value if provided, otherwise use internal
  const value = externalValue !== undefined ? externalValue : internalValue;

  // ── Reset function ────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setInternalValue(null);
    setDisplayLabel("");
    setSearch("");
    setOpen(false);
    onChange(null);
  }, [onChange]);

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

  // ── Resolve display label from value ──────────────────────────────────────
  useEffect(() => {
    if (value === null || value === undefined || value === "") {
      setDisplayLabel("");
      return;
    }
    const found = options.find((o) => String(o.value) === String(value));
    if (found) {
      setDisplayLabel(found.label);
    } else if (staticOptions) {
      const s = staticOptions.find((o) => String(o.value) === String(value));
      setDisplayLabel(s?.label ?? String(value));
    }
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

  useEffect(() => {
    if (!open || staticOptions) return;
    setPage(1);
    fetchPage(1, search, true);
  }, [open, staticOptions, fetchPage, search]);

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
  }, [search, open, staticOptions, fetchPage]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

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

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      const next = page + 1;
      setPage(next);
      fetchPage(next, search, false);
    }
  };

  const handleSelect = (opt: KiduDropdownOption) => {
    setInternalValue(opt.value);
    setDisplayLabel(opt.label);
    setOpen(false);
    setSearch("");
    onChange(opt.value);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalValue(null);
    setDisplayLabel("");
    setSearch("");
    onChange(null);
  };

  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div
      className="kidu-dropdown-wrapper"
      style={{ width: inputWidth }}
      ref={containerRef}
    >
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
        <span
          className={`kidu-dropdown-value ${!hasValue ? "placeholder" : ""}`}
          style={{ background: "transparent" }}
        >
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

      {open && (
        <div className="kidu-dropdown-panel">
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

      {error && <div className="kidu-error-message">{error}</div>}
    </div>
  );
});

KiduDropdown.displayName = 'KiduDropdown';

export default KiduDropdown;