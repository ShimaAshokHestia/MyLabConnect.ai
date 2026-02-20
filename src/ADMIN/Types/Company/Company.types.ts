export interface Company {
  // Core Identity
  companyId?:    number;
  comapanyName?: string; // note: typo is from API
  website?:      string;

  // Contact
  contactNumber?: string;
  email?:         string;

  // Tax & Invoice
  taxNumber?:     string;
  invoicePrefix?: string;

  // Address
  addressLine1?: string;
  addressLine2?: string;
  city?:         string;
  state?:        string;
  country?:      string;
  zipCode?:      string;

  // Media
  companyLogo?: string;

  // Status
  isActive?:  boolean;
  isDeleted?: boolean;

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
export interface CompanyLookup {
  id?:         number;
  text?:       string;
  code?:       string;
  isSelected?: boolean;
}
