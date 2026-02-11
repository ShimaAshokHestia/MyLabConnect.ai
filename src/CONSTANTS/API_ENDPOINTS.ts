// src/constants/apiEndpoints.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
    LOGOUT: `${API_BASE_URL}/Auth/logout`,
    CHANGE_PASSWORD: `${API_BASE_URL}/Auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/Auth/forgot-password`,
    REGISTER:`${API_BASE_URL}/Auth/register`
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
    UPDATE:(id:number)=>`${API_BASE_URL}/Attachment/${id}`
  },
 

  //------------------------PUBLIC MODULE----------------------------------------
 

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
  // This ensures images work regardless of which port the frontend is running on
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


//-------------------------STAFF MODULE------------------------------

// // ✅ Helper function to get full image URL
// export const getFullImageUrl = (imagePath: string | null | undefined): string => {
//   console.log('getFullImageUrl called with:', imagePath);
  
//   if (!imagePath) {
//     console.log('No image path provided');
//     return '';
//   }

//   // If already a complete URL, return as is
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     console.log('Already a full URL:', imagePath);
//     return imagePath;
//   }

//   // If it's a placeholder URL pattern
//   if (imagePath.includes('placeholder')) {
//     console.log('Placeholder URL detected:', imagePath);
//     return imagePath;
//   }

//   // Get base URL without /api suffix
//   const baseUrl = API_BASE_URL.replace('/api', '');
//   console.log('Base URL (without /api):', baseUrl);

//   // Ensure proper path construction - remove leading slash from imagePath if present
//   const cleanPath = imagePath.replace(/^\/+/, '');
//   const fullUrl = `${baseUrl}/${cleanPath}`;
  
//   console.log('Final full URL:', fullUrl);
//   return fullUrl;
// };

// // ✅ Get base website URL (without /api)
// export const getBaseWebsiteUrl = (): string => {
//   const baseUrl = API_BASE_URL.replace('/api', '');
//   return baseUrl;
// };












