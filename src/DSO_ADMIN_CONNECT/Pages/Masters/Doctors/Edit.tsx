import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import type { DSODoctor } from "../../../Types/Masters/DsoDoctor.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";

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
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSODoctorEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
  const [masterOpen, setMasterOpen] = useState(false);

  // Reset selection when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedMaster(null);
    }
  }, [show]);

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DSODoctorService.getById(Number(id));
    return response;
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<DSODoctor> = {
      id: Number(id),
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      doctorCode: formData.doctorCode,
      licenseNo: formData.licenseNo,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      info: formData.info,
      // KiduEditModal merges actualValue into submitData for popup fields
      dsoMasterId: Number(formData.dsoMasterId),
      isActive: formData.isActive ?? true,
    };

    await DSODoctorService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  // ── Popup handlers ────────────────────────────────────────────────────────
  // actualValue → the ID submitted at update time (merged by KiduEditModal)
  // value       → the display name shown in the pill
  // onClear     → required by KiduSelectInputPill interface
  const popupHandlers = {
    dsoMasterId: {
      value: selectedMaster?.name ?? "",
      actualValue: selectedMaster?.id,
      onOpen: () => setMasterOpen(true),
      onClear: () => setSelectedMaster(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={onHide}
        title="Edit Doctor"
        subtitle="Update DSO Doctor details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Doctor updated successfully!"
        onSuccess={onSuccess}
        submitButtonText="Update Doctor"
      />

      {/* Same DSOmasterSelectPopup as create page — clean pill UI */}
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

export default DSODoctorEditModal;