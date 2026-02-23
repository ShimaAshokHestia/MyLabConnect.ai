import React from "react";
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
}

const LabSupportTypeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

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
        // This should come from an API/master data
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

  // ── Submit Handler ───────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    try {
      const { headerData, tabData } = data;

      // 1. Create Lab Support Type first
      const supportTypePayload: Partial<LabSupportType> = {
        labSupportTypeName: headerData.labSupportTypeName,
        escalationDays: headerData.escalationDays ? Number(headerData.escalationDays) : undefined,
        labMasterId: Number(headerData.labMasterId),
        isActive: true, // From the toggle in modal
      };

      const createResponse = await LabSupportTypeService.create(supportTypePayload);
      
      // Get the newly created ID from response
      const newSupportTypeId = createResponse?.value?.id || createResponse?.id;

      // 2. Create Sub Types if any exist
      const subTypes = tabData.subTypes || [];
      if (subTypes.length > 0 && newSupportTypeId) {
        // Filter out empty rows
        const validSubTypes = subTypes.filter(
          (row) => row.labSupportSubTypeName && row.labSupportSubTypeName.trim() !== ""
        );

        // Create each sub type
        await Promise.all(
          validSubTypes.map(async (subType) => {
            const subTypePayload = {
              labSupportSubTypeName: subType.labSupportSubTypeName,
              labSupportTypeId: newSupportTypeId,
              isActive: true,
            };
            return LabSupportSubTypeService.create(subTypePayload);
          })
        );
      }

      // Success
      onSuccess();
    } catch (error) {
      console.error("Error creating Lab Support Type:", error);
    }
  };

  return (
    <KiduTabbedFormModal
      show={show}
      onHide={onHide}
      title="Add Support Type"
      headerFields={headerFields}
      tabs={tabs}
      onSubmit={handleSubmit}
      submitButtonText="Save"
      themeColor="#ef0d50"
    />
  );
};

export default LabSupportTypeCreateModal;