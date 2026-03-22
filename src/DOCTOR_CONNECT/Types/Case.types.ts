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
//  Create DTO — matches the Swagger API contract exactly
//
//  Fields added vs previous version (were missing, causing them to be dropped
//  from the serialised payload even though buildPayload set them):
//    caseNo, shipTo, caseNotes  — top-level string fields
//    isRemake, isRush           — boolean flags for remake / rush orders
//    dsoSchemaId                — FK to DSO schema (omit or send null for default)
//    dSODoctorId                — was dSODoctorId? (optional) → now required-ish
//
//  Child collection shapes updated to match Swagger:
//    CaseProductDetailCreateUpdateDTO   — dsoProductId, labProductId
//    CaseDocumentCreateUpdateDTO        — attachmentId, isChat, isCaseDocument, …
//    CaseAdditionalServiceCreateUpdateDTO — dsoAdditionalServiceId, serviceNotes
//    CasePickUpCreateUpdateDTO          — pickUpDate, pickUpEarliestTime, …
// ─────────────────────────────────────────────────────────────────────────────
export interface CaseRegistrationCreateDTO {
  // ── Header ──────────────────────────────────────────────────────────────
  caseNo?:             string;
  shipTo?:             string;
  patientFirstName:    string;
  patientLastName?:    string;
  patientId?:          string;
  caseStatusMasterId?: number;
  dueDate?:            string;
  caseNotes?:          string;

  // ── Foreign keys ────────────────────────────────────────────────────────
  dSOMasterId?:        number;
  dsoDentalOfficeId?:  number;   // camelCase — matches .NET serialisation
  dsoDoctorId?:        number;   // camelCase — matches .NET serialisation
  dsoSchemaId?:        number | null;
  labMasterId:         number;

  // ── Flags ───────────────────────────────────────────────────────────────
  isActive?:           boolean;
  isRemake?:           boolean;  // ← was missing — remake order flag
  isRush?:             boolean;  // ← was missing — rush order flag

  // ── Child collections ────────────────────────────────────────────────────
  products?:           CaseProductDetailCreateUpdateDTO[];
  documents?:          CaseDocumentCreateUpdateDTO[];
  additionalServices?: CaseAdditionalServiceCreateUpdateDTO[];
  pickUps?:            CasePickUpCreateUpdateDTO[];

  // Allow extra fields the API may require without breaking TS compilation
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
//  Child entity DTOs — shapes match the Swagger request body exactly
// ─────────────────────────────────────────────────────────────────────────────

export interface CaseProductDetailCreateUpdateDTO {
  id?:                       number;
  dsoProductId?:             number;   // ← Swagger field
  labProductId?:             number;   // ← Swagger field
  isActive?:                 boolean;
  isDeleted?:                boolean;
  createdAt?:                string;
  updatedAt?:                string;
  // legacy / extra fields kept for backward compat
  caseRegistrationMasterId?: number;
  productMasterId?:          number;
  quantity?:                 number;
  unitPrice?:                number;
  remarks?:                  string;
  [key: string]: any;
}

export interface CaseDocumentCreateUpdateDTO {
  id?:                       number;
  attachmentId?:             number;   // ← Swagger field
  isChat?:                   boolean;  // ← Swagger field
  isCaseDocument?:           boolean;  // ← Swagger field
  isQueryDocument?:          boolean;  // ← Swagger field
  isActive?:                 boolean;
  isDeleted?:                boolean;
  caseRegistrationMasterId?: number;
  // legacy fields
  documentName?:             string;
  documentUrl?:              string;
  documentType?:             string;
  [key: string]: any;
}

export interface CaseAdditionalServiceCreateUpdateDTO {
  id?:                       number;
  dsoAdditionalServiceId?:   number;   // ← Swagger field
  caseRegistrationMasterId?: number;
  serviceNotes?:             string;   // ← Swagger field (was "serviceName")
  isActive?:                 boolean;
  isDeleted?:                boolean;
  // legacy fields
  serviceId?:                number;
  serviceName?:              string;
  amount?:                   number;
  [key: string]: any;
}

export interface CasePickUpDetailDTO {
  id?:                       number;
  createdAt?:                string;
  updatedAt?:                string;
  isDeleted?:                boolean;
  isActive?:                 boolean;
  casePickUpId?:             number;
  caseRegistrationMasterId?: number;
  patientName?:              string;
}

export interface CasePickUpCreateUpdateDTO {
  id?:                       number;
  pickUpDate?:               string;          // ← Swagger field
  pickUpEarliestTime?:       string;          // ← Swagger field
  pickUpLateTime?:           string;          // ← Swagger field
  pickUpAddress?:            string;          // ← Swagger field
  trackingNum?:              string;          // ← Swagger field
  labMasterId?:              number;
  isActive?:                 boolean;
  isDeleted?:                boolean;
  casePickUpDetails?:        CasePickUpDetailDTO[];  // ← Swagger nested array
  // legacy fields
  caseRegistrationMasterId?: number;
  pickupDate?:               string;
  pickupAddress?:            string;
  driverName?:               string;
  status?:                   string;
  [key: string]: any;
}