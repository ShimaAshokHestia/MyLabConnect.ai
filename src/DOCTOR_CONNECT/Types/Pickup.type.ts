// src/DOCTOR_CONNECT/Types/Pickup.type.ts

// ─── Paginated request params (for POST /getall-paginated) ───────────────────

export interface CasePickupPaginatedRequest {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  // Column-level filters
  labName?: string;
  pickUpDate?: string;
  trackingNum?: string;
}

// ─── List item (returned by paginated GET) ────────────────────────────────────

export interface CasePickup {
  id?: number;
  labMasterId?: number;
  labMasterName?: string;
  pickUpDate?: string;
  pickUpEarliestTime?: string;
  pickUpLateTime?: string;
  pickUpAddress?: string;
  pickUpAddressId?: number;
  trackingNum?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Detail record (returned by GET /:id) ────────────────────────────────────

export interface CasePickupDetail extends CasePickup {
  caseNo?: string;
  // Practice / address info (if embedded by API)
  practiceName?: string;
  practiceEmail?: string;
  practiceMobile?: string;
  addressLine?: string;
  email?: string;
  mobileNo?: string;
  // Related cases
  caseRegistrationMasterIds?: (string | number)[];
  caseLabels?: string[];
  cases?: { id: number | string; label: string }[];
  // Nested detail rows
  casePickUpDetails?: CasePickUpDetailItem[];
}

// ─── One case entry inside a pickup (nested) ─────────────────────────────────

export interface CasePickUpDetailItem {
  id: number;
  casePickUpId: number;
  caseRegistrationMasterId?: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Create payload — matches CasePickUpCreateUpdateDTO ──────────────────────

export interface CasePickupCreatePayload {
  id: number;                         // 0 for new
  pickUpDate: string;
  pickUpEarliestTime: string;
  pickUpLateTime: string;
  pickUpAddress: string;
  trackingNum: string;
  labMasterId: number;
  isActive: boolean;
  isDeleted: boolean;
  casePickUpDetails: CasePickUpDetailItem[];
}

// ─── Update payload ───────────────────────────────────────────────────────────

export interface CasePickupUpdatePayload {
  id: number;
  caseRegistrationMasterIds: (string | number)[];
  trackingNum: string;
}