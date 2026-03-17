import React, { useState, useEffect, useCallback } from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import LabMasterService from "../../../Services/Masters/Lab.services";
import LabGroupService from "../../../Services/Masters/Labgroup.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

const AUTHENTICATION_TYPE_MAP: Record<number, string> = {
  1: "Normal",
  2: "SSO",
  3: "Basic",
};

const fields: ViewField[] = [
  { name: "labCode", label: "Lab Code", colWidth: 6 },
  { name: "labName", label: "Lab Name", colWidth: 6 },
  { name: "displayName", label: "Display Name", colWidth: 6 },
  { name: "email", label: "Email", colWidth: 6 },
  { name: "authenticationType", label: "Authentication Type", colWidth: 6 },
  { name: "labGroupId", label: "Lab Group", colWidth: 6 },
  { name: "logoforRX", label: "Logo for RX", colWidth: 6 },
  { name: "lmsSystem", label: "LMS System", colWidth: 6 },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
  { name: "createdAt", label: "Created At", colWidth: 6, isDate: true },
  { name: "updatedAt", label: "Updated At", colWidth: 6, isDate: true },
];

const LabMasterViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  const [labGroups, setLabGroups] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchLabGroups = async () => {
      if (!show) return;
      
      try {
        const result = await LabGroupService.getPaginatedList({
          pageNumber: 1,
          pageSize: 100,
          searchTerm: "",
          sortBy: "",
          sortDescending: false,
        });

        // Create mapping based on actual response structure
        const groupMap: Record<number, string> = {};
        
        // Handle different possible response structures
        const groups = result?.data || result || [];
        
        if (Array.isArray(groups)) {
          groups.forEach((item: any) => {
            if (item?.id) {
              groupMap[item.id] = item.name || item.groupName || String(item.id);
            }
          });
        }
        
        setLabGroups(groupMap);
      } catch (error) {
        console.error("Failed to fetch lab groups:", error);
      }
    };

    fetchLabGroups();
  }, [show]);

  const handleFetch = useCallback(async (id: string | number) => {
    try {
      const response = await LabMasterService.getById(Number(id));
      console.log("API Response:", response);
      
      // FIXED: Check for isSucess (with one 's') instead of isSuccess
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || "Failed to load data");
      }

      // Get the actual data from the value property
      const data = response.value;
      console.log("Extracted data:", data);
      
      if (!data) {
        throw new Error("No data received");
      }
      
      // Transform the data to show names instead of IDs
      const transformedData = {
        labCode: data.labCode || "N/A",
        labName: data.labName || "N/A",
        displayName: data.displayName || "N/A",
        email: data.email || "N/A",
        authenticationType: data.authenticationType
          ? AUTHENTICATION_TYPE_MAP[data.authenticationType] || String(data.authenticationType)
          : "N/A",
        labGroupId: data.labGroupId && labGroups[data.labGroupId]
          ? labGroups[data.labGroupId]
          : data.labGroupId ? String(data.labGroupId) : "N/A",
        logoforRX: data.logoforRX || "N/A",
        lmsSystem: data.lmsSystem || "N/A",
        isActive: data.isActive ?? true,
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A",
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "Never",
      };
      
      console.log("Transformed Data:", transformedData);
      
      // Return in the format expected by KiduViewModal
      return { 
        isSuccess: true, 
        value: transformedData 
      };
      
    } catch (error) {
      console.error("Error in handleFetch:", error);
      throw error;
    }
  }, [labGroups]);

  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Lab"
      subtitle="Lab Master details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default LabMasterViewModal;