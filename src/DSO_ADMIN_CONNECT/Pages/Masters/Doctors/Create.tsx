import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import type { DSODoctor } from "../../../Types/Masters/DsoDoctor.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp"; // ← exact same import as zone

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "firstName", rules: { type: "text", label: "First Name", required: true, minLength: 3, maxLength: 50, colWidth: 6 } },
  { name: "lastName", rules: { type: "text", label: "Last Name", required: true, minLength: 3, maxLength: 50, colWidth: 6 } },
  { name: "doctorCode", rules: { type: "text", label: "Doctor Code", required: true, minLength: 3, maxLength: 20, colWidth: 6 } },
  { name: "licenseNo", rules: { type: "text", label: "License No", required: true, minLength: 3, maxLength: 30, colWidth: 6 } },
  { name: "email", rules: { type: "email", label: "Email", required: true, maxLength: 100, colWidth: 6 } },
  { name: "phoneNumber", rules: { type: "text", label: "Phone Number", required: true, minLength: 7, maxLength: 20, colWidth: 6 } },
  { name: "address", rules: { type: "textarea", label: "Address", required: true, minLength: 10, maxLength: 200, colWidth: 12 } },
  { name: "info", rules: { type: "textarea", label: "Specialty/Info", required: false, minLength: 10, maxLength: 500, colWidth: 12 } },
  { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSODoctorCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
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

  // extraValues carries the actual ID merged at submit time
  const extraValues = {
    dsoMasterId: selectedMaster?.id ?? null,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSODoctor> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      doctorCode: formData.doctorCode,
      licenseNo: formData.licenseNo,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      info: formData.info,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive: formData.isActive ?? true,
    };

    await DSODoctorService.create(payload);
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
        title="Create Doctor"
        subtitle="Add a new DSO Doctor"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Doctor created successfully!"
        onSuccess={onSuccess}
      />

      {/* Same DSOmasterSelectPopup as zone — gives the clean pill UI (Image 1) */}
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

export default DSODoctorCreateModal;