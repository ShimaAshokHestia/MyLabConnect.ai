import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../KIDU_COMPONENTS/KiduEditModal";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import DSORestorationTypeService from "../../Services/Restoration/Restoration.services";
import type { DSORestoration } from "../../Types/Restoration/Restoration.types";
import DSOProsthesisTypePopup from "../Prosthesis/ProsthesisTypePopup";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "name",               rules: { type: "text",   label: "Restoration Name", required: true, maxLength: 100, colWidth: 12 } },
  { name: "dsoProthesisTypeId", rules: { type: "popup",  label: "Prosthesis Type",  required: true,                 colWidth: 6 } },
  { name: "isActive",           rules: { type: "toggle", label: "Active",                                           colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSORestorationTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedProsthesis, setSelectedProsthesis] = useState<DSOProsthesisType | null>(null);
  const [prosthesisOpen, setProsthesisOpen] = useState(false);

  useEffect(() => {
    if (!show) setSelectedProsthesis(null);
  }, [show]);

  // ── Fetch handler — pre-fills the popup pill ──────────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DSORestorationTypeService.getById(Number(id));

    const data = response?.value ?? response?.data ?? response;

    if (data?.dsoProthesisTypeId && data?.dsoProthesisname) {
      setSelectedProsthesis({
        id:   data.dsoProthesisTypeId,
        name: data.dsoProthesisname,
      } as DSOProsthesisType);
    }

    return response;
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<DSORestoration> = {
      id:                 Number(id),
      name:               formData.name,
      dsoProthesisTypeId: Number(formData.dsoProthesisTypeId),
      isActive:           formData.isActive ?? true,
    };

    await DSORestorationTypeService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers = {
    dsoProthesisTypeId: {
      value:       selectedProsthesis?.name ?? "",
      actualValue: selectedProsthesis?.id,
      onOpen:      () => setProsthesisOpen(true),
      onClear:     () => setSelectedProsthesis(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Restoration Type"
        subtitle="Update DSO Restoration Type details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Restoration Type updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Restoration Type"
      />

      <DSOProsthesisTypePopup
        show={prosthesisOpen}
        onClose={() => setProsthesisOpen(false)}
        onSelect={(prosthesis) => {
          setSelectedProsthesis(prosthesis);
          setProsthesisOpen(false);
        }}
      />
    </>
  );
};

export default DSORestorationTypeEditModal;