// src/Types/DSODoctor.types.ts

/**
 * DSO Doctor interface
 * Represents a doctor associated with a DSO Master
 */
export interface DSODoctor {
  id: number;
  code: string;
  name: string;
  dsoMasterId: number;
  dsoName: string;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  isActive: boolean;
}

/**
 * Request parameters for paginated DSO Doctor API
 */
export interface DSODoctorPaginatedRequest {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  showDeleted?: boolean;
  showInactive?: boolean;
  
  // Specific filters
  code?: string;
  name?: string;
  dsoMasterId?: number;
  dsoName?: string;
}

/**
 * Response from paginated DSO Doctor API
 */
export interface DSODoctorPaginatedResponse {
  data: DSODoctor[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}