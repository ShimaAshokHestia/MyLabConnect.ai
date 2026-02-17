import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}
const DsoProductGroupCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const navigate = useNavigate();
  const [selectedMaster, setSelectedMaster] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const openMasterPopup = () => {
    navigate("/lookup/dso-master", {
      state: {
        onSelect: (master: any) => {
          setSelectedMaster({
            id: master.id,
            name: master.name
          });
        }
      }
    });
  };

  const fields: Field[] = [
    { name: "code", rules: { type: "text", label: "Code", required: true, maxLength: 20, colWidth: 6 } },
    { name: "name", rules: { type: "text", label: "Name", required: true, maxLength: 100, colWidth: 6 } },
    { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
  ];

 const handleSubmit = async (formData: Record<string, any>) => {
  if (!selectedMaster) throw new Error("Please select DSO Master");

  const payload: DSOProductGroup = {
    code: formData.code,
    name: formData.name,
    dsoMasterId: selectedMaster.id,
    isActive: formData.isActive ?? true,
  };

  await DSOProductGroupService.create(payload);
};

return (
  <KiduCreateModal
    show={show}
    onHide={onHide}
    title="Create Product Group"
    subtitle="Add new DSO Product Group"
    fields={fields}
    onSubmit={handleSubmit}
    successMessage="Product group created successfully"
    onSuccess={onSuccess}
    popupHandlers={{
      dsoMasterId: {
        value: selectedMaster?.name || "",
        onOpen: openMasterPopup,
      },
    }}
  />
);
};

export default DsoProductGroupCreateModal;
