import React, { useEffect, useState } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSOProductGroupService from "../../../Services/Masters/DsoProductGroup.services";
import type { DSOProductGroup } from "../../../Types/Masters/DsoProductGroup.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "code",        rules: { type: "text",   label: "Code",       required: true, maxLength: 20,  colWidth: 6 } },
  { name: "name",        rules: { type: "text",   label: "Name",       required: true, maxLength: 100, colWidth: 6 } },
  { name: "dsoMasterId", rules: { type: "popup",  label: "DSO Master", required: true,                 colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle", label: "Active",                                     colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DsoProductGroupEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

  useEffect(() => {
    if (!show) {
      setSelectedMaster(null);
    }
  }, [show]);

  // ── Fetch handler — also pre-fills the popup pill ─────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DSOProductGroupService.getById(Number(id));

    // Extract the record from whatever response shape the API returns
    const data = response?.value ?? response?.data ?? response;

    // Pre-populate the master pill so it shows the current value
    if (data?.dsoMasterId && data?.dsoName) {
      setSelectedMaster({ id: data.dsoMasterId, name: data.dsoName } as DSOmaster);
    }

    return response;
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<DSOProductGroup> = {
      id:          Number(id),
      code:        formData.code,
      name:        formData.name,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive:    formData.isActive ?? true,
    };

    await DSOProductGroupService.update(Number(id), payload);
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
        title="Edit Product Group"
        subtitle="Update DSO Product Group details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Product group updated successfully!"
        onSuccess={onSuccess}
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

export default DsoProductGroupEditModal;