export interface FinancialYear {
  // Core Identity
  financialYearId?:  number;
  finacialYearCode?: string; // note: typo is from API

  // Date Range
  startDate?: string;
  endDate?:   string;

  // Status
  isCurrent?: boolean;
  isClosed?:  boolean;

  // Pagination / Filtering
  pageNumber?:     number;
  pageSize?:       number;
  searchTerm?:     string;
  sortBy?:         string;
  sortDescending?: boolean;
  showDeleted?:    boolean;
  showInactive?:   boolean;
}

// Dropdown shape returned by lookup endpoints
export interface FinancialYearLookup {
  id?:         number;
  text?:       string;
  code?:       string;
  isSelected?: boolean;
}
