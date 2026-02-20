import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// The "dsoMasterId" field uses type "popup" — KiduCreateModal renders it as a
// KiduSelectInputPill automatically; no custom JSX needed here.
//
const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Zone Name", required: true, maxLength: 100, colWidth: 12 },
  },
  {
    name: "dsoMasterId",
    rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 },
  },
  {
    name: "isActive",
    rules: { type: "toggle", label: "Active", colWidth: 6 },
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOZoneCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  // Track the selected master object so we can display its name in the pill
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

  // ── Popup handlers wired into KiduCreateModal ─────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoMasterId: {
      value: selectedMaster?.name ?? "",
      onOpen: () => setMasterOpen(true),
      onClear: () => setSelectedMaster(null),
    },
  };

  // extraValues carries the actual IDs that will be merged at submit time
  const extraValues = {
    dsoMasterId: selectedMaster?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    // formData already includes dsoMasterId from extraValues (merged by KiduCreateModal)
    const payload: Partial<DSOZone> = {
      name: formData.name,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive: formData.isActive ?? true,
    };
    await DSOZoneService.create(payload);
  };

  // ── Reset local state when the modal closes ───────────────────────────────
  const handleHide = () => {
    setSelectedMaster(null);
    onHide();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Zone"
        subtitle="Add a new DSO Zone"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Zone created successfully!"
        onSuccess={onSuccess}
      />

      {/* DSO Master picker — rendered outside KiduCreateModal to avoid z-index issues */}
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

export default DSOZoneCreateModal;