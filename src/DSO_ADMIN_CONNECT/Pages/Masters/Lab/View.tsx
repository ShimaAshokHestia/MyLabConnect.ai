// src/Pages/Masters/Lab/View.tsx

import React, { useState, useEffect } from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import LabMasterService from "../../../Services/Masters/Lab.services";
import LabGroupService from "../../../Services/Masters/Labgroup.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

// ── Authentication type mapping ───────────────────────────────────────────────
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

  // Fetch all lab groups when modal opens
  useEffect(() => {
    const fetchLabGroups = async () => {
      try {
        const result = await LabGroupService.getPaginatedList({
          pageNumber: 1,
          pageSize: 100, // Fetch enough to cover all lab groups
          searchTerm: "",
          sortBy: "",
          sortDescending: false,
        });

        // Create a mapping of id -> name
        const groupMap: Record<number, string> = {};
        result.data.forEach((item: any) => {
          groupMap[item.id] = item.name ?? item.groupName ?? String(item.id);
        });
        setLabGroups(groupMap);
      } catch (error) {
        console.error("Failed to fetch lab groups:", error);
      }
    };

    if (show) {
      fetchLabGroups();
    }
  }, [show]);

  // Custom fetch handler to transform the data
  const handleFetch = async (id: string | number) => {
    const response = await LabMasterService.getById(Number(id));

    if (!response || !response.isSucess) {
      throw new Error(response?.customMessage || "Failed to load data");
    }

    const data = response.value;

    // Transform the data to show names instead of IDs
    const transformedData = {
      ...data,
      // Map authenticationType ID to label
      authenticationType: data.authenticationType
        ? AUTHENTICATION_TYPE_MAP[data.authenticationType] || String(data.authenticationType)
        : "N/A",
      // Map labGroupId to lab group name
      labGroupId: data.labGroupId && labGroups[data.labGroupId]
        ? labGroups[data.labGroupId]
        : data.labGroupId ? String(data.labGroupId) : "N/A",
      // Format dates if needed
      createdAt: data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A",
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "Never",
    };

    return { isSucess: true, value: transformedData };
  };

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