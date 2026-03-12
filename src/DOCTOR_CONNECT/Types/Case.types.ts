// src/DOCTOR_CONNECT/Types/Case.types.ts

export interface CaseProductDetailCreateUpdateDTO {
  id?: number;
  dSOProductId?: number | null;
  labProductId?: number | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface CaseDocumentCreateUpdateDTO {
  id?: number;
  attachmentId: number;
  isChat: boolean;
  isCaseDocument: boolean;
  isQueryDocument: boolean;
  isActive: boolean;
  isDeleted: boolean;
}

export interface CaseAdditionalServiceCreateUpdateDTO {
  id?: number;
  dSOAdditionalServiceId: number;
  serviceNotes: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface CasePickUpCreateUpdateDTO {
  id?: number;
  pickUpDate: string;
  pickUpEarliestTime: string;
  pickUpLateTime: string;
  pickUpAddress: string;
  trackingNum: string;
  labMasterId: number;
  isActive: boolean;
  isDeleted: boolean;
}

// ── Flat list DTO — field names match backend JSON exactly ────────────────────
export interface CaseRegistrationDTO {
  id: number;
  caseNo: string;
  shipTo: string;
  patientFirstName: string;
  patientLastName: string;
  patientId: string;
  caseStatusMasterId: number;
  caseStatusName: string;
  dueDate?: string;
  caseNotes: string;

  dSOMasterId: number;
  dSOName: string;

  dSODentalOfficeId: number;
  officeName: string;

  dSODoctorId: number;
  doctorName: string;    // ← backend returns "doctorName" (NOT "dSODoctorName")

  labMasterId: number;
  labName: string;       // ← backend returns "labName"

  dSOSchemaId?: number;

  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CaseRegistrationDetailDTO extends CaseRegistrationDTO {
  products: CaseProductDetailDTO[];
  documents: CaseDocumentDTO[];
  additionalServices: CaseAdditionalServiceDTO[];
  pickUps: CasePickUpDTO[];
  statusHistory: CaseStatusHistoryDTO[];
}

export interface CaseProductDetailDTO {
  id?: number;
  dSOProductId?: number | null;
  labProductId?: number | null;
  caseRegistrationMasterId?: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface CaseDocumentDTO {
  id?: number;
  caseRegistrationMasterId?: number;
  attachmentId?: number;
  isChat?: boolean;
  isCaseDocument?: boolean;
  isQueryDocument?: boolean;
  isDeleted?: boolean;
  fileName?: string;
  fileUrl?: string;
}

export interface CaseAdditionalServiceDTO {
  id?: number;
  dSOAdditionalServiceId?: number;
  serviceName?: string;
  serviceNotes?: string;
  caseRegistrationMasterId?: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface CasePickUpDTO {
  id?: number;
  pickUpDate?: string;
  pickUpEarliestTime?: string;
  pickUpLateTime?: string;
  pickUpAddress?: string;
  trackingNum?: string;
  labMasterId?: number;
  caseRegistrationMasterId?: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface CaseStatusHistoryDTO {
  id?: number;
  fromStatus?: number;
  toStatus?: number;
  fromStatusName?: string;
  toStatusName?: string;
  remark?: string;
  caseRegistrationMasterId?: number;
  createdAt?: string;
}

export interface CaseRegistrationCreateDTO {
  caseNo?: string;
  shipTo: string;
  patientFirstName: string;
  patientLastName: string;
  patientId: string;
  caseStatusMasterId: number;
  dueDate?: string;
  caseNotes: string;
  dSOMasterId: number;
  dSOSchemaId: number;
  dSODentalOfficeId: number;
  dSODoctorId: number;
  labMasterId: number;
  isActive: boolean;
  products: CaseProductDetailCreateUpdateDTO[];
  documents: CaseDocumentCreateUpdateDTO[];
  additionalServices: CaseAdditionalServiceCreateUpdateDTO[];
  pickUps: CasePickUpCreateUpdateDTO[];
}

export interface CaseRegistrationUpdateDTO extends CaseRegistrationCreateDTO {
  id: number;
  isDeleted: boolean;
}

export interface CaseStatusChangeDTO {
  caseRegistrationMasterId: number;
  newStatusId: number;
  remark?: string;
}