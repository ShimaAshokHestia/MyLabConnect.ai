import React from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import type { DSODoctor } from "../../../Types/Masters/DsoDoctor.types";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "firstName",   rules: { type: "text",     label: "First Name",     required: true,  maxLength: 50,  colWidth: 6 } },
  { name: "lastName",    rules: { type: "text",     label: "Last Name",      required: true,  maxLength: 50,  colWidth: 6 } },
  { name: "doctorCode",  rules: { type: "text",     label: "Doctor Code",    required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "licenseNo",   rules: { type: "text",     label: "License No",     required: true,  maxLength: 30,  colWidth: 6 } },
  { name: "email",       rules: { type: "email",    label: "Email",          required: true,  maxLength: 100, colWidth: 6 } },
  { name: "phoneNumber", rules: { type: "text",     label: "Phone Number",   required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "address",     rules: { type: "textarea", label: "Address",        required: true,  maxLength: 200, colWidth: 12 } },
  { name: "info",        rules: { type: "textarea", label: "Specialty/Info", required: false, maxLength: 500, colWidth: 12 } },
  { name: "dsoMasterId", rules: { type: "number",   label: "DSO Master ID",  required: true,                 colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle",   label: "Active",                                         colWidth: 6 } },
];

const DSODoctorCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<DSODoctor> = {
      firstName:   formData.firstName,
      lastName:    formData.lastName,
      fullName:    `${formData.firstName} ${formData.lastName}`,
      doctorCode:  formData.doctorCode,
      licenseNo:   formData.licenseNo,
      email:       formData.email,
      phoneNumber: formData.phoneNumber,
      address:     formData.address,
      info:        formData.info,
      dsoMasterId: Number(formData.dsoMasterId),
      isActive:    formData.isActive ?? true,
    };

    await DSODoctorService.create(payload);
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Doctor"
      subtitle="Add new DSO Doctor"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Doctor created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSODoctorCreateModal;
