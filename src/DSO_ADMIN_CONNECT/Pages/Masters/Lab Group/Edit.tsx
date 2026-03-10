import React from "react";
import KiduEditModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduEditModal";
import LabGroupService from "../../../Services/Masters/Labgroup.services";

const fields: Field[] = [
  { name: "code", rules: { type: "text", label: "Code", required: true,minLength:3, maxLength: 50, colWidth: 6 }, },
  { name: "name", rules: { type: "text", label: "Lab Group Name", required: true,minLength:3, maxLength: 100, colWidth: 6 }, },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 }, },
];

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: string | number;
}

const LabGroupEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const handleFetch = async (id: string | number) => {
    return await LabGroupService.getById(Number(id));
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    return await LabGroupService.update(Number(id), formData);
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Lab Group"
      subtitle="Update Lab Group details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Lab group updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default LabGroupEditModal;