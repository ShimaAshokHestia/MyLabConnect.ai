import React, { useState, useEffect } from "react";
import KiduTabbedFormModal, { 
  type TabbedFormField, 
  type TabConfig 
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormModal";
import type { LabSupportType } from "../../../Types/Masters/SupportTypes.types";
import LabSupportTypeService from "../../../Services/Masters/SupportTypes.services";
import LabSupportSubTypeService from "../../../Services/Masters/SupportSubTypes.services";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: number;
}

const LabSupportTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [loading, setLoading] = useState(false);
  const [initialHeaderData, setInitialHeaderData] = useState<Record<string, any>>({});
  const [initialTabData, setInitialTabData] = useState<Record<string, Record<string, any>[]>>({});

  // ── Header Fields ───────────────────────────────────────────────────────
  const headerFields: TabbedFormField[] = [
    {
      name: "labMasterId",
      label: "Lab",
      type: "select",
      required: true,
      placeholder: "Choose a lab...",
      options: [
        { value: 1, label: "Lab 1" },
        { value: 2, label: "Lab 2" },
      ],
      colWidth: 4,
    },
    {
      name: "labSupportTypeName",
      label: "Support Type",
      type: "text",
      required: true,
      placeholder: "Enter support type",
      colWidth: 4,
    },
    {
      name: "escalationDays",
      label: "Escalation in Days",
      type: "number",
      required: false,
      placeholder: "Enter escalation in days",
      colWidth: 4,
    },
  ];

  // ── Sub Types Tab Configuration ─────────────────────────────────────────
  const tabs: TabConfig[] = [
    {
      key: "subTypes",
      label: "Sub Types",
      columns: [
        {
          key: "labSupportSubTypeName",
          label: "Sub Type",
          type: "text",
          required: true,
          placeholder: "Enter Sub Type",
        },
        {
          key: "rolesResponsible",
          label: "Roles Responsible",
          type: "text",
          required: false,
          placeholder: "Roles responsible",
        },
        {
          key: "rolesToNotify",
          label: "Roles to Notify",
          type: "text",
          required: false,
          placeholder: "Roles to notify",
        },
        {
          key: "escalation",
          label: "Escalation",
          type: "text",
          required: false,
          placeholder: "Escalation",
        },
      ],
    },
  ];

  // ── Fetch existing data when modal opens ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if (!show || !recordId) return;

      setLoading(true);
      try {
        // 1. Fetch main Support Type
        const mainResponse = await LabSupportTypeService.getById(recordId);
        const mainData = mainResponse?.value || mainResponse;

        setInitialHeaderData({
          labMasterId: mainData.labMasterId,
          labSupportTypeName: mainData.labSupportTypeName,
          escalationDays: mainData.escalationDays,
        });

        // 2. Fetch Sub Types for this Support Type
        // You need to add this method to your service
        const subTypesResponse = await LabSupportSubTypeService.getBySupportTypeId(recordId);
        const subTypes = subTypesResponse?.value || subTypesResponse || [];

        setInitialTabData({
          subTypes: subTypes.length > 0 ? subTypes : [{}],
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (show && recordId) {
      fetchData();
    }
  }, [show, recordId]);

  // ── Submit Handler ───────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    try {
      const { headerData, tabData } = data;

      // 1. Update main Support Type
      const updatePayload: Partial<LabSupportType> = {
        id: recordId,
        labSupportTypeName: headerData.labSupportTypeName,
        escalationDays: headerData.escalationDays ? Number(headerData.escalationDays) : 0,
        labMasterId: Number(headerData.labMasterId),
        isActive: true,
      };

      await LabSupportTypeService.update(recordId, updatePayload);

      // 2. Handle Sub Types
      const subTypes = tabData.subTypes || [];
      const validSubTypes = subTypes.filter(
        (row) => row.labSupportSubTypeName && row.labSupportSubTypeName.trim() !== ""
      );

      // You need to implement sync logic based on your API requirements
      // Option 1: Delete all and recreate
      if (validSubTypes.length > 0) {
        // First delete existing sub types (you need to add this method)
        await LabSupportSubTypeService.deleteBySupportTypeId(recordId);
        
        // Then create new ones
        await Promise.all(
          validSubTypes.map(async (subType) => {
            const subTypePayload = {
              labSupportSubTypeName: subType.labSupportSubTypeName,
              labSupportTypeId: recordId,
              isActive: true,
            };
            return LabSupportSubTypeService.create(subTypePayload);
          })
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Error updating Lab Support Type:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <KiduTabbedFormModal
      show={show}
      onHide={onHide}
      title="Edit Support Type"
      headerFields={headerFields}
      tabs={tabs}
      onSubmit={handleSubmit}
      submitButtonText="Update"
      themeColor="#ef0d50"
    />
  );
};

export default LabSupportTypeEditModal;