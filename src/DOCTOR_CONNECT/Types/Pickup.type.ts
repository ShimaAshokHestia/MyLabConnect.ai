// src/DOCTOR_CONNECT/Types/Pickup.type.ts

// ─── Paginated request params ─────────────────────────────────────────────────

export interface CasePickupPaginatedRequest {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  labName?: string;
  pickUpDate?: string;
  trackingNum?: string;
}

// ─── One case detail row inside a pickup ─────────────────────────────────────

export interface CasePickUpDetailItem {
  id: number;
  casePickUpId: number;
  caseRegistrationMasterId: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  patientName?: string;   // READ-ONLY
  caseNo?: string;        // READ-ONLY
}

// ─── List item (returned by GetAll and GetPaged) ──────────────────────────────

export interface CasePickup {
  id?: number;
  labMasterId?: number;
  labMasterName?: string;
  pickUpDate?: string;
  pickUpEarliestTime?: string;
  pickUpLateTime?: string;
  pickUpAddress?: string;
  trackingNum?: string;
  caseCount?: number;
  cases?: CasePickUpDetailItem[];             // ✅ backend paginated field
  casePickUpDetails?: CasePickUpDetailItem[]; // ✅ backend getById field
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Detail record returned by GET /:id ──────────────────────────────────────

export interface CasePickupDetail {
  id: number;
  pickUpDate: string;
  pickUpEarliestTime: string;
  pickUpLateTime: string;
  pickUpAddress: string;
  trackingNum: string;
  labMasterId: number;
  labMasterName?: string;
  isActive: boolean;
  isDeleted: boolean;
  casePickUpDetails: CasePickUpDetailItem[];
  caseRegistrationMasterIds?: (string | number)[];
  caseLabels?: string[];
  pickUpAddressId?: number; // not returned by backend — always undefined
}

// ─── Create payload ───────────────────────────────────────────────────────────

export interface CasePickupCreatePayload {
  id: number;
  pickUpDate: string;
  pickUpEarliestTime: string;
  pickUpLateTime: string;
  pickUpAddress: string;
  trackingNum: string;
  labMasterId: number;
  isActive: boolean;
  isDeleted: boolean;
  casePickUpDetails: Array<{
    id: number;
    casePickUpId: number;
    caseRegistrationMasterId: number;
    isActive: boolean;
    isDeleted: boolean;
  }>;
}

// ─── Update payload — must match full CasePickUpCreateUpdateDTO ───────────────

export interface CasePickupUpdatePayload {
  id: number;
  pickUpDate: string;
  pickUpEarliestTime: string;
  pickUpLateTime: string;
  pickUpAddress: string;
  trackingNum: string;
  labMasterId: number;
  isActive: boolean;
  isDeleted: boolean;
  casePickUpDetails: Array<{
    id: number;
    casePickUpId: number;
    caseRegistrationMasterId: number;
    isActive: boolean;
    isDeleted: boolean;
  }>;
}