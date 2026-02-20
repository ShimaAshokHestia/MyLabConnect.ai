// src/constants/apiEndpoints.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://sreenathganga-001-site10.jtempurl.com/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
    LOGOUT: `${API_BASE_URL}/Auth/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/Auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/Auth/forgot-password`,
    REGISTER: `${API_BASE_URL}/Auth/register`
  },
  AUDIT_LOG: {
    GET_BY_TABLE_AND_ID: (tableName: string, recordId: number) =>
      `${API_BASE_URL}/AuditLog/${tableName}/${recordId}`
  },
  ATTACHMENT: {
    GET_BY_TABLE_AND_ID: (tableName: string, recordId: number) =>
      `${API_BASE_URL}/Attachment/${tableName}/${recordId}`,
    GET_BY_ID: (attachmentId: number) => `${API_BASE_URL}/Attachment/${attachmentId}`,
    UPLOAD: `${API_BASE_URL}/Attachment/upload`,
    DELETE: (attachmentId: number) => `${API_BASE_URL}/Attachment/${attachmentId}`,
    //GET: `${API_BASE_URL}/Attachment`,
    DOWNLOAD: (attachmentId: number) => `${API_BASE_URL}/Attachment/download/${attachmentId}`,
    UPDATE: (id: number) => `${API_BASE_URL}/Attachment/${id}`
  },
  //-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------ADMIN-------//
  COMPANY: {
    GET_ALL: `${API_BASE_URL}/Company/GetAll/admin-getall-company`,
    GET_LOOKUP: `${API_BASE_URL}/Company/GetCompanyLookup/admin-lookup-company`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Company/GetById/${id}`,
    CREATE: `${API_BASE_URL}/Company/Create`,
    UPDATE: (id: number) => `${API_BASE_URL}/Company/Update/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Company/Delete/${id}`,
  },
  DSO_MASTER: {
    GET_ALL: `${API_BASE_URL}/DSOMaster`,
    CREATE: `${API_BASE_URL}/DSOMaster`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOMaster/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOMaster/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOMaster/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOMaster/getall-paginated`,
  },
  FINANCIAL_YEAR: {
    GET_ALL: `${API_BASE_URL}/FinancialYear/GetAll`,
    GET_LOOKUP: `${API_BASE_URL}/FinancialYear/GetCategoryLookUp/admin-lookup-financialyear`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/FinancialYear/GetById/${id}`,
    CREATE: `${API_BASE_URL}/FinancialYear/Create`,
    UPDATE: (id: number) => `${API_BASE_URL}/FinancialYear/Update/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/FinancialYear/Delete/${id}`,
  },
  USER: {
    GET_ALL: `${API_BASE_URL}/User`,
    CREATE: `${API_BASE_URL}/User`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/User/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/User/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/User/${id}`,
    CHANGE_PASSWORD: (id: number) => `${API_BASE_URL}/User/ChangePassword/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/User/getall-paginated`
  },
  USER_TYPE: {
    GET_ALL: `${API_BASE_URL}/UserType`,
    CREATE: `${API_BASE_URL}/UserType`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/UserType/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/UserType/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/UserType/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/UserType/getall-paginated`,
  },
  //-------DSO-ADMIN-------DSO-ADMIN-------DSO-ADMIN-------DSO-ADMIN-------DSO-ADMIN-------DSO-ADMIN-------DSO-ADMIN-------DSO-ADMIN-------DSO-ADMIN-------//
  DSO_DOCTOR: {
    GET_ALL: `${API_BASE_URL}/DSODoctor`,
    CREATE: `${API_BASE_URL}/DSODoctor`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSODoctor/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSODoctor/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSODoctor/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSODoctor/getall-paginated`,
  },
  DSO_ZONE: {
    GET_ALL: `${API_BASE_URL}/DSOZone`,
    CREATE: `${API_BASE_URL}/DSOZone`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOZone/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOZone/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOZone/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOZone/getall-paginated`,
  },
  DSO_PRODUCT_GROUP: {
    GET_ALL: `${API_BASE_URL}/DSOProductGroup`,
    CREATE: `${API_BASE_URL}/DSOProductGroup`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOProductGroup/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOProductGroup/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOProductGroup/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOProductGroup/getall-paginated`,
  },




  COMMENT: {
    //GET_ALL:`${API_BASE_URL}/Comment/${tableName}/${recordId}`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Comment/${id}`,
    //DELETE:(id:number)=>`${API_BASE_URL}/Comment/${CommentId}`,
    CREATE: `${API_BASE_URL}/Comment/AddComment`,
  },
  CUSTOMER: {
    GET_ALL: `${API_BASE_URL}/Customer`,
    CREATE: `${API_BASE_URL}/Customer`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Customer/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/Customer/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Customer/${id}`,
  },
  DSO_DENTAL_OFFICE: {
    GET_ALL: `${API_BASE_URL}/DSODentalOffice`,
    CREATE: `${API_BASE_URL}/DSODentalOffice`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSODentalOffice/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSODentalOffice/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSODentalOffice/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSODentalOffice/getall-paginated`,
  },

  DSO_DOCTOR_DENTAL_OFFICE: {
    GET_ALL: `${API_BASE_URL}/DSODoctorDentalOffice`,
    CREATE: `${API_BASE_URL}/DSODoctorDentalOffice`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSODoctorDentalOffice/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSODoctorDentalOffice/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSODoctorDentalOffice/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSODoctorDentalOffice/getall-paginated`,
  },
  DSO_INDICATION: {
    GET_ALL: `${API_BASE_URL}/DSOIndication`,
    CREATE: `${API_BASE_URL}/DSOIndication`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOIndication/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOIndication/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOIndication/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOIndication/getall-paginated`
  },
  DSO_MATERIAL: {
    GET_ALL: `${API_BASE_URL}/DSOMaterial`,
    CREATE: `${API_BASE_URL}/DSOMaterial`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOMaterial/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOMaterial/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOMaterial/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOMaterial/getall-paginated`,
  },
  DSO_PRODUCT: {
    GET_ALL: `${API_BASE_URL}/DSOProduct`,
    CREATE: `${API_BASE_URL}/DSOProduct`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOProduct/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOProduct/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOProduct/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOProduct/getall-paginated`,
  },
  DSO_PROTHESIS_TYPE: {
    GET_ALL: `${API_BASE_URL}/DSOProthesisType`,
    CREATE: `${API_BASE_URL}/DSOProthesisType`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOProthesisType/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOProthesisType/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOProthesisType/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOProthesisType/getall-paginated`,
  },
  DSO_REGION: {
    GET_ALL: `${API_BASE_URL}/DSORegion`,
    CREATE: `${API_BASE_URL}/DSORegion`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSORegion/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSORegion/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSORegion/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSORegion/getall-paginated`,
  },
  DSO_RESTORATION_TYPE: {
    GET_ALL: `${API_BASE_URL}/DSORestorationType`,
    CREATE: `${API_BASE_URL}/DSORestorationType`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSORestorationType/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSORestorationType/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSORestorationType/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSORestorationType/getall-paginated`,
  },
  DSO_SCHEMA: {
    GET_ALL: `${API_BASE_URL}/DSOSchema`,
    CREATE: `${API_BASE_URL}/DSOSchema`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOSchema/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOSchema/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOSchema/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOSchema/getall-paginated`,
  },
  DSO_SETTING: {
    GET_ALL: `${API_BASE_URL}/DSOSetting`,
    CREATE: `${API_BASE_URL}/DSOSetting`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOSetting/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOSetting/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOSetting/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOSetting/getall-paginated`,
  },
  DSO_TERRITORY: {
    GET_ALL: `${API_BASE_URL}/DSOTerritory`,
    CREATE: `${API_BASE_URL}/DSOTerritory`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOTerritory/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOTerritory/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOTerritory/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOTerritory/getall-paginated`,
  },
  DSO_USER: {
    GET_ALL: `${API_BASE_URL}/DSOUser`,
    CREATE: `${API_BASE_URL}/DSOUser`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/DSOUser/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/DSOUser/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/DSOUser/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/DSOUser/getall-paginated`,
  },
  LAB_GROUP: {
    GET_ALL: `${API_BASE_URL}/LabGroup`,
    CREATE: `${API_BASE_URL}/LabGroup`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/LabGroup/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/LabGroup/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/LabGroup/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/LabGroup/getall-paginated`,
  },
  LAB_MASTER: {
    GET_ALL: `${API_BASE_URL}/LabMaster`,
    CREATE: `${API_BASE_URL}/LabMaster`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/LabMaster/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/LabMaster/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/LabMaster/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/LabMaster/getall-paginated`,
  },
  LAB_SETTING: {
    GET_ALL: `${API_BASE_URL}/LabSetting`,
    CREATE: `${API_BASE_URL}/LabSetting`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/LabSetting/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/LabSetting/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/LabSetting/${id}`,
    UPDATE_PAGINATION: `${API_BASE_URL}/LabSetting/getall-paginated`,
  },



};


// ✅ Helper function to get full image URL - FIXED VERSION
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  console.log('getFullImageUrl called with:', imagePath);

  if (!imagePath) {
    console.log('No image path provided');
    return '';
  }

  // If already a complete URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('Already a full URL:', imagePath);
    return imagePath;
  }

  // If it's a blob URL (from file upload preview), return as is
  if (imagePath.startsWith('blob:')) {
    console.log('Blob URL detected:', imagePath);
    return imagePath;
  }

  // If it's a placeholder URL pattern or local asset
  if (imagePath.includes('placeholder') || imagePath.includes('/assets/') || imagePath.includes('/Assets/')) {
    console.log('Placeholder or asset URL detected:', imagePath);
    return imagePath;
  }

  // ✅ FIXED: Always use the backend server URL directly
  const backendUrl = 'http://sreenathganga-001-site16.jtempurl.com';
  console.log('Backend URL:', backendUrl);

  // Ensure proper path construction - remove leading slash from imagePath if present
  const cleanPath = imagePath.replace(/^\/+/, '');
  const fullUrl = `${backendUrl}/${cleanPath}`;

  console.log('Final full URL:', fullUrl);
  return fullUrl;
};

// ✅ Get base website URL (without /api)
export const getBaseWebsiteUrl = (): string => {
  const baseUrl = API_BASE_URL.replace('/api', '');
  return baseUrl;
};













