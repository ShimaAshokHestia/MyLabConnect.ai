import React from "react";
import KiduTabbedFormCreateModal, {
  type TabbedFormField,
  type TabConfig,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormCreateModal";
import type { LabSupportType } from "../../../Types/Masters/SupportTypes.types";
import LabSupportTypeService from "../../../Services/Masters/SupportTypes.services";
import LabSupportSubTypeService from "../../../Services/Masters/SupportSubTypes.services";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Lab Master options ────────────────────────────────────────────────────────
const labMasterOptions = [
  { value: 0, label: "Lab 1" },
  { value: 1, label: "Lab 2" },
];

// ── Header Fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  { name: "labMasterId", label: "Lab", type: "select", required: true, placeholder: "Choose a lab...", colWidth: 3, options: labMasterOptions },
  { name: "labSupportTypeName", label: "Support Type", type: "text", required: true, placeholder: "Enter support type", colWidth: 3 },
  { name: "escalationDays", label: "Escalation in Days", type: "number", required: false, placeholder: "Enter escalation in days", colWidth: 3 },
];

// ── Sub Types Tab Configuration ───────────────────────────────────────────────
const tabs: TabConfig[] = [
  {
    key: "subTypes",
    label: "Sub Types",
    columns: [
      { key: "labSupportSubTypeName", label: "Sub Type", type: "text", required: true, placeholder: "Enter Sub Type" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const LabSupportTypeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    try {
      const { headerData, tabData } = data;
      console.log("Submit Data:", { headerData, tabData });

      // 1. Create Lab Support Type
      const supportTypePayload: Partial<LabSupportType> = {
        labSupportTypeName: headerData.labSupportTypeName,
        escalationDays: headerData.escalationDays ? Number(headerData.escalationDays) : 0,
        labMasterId: Number(headerData.labMasterId),
        isActive: headerData.isActive ?? true,
      };

      const createResponse = await LabSupportTypeService.create(supportTypePayload);
      console.log("Create Response:", createResponse);

      const newSupportTypeId = createResponse?.value?.id || createResponse?.id;

      // 2. Create Sub Types
      const validSubTypes = (tabData.subTypes || []).filter(
        (row) => row.labSupportSubTypeName?.trim()
      );

      if (validSubTypes.length > 0 && newSupportTypeId) {
        await Promise.all(
          validSubTypes.map((subType) =>
            LabSupportSubTypeService.create({
              labSupportSubTypeName: subType.labSupportSubTypeName,
              labSupportTypeId: newSupportTypeId,
              isActive: true,
            })
          )
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Error creating Lab Support Type:", error);
    }
  };

  return (
    <KiduTabbedFormCreateModal
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
