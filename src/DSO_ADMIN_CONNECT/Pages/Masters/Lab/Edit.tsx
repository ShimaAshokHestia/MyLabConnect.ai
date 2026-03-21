// src/Pages/Masters/Lab/Edit.tsx

import React, {  useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import LabGroupService from "../../../Services/Masters/Labgroup.services";
import LabMasterService from "../../../Services/Masters/Lab.services";
import type { LabMaster } from "../../../Types/Masters/Lab.types";
import type { DropdownHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

// ── Authentication type static options ────────────────────────────────────────
const AUTHENTICATION_TYPE_OPTIONS = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO" },
  { value: 3, label: "Basic" },
];

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  { 
    name: "labCode", 
    rules: { 
      type: "text", 
      label: "Lab Code", 
      required: true, 
      minLength: 3, 
      maxLength: 10, 
      colWidth: 6,
      disabled: true
    } 
  },
  { 
    name: "labName", 
    rules: { 
      type: "text", 
      label: "Lab Name", 
      required: true, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "displayName", 
    rules: { 
      type: "text", 
      label: "Display Name", 
      required: false, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "email", 
    rules: { 
      type: "email", 
      label: "Email", 
      required: false, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
   { 
    name: "phone", 
    rules: { 
      type: "number", 
      label: "Phone", 
      required: false, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "address", 
    rules: { 
      type: "text", 
      label: "Address", 
      required: false, 
      minLength: 3, 
      maxLength: 200, 
      colWidth: 6 
    } 
  },
  { 
    name: "labGroupId", 
    rules: { 
      type: "smartdropdown", 
      label: "Lab Group", 
      required: true, 
      colWidth: 6 
    } 
  },
  { 
    name: "authenticationType", 
    rules: { 
      type: "smartdropdown", 
      label: "Authentication Type", 
      required: true, 
      colWidth: 6 
    } 
  },
  { 
    name: "logoforRX", 
    rules: { 
      type: "text", 
      label: "Logo for RX", 
      required: false, 
      minLength: 3, 
      maxLength: 200, 
      colWidth: 6 
    } 
  },
  { 
    name: "lmsSystem", 
    rules: { 
      type: "text", 
      label: "LMS System", 
      required: false, 
      minLength: 3, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "isActive", 
    rules: { 
      type: "toggle", 
      label: "Active", 
      colWidth: 6 
    } 
  },
  
   { 
    name: "triosId", 
    rules: { 
      type: "number", 
      label: "Trios Id", 
      required: false, 
      minLength: 1, 
      maxLength: 100, 
      colWidth: 6 
    } 
  },
  { 
    name: "triosLabCode", 
    rules: { 
      type: "text", 
      label: "Trios Lab code", 
      required: false, 
      minLength: 3, 
      maxLength: 200, 
      colWidth: 6 
    } 
  },
];

// ── Dropdown handlers ─────────────────────────────────────────────────────────
const dropdownHandlers: DropdownHandlers = {
  labGroupId: {
    paginatedFetch: async (params) => {
      console.log("Fetching lab groups with params:", params);
      const result = await LabGroupService.getPaginatedList({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        searchTerm: params.searchTerm,
        sortBy: "",
        sortDescending: false,
      });
      console.log("Lab groups fetched:", result);
      return { data: result.data, total: result.total };
    },
    mapOption: (row) => ({ 
      value: row.id, 
      label: row.name ?? row.groupName ?? String(row.id) 
    }),
    pageSize: 10,
    placeholder: "Select Lab Group...",
  },

  authenticationType: {
    staticOptions: AUTHENTICATION_TYPE_OPTIONS,
    placeholder: "Select Authentication Type...",
  },
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const LabMasterEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();
  
  // State to store the fetched lab group name for debugging
  //const [labGroupName, setLabGroupName] = useState<string>("");

  // ── Fetch the lab group name separately if needed ────────────────────────
  const fetchLabGroupName = async (groupId: number) => {
    try {
      // You might need to fetch the specific lab group to get its name
      // This depends on your API - you might have a getById endpoint
      console.log("Fetching lab group name for ID:", groupId);
      // If you have a getById endpoint:
      // const response = await LabGroupService.getById(groupId);
      // if (response?.isSucess) {
      //   setLabGroupName(response.value.name);
      // }
    } catch (error) {
      console.error("Error fetching lab group name:", error);
    }
  };

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    console.log("========== EDIT MODAL FETCH START ==========");
    console.log("Fetching lab with ID:", id);
    
    try {
      const response = await LabMasterService.getById(Number(id));
      console.log("Raw API Response:", response);
      
      if (response?.isSucess && response.value) {
        const data = response.value;
        console.log("Fetched lab data:", data);
        console.log("labGroupId from API:", data.labGroupId);
        console.log("authenticationType from API:", data.authenticationType);
        
        // Fetch the lab group name if needed
        if (data.labGroupId) {
          await fetchLabGroupName(data.labGroupId);
        }
        
        // IMPORTANT: Return the data in the format KiduEditModal expects
        // The modal will use this to populate formData and dropdownValues
        return {
          isSucess: true,
          value: {
            ...data,
            // Ensure these are explicitly set
            labGroupId: data.labGroupId,
            authenticationType: data.authenticationType,
          }
        };
      }
      
      console.log("========== EDIT MODAL FETCH END ==========");
      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  // Log when modal opens/closes
  useEffect(() => {
    if (show) {
      console.log("Edit modal opened for record ID:", recordId);
    }
  }, [show, recordId]);

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    console.log("========== EDIT MODAL UPDATE START ==========");
    console.log("Update formData received from modal:", formData);
    console.log("labGroupId in formData:", formData.labGroupId);
    console.log("authenticationType in formData:", formData.authenticationType);
    
    // 1. Get DSOMasterId from token
    let dsoMasterId: number;
    try {
      dsoMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload
    const payload: Partial<LabMaster> = {
      id: Number(id),
      labCode: formData.labCode,
      labName: formData.labName,
      displayName: formData.displayName || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      labGroupId: formData.labGroupId ? Number(formData.labGroupId) : undefined,
      authenticationType: formData.authenticationType ? Number(formData.authenticationType) : 1,
      logoforRX: formData.logoforRX || undefined,
      lmsSystem: formData.lmsSystem || undefined,
      isActive: formData.isActive ?? true,
      triosId: formData.triosId || undefined,
      triosLabCode: formData.triosLabCode || undefined,
      dsoLabMappings: [
        {
          dsoMasterId: dsoMasterId,
          isActive: true,
          isDeleted: false,
        },
      ],
    };

    console.log("Update payload being sent to API:", payload);

    // 3. Call API
    let result: any;
    try {
      result = await LabMasterService.update(Number(id), payload);
      console.log("API Update result:", result);
    } catch (err) {
      console.error("Update error:", err);
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update Lab Master.");
    
    console.log("========== EDIT MODAL UPDATE END ==========");
    return result;
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Lab"
      subtitle="Update Lab Master details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      dropdownHandlers={dropdownHandlers}
      successMessage="Lab updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Lab"
    />
  );
};

export default LabMasterEditModal;