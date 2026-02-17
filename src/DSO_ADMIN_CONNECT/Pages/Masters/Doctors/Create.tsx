import React from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSODoctor } from "../../../Types/Masters/DsoDoctor.types";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const DSODoctorCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  // ── Fields ────────────────────────────────────────────────────
  const fields: Field[] = [
    // Personal Information
    { name: "firstName",   rules: { type: "text",   label: "First Name",    required: true, maxLength: 50,  colWidth: 6 } },
    { name: "lastName",    rules: { type: "text",   label: "Last Name",     required: true, maxLength: 50,  colWidth: 6 } },
    { name: "doctorCode",  rules: { type: "text",   label: "Doctor Code",   required: true, maxLength: 20,  colWidth: 6 } },
    { name: "licenseNo",   rules: { type: "text",   label: "License No",    required: true, maxLength: 30,  colWidth: 6 } },
    
    // Contact Information
    { name: "email",       rules: { type: "email",  label: "Email",         required: true, maxLength: 100, colWidth: 6 } },
    { name: "phoneNumber", rules: { type: "text",   label: "Phone Number",  required: true, maxLength: 20,  colWidth: 6 } },
    { name: "address",     rules: { type: "text",   label: "Address",       required: true, maxLength: 200, colWidth: 12 } },
    
    // Professional Information
    { name: "info",        rules: { type: "text",   label: "Specialty/Info",required: false, maxLength: 500, colWidth: 12 } },
    { name: "dsoMasterId", rules: { type: "number", label: "DSO Master ID", required: true,                 colWidth: 6 } },
    { name: "isActive",    rules: { type: "toggle", label: "Active",                                       colWidth: 6 } },
  ];

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("formData:", formData);
    
    const payload: Partial<DSODoctor> = {
      firstName:    formData.firstName,
      lastName:     formData.lastName,
      fullName:     `${formData.firstName} ${formData.lastName}`,
      doctorCode:   formData.doctorCode,
      licenseNo:    formData.licenseNo,
      email:        formData.email,
      phoneNumber:  formData.phoneNumber,
      address:      formData.address,
      info:         formData.info,
      dsoMasterId:  Number(formData.dsoMasterId),
      isActive:     formData.isActive ?? true,
    };

    console.log("payload:", payload);
    
    await DSODoctorService.create(payload);
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Doctor"
      subtitle="Add new DSO Doctor"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Doctor created successfully"
      onSuccess={onSuccess}
    />
  );
};

export default DSODoctorCreateModal;