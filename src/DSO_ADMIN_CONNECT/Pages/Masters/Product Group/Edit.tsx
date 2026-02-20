import React, { useEffect, useState } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import type { DSOmaster } from '../../../../ADMIN/Types/Master/Master.types';
import MasterPopup from "../../../../ADMIN/Pages/Master/MasterPopup";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

const fields: Field[] = [
  { name: "code",        rules: { type: "text",   label: "Code",       required: true, maxLength: 20,  colWidth: 6 } },
  { name: "name",        rules: { type: "text",   label: "Name",       required: true, maxLength: 100, colWidth: 6 } },
  { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true,                 colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle", label: "Active",                                     colWidth: 6 } },
];

const DsoProductGroupEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);

   useEffect(() => {
      if (!show) {
        setSelectedMaster(null);
      }
    }, [show]);
  
  const handleFetch = async (id: string | number) => {
    return await DSOProductGroupService.getById(Number(id));
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
   if (!selectedMaster) {
      throw new Error("Please select a DSO Master");
    }

    const payload: Partial<DSOProductGroup> = {
      id:          Number(id),
      code:        formData.code,
      name:        formData.name,
      dsoMasterId: selectedMaster.id,
      isActive:    formData.isActive ?? true,
    };
    await DSOProductGroupService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };
 const popupHandlers = {
    dsoMasterId: {
      value: selectedMaster?.name || "",
      actualValue: selectedMaster?.id,
      onOpen: () => setShowMasterPopup(true)
    }
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Product Group"
        subtitle="Update DSO Product Group details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        successMessage="Product group updated successfully!"
        onSuccess={onSuccess}
        popupHandlers={popupHandlers}
      />
       <MasterPopup
        show={showMasterPopup}
        handleClose={() => setShowMasterPopup(false)}
        onSelect={(master) => {
          setSelectedMaster(master);
          setShowMasterPopup(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DsoProductGroupEditModal;
