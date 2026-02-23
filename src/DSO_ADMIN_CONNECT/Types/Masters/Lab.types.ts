export interface LabMaster {
  id?: number;
  labCode?: string;
  labName?: string;
  displayName?: string;
  email?: string;
  authenticationType?: number;       // 1 = Normal, 2 = SSO, 3 = Basic
  logoforRX?: string;
  lmsSystem?: string;
  labGroupId?: number;
  labGroupName?: string;             // display name resolved from API

  // Audit
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;

  // Pagination / filter params
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
}