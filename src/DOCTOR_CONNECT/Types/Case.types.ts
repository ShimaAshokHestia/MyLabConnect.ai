// src/DOCTOR_CONNECT/Types/Case.types.ts
//
// Add / extend fields as the API evolves.
// All optional (?) so existing callers never break.

// ─────────────────────────────────────────────────────────────────────────────
//  Core DTO — returned by GET_PAGINATED and GET_BY_ID
// ─────────────────────────────────────────────────────────────────────────────
export interface CaseRegistrationDTO {
  id:                  number;
  caseNo?:             string;
  patientFirstName?:   string;
  patientLastName?:    string;
  patientId?:          string;
  caseType?:           string;
  caseStatusMasterId:  number;
  dueDate?:            string;
  createdAt?:          string;

  // ── Doctor ──────────────────────────────────────────────────────────────
  dSODoctorId?:        number;
  doctorName?:         string;

  // ── Lab ─────────────────────────────────────────────────────────────────
  labMasterId?:        number;
  LabMasterId?:        number;   // PascalCase variant some endpoints return
  labMasterID?:        number;   // camelCase variant
  labName?:            string;

  // ── Practice / Dental Office ─────────────────────────────────────────────
  // Use whichever field your API actually returns to show practice on the card.
  practiceName?:        string;
  dentalOfficeName?:    string;
  officeName?:          string;
  dSODentalOfficeName?: string;
  practiceNameStr?:     string;
  dSODentalOfficeId?:   number;

  // ── DSO ──────────────────────────────────────────────────────────────────
  dSOMasterId?:         number;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Detail DTO — returned by GET_BY_ID (includes nested collections)
// ─────────────────────────────────────────────────────────────────────────────
export interface CaseRegistrationDetailDTO extends CaseRegistrationDTO {
  caseProductDetails?:           CaseProductDetailCreateUpdateDTO[];
  caseDocuments?:                CaseDocumentCreateUpdateDTO[];
  caseAdditionalServices?:       CaseAdditionalServiceCreateUpdateDTO[];
  casePickUps?:                  CasePickUpCreateUpdateDTO[];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Create / Update DTOs
// ─────────────────────────────────────────────────────────────────────────────
export interface CaseRegistrationCreateDTO {
  patientFirstName:    string;
  patientLastName?:    string;
  patientId?:          string;
  dSODoctorId:         number;
  labMasterId:         number;
  dSODentalOfficeId?:  number;
  dSOMasterId?:        number;
  dueDate?:            string;
  caseStatusMasterId?: number;
  caseType?:           string;
  [key: string]: any;
}

export interface CaseRegistrationUpdateDTO extends Partial<CaseRegistrationCreateDTO> {
  id?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Status Change
// ─────────────────────────────────────────────────────────────────────────────
export interface CaseStatusChangeDTO {
  caseRegistrationMasterId: number;
  caseStatusMasterId:       number;
  remarks?:                 string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Child entity DTOs
// ─────────────────────────────────────────────────────────────────────────────
export interface CaseProductDetailCreateUpdateDTO {
  id?:                      number;
  caseRegistrationMasterId?: number;
  productMasterId?:         number;
  quantity?:                number;
  unitPrice?:               number;
  remarks?:                 string;
  [key: string]: any;
}

export interface CaseDocumentCreateUpdateDTO {
  id?:                      number;
  caseRegistrationMasterId?: number;
  documentName?:            string;
  documentUrl?:             string;
  documentType?:            string;
  [key: string]: any;
}

export interface CaseAdditionalServiceCreateUpdateDTO {
  id?:                      number;
  caseRegistrationMasterId?: number;
  serviceId?:               number;
  serviceName?:             string;
  amount?:                  number;
  [key: string]: any;
}

export interface CasePickUpCreateUpdateDTO {
  id?:                      number;
  caseRegistrationMasterId?: number;
  pickupDate?:              string;
  pickupAddress?:           string;
  driverName?:              string;
  status?:                  string;
  [key: string]: any;
}