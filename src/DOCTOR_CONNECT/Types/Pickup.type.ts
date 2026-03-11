import type { AuditTrails } from "../../Types/Auditlog.types";

export interface CasePickUp {

  // Core Identity Fields
  id?: number;

  // Pickup Details
  pickUpDate?: string;
  pickUpEarliestTime?: string;
  pickUpLateTime?: string;
  pickUpAddress?: string;
  trackingNum?: string;

  // Lab Relationship
  labMasterId?: number;
  labMasterName?: string;

  // Case Registration Relationship
  caseRegistrationMasterId?: number;
  caseRegistrationMasterName?: string;

  // Audit Fields
  createdAt?: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  isActive?: boolean;

  // Pagination / Filtering Fields
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;

  // Optional Audit Trail
  auditlog?: AuditTrails[];
}