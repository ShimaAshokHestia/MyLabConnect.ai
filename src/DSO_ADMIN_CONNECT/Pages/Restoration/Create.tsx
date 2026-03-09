import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";
import type { DSORestoration } from "../../Types/Restoration/Restoration.types";
import DSORestorationTypeService from "../../Services/Restoration/Restoration.services";
import DSOProsthesisTypePopup from "../Prosthesis/ProsthesisTypePopup";
import { useApiErrorHandler } from "../../../Services/AuthServices/APIErrorHandler.services";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "name",               rules: { type: "text",   label: "Restoration Name", required: true, minLength: 3, maxLength: 100, colWidth: 12 } },
  { name: "dsoProthesisTypeId", rules: { type: "popup",  label: "Prosthesis Type",  required: true, colWidth: 6 } },
  { name: "isActive",           rules: { type: "toggle", label: "Active",           colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSORestorationTypeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [selectedProsthesis, setSelectedProsthesis] = useState<DSOProsthesisType | null>(null);
  const [prosthesisOpen, setProsthesisOpen]         = useState(false);

  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Popup handlers ────────────────────────────────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoProthesisTypeId: {
      value:   selectedProsthesis?.name ?? "",
      onOpen:  () => setProsthesisOpen(true),
      onClear: () => setSelectedProsthesis(null),
    },
  };

  const extraValues = {
    dsoProthesisTypeId: selectedProsthesis?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSORestoration> = {
      name:               formData.name,
      dsoProthesisTypeId: Number(formData.dsoProthesisTypeId),
      isActive:           formData.isActive ?? true,
    };

    let result: any;
    try {
      result = await DSORestorationTypeService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    await assertApiSuccess(result, "Failed to create Restoration Type.");
  };

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleHide = () => {
    setSelectedProsthesis(null);
    onHide();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Restoration Type"
        subtitle="Add a new DSO Restoration Type"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Restoration Type created successfully!"
        onSuccess={onSuccess}
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

export default DSORestorationTypeCreateModal;