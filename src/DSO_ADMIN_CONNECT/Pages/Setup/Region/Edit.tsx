import React, { useState } from "react";
import KiduEditModal, {
  type Field,
  type PopupHandler,
} from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";
import DSORegionService from "../../../Services/Setup/DSORegion.services";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  {
    name: "name",
    rules: { type: "text", label: "Region Name", required: true, minLength: 3, maxLength: 100, colWidth: 12 },
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
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSORegionEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

  // ── Popup handlers wired into KiduEditModal ───────────────────────────────
  const popupHandlers: Record<string, PopupHandler> = {
    dsoMasterId: {
      value: selectedMaster?.name ?? "",
      actualValue: selectedMaster?.id ?? undefined,
      onOpen: () => setMasterOpen(true),
      onClear: () => setSelectedMaster(null),
    },
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DSORegionService.getById(Number(id));
    // Pre-fill the pill label when the record loads
    if (response?.isSucess && response?.value?.dsoName) {
      setSelectedMaster({
        id: response.value.dsoMasterId,
        name: response.value.dsoName,
      } as DSOmaster);
    }
    return response;
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    return await DSORegionService.update(Number(id), formData);
  };

  // ── Reset local state when modal closes ───────────────────────────────────
  const handleHide = () => {
    setSelectedMaster(null);
    onHide();
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={handleHide}
        title="Edit Region"
        subtitle="Update DSO Region details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Region updated successfully!"
        onSuccess={onSuccess}
      />

      {/* DSO Master picker — sibling to avoid z-index conflicts */}
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

export default DSORegionEditModal;