import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../KIDU_COMPONENTS/KiduEditModal";
import DSOProsthesisTypeService from "../../Services/Prosthesis/Prosthesis.services";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import type { DSOmaster } from "../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../ADMIN/Pages/Master/PopUp";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "name",        rules: { type: "text",   label: "Prosthesis Type Name", required: true, maxLength: 100, colWidth: 12 } },
  { name: "dsoMasterId", rules: { type: "popup",  label: "DSO Master",           required: true,                 colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle", label: "Active",                                               colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOProsthesisTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

  useEffect(() => {
    if (!show) setSelectedMaster(null);
  }, [show]);

  // ── Fetch handler — pre-fills the popup pill ──────────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DSOProsthesisTypeService.getById(Number(id));

    const data = response?.value ?? response?.data ?? response;

    if (data?.dsoMasterId && data?.dsoName) {
      setSelectedMaster({ id: data.dsoMasterId, name: data.dsoName } as DSOmaster);
    }

    return response;
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<DSOProsthesisType> = {
      id:          Number(id),
      name:        formData.name,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive:    formData.isActive ?? true,
    };

    await DSOProsthesisTypeService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers = {
    dsoMasterId: {
      value:       selectedMaster?.name ?? "",
      actualValue: selectedMaster?.id,
      onOpen:      () => setMasterOpen(true),
      onClear:     () => setSelectedMaster(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Prosthesis Type"
        subtitle="Update DSO Prosthesis Type details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Prosthesis Type updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Prosthesis Type"
      />

      <DSOmasterSelectPopup
        show={masterOpen}
        onClose={() => setMasterOpen(false)}
        onSelect={(master) => {
          setSelectedMaster(master);
          setMasterOpen(false);
        }}
      />
    </>
  );
};

export default DSOProsthesisTypeEditModal;