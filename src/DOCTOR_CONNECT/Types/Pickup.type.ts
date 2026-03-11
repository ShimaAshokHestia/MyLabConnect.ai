// src/Types/CasePickup/CasePickup.types.ts

export interface CasePickup {
  // Core Fields
  id?: number;
  labMasterId?: number;
  labMasterName?: string;
  pickUpDate?: string;
  pickUpEarliestTime?: string;
  pickUpLateTime?: string;
  pickUpAddress?: string;           // display label
  pickUpAddressId?: number;
  practiceName?: string;
  practiceEmail?: string;
  practiceMobile?: string;
  caseRegistrationMasterIds?: number[];
  caseLabels?: string[];            // display labels aligned with ids
  trackingNum?: string;

  // Status Fields
  isActive?: boolean;
  isDeleted?: boolean;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;

  // Pagination / Filtering
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
}

/** Shape returned by GET /CasePickUp/:id — may include nested address info */
export interface CasePickupDetail extends CasePickup {
  addressLine?: string;
  email?: string;
  mobileNo?: string;
  cases?: { id: number | string; label: string }[];
}

/** Payload sent to POST /CasePickUp */
export interface CasePickupCreatePayload {
  labMasterId: number;
  pickUpDate: string;
  pickUpEarliestTime: string;
  pickUpLateTime: string;
  pickUpAddress: string | number;
  caseRegistrationMasterIds: (string | number)[];
  trackingNum?: string;
}

/** Payload sent to PUT /CasePickUp/:id */
export interface CasePickupUpdatePayload {
  id: number;
  caseRegistrationMasterIds: (string | number)[];
  trackingNum: string;
}