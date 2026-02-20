import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import type { DSODoctor } from "../../../Types/Masters/DsoDoctor.types";
import type { DSOmaster } from '../../../../ADMIN/Types/Master/Master.types';
import MasterPopup from "../../../../ADMIN/Pages/Master/MasterPopup";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
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
  { name: "dsoMasterId", rules: { type: "popup",    label: "DSO Master",     required: true,  colWidth: 6 } },
  { name: "isActive",    rules: { type: "toggle",   label: "Active",         colWidth: 6 } },
];

const DSODoctorEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [showMasterPopup, setShowMasterPopup] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);

  // Reset selection when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedMaster(null);
    }
  }, [show]);

  const handleFetch = async (id: string | number) => {
    const response = await DSODoctorService.getById(Number(id));
    const doctor = response?.value || response?.data || response;
    
    // Fetch related master data if needed
    if (doctor?.dsoMasterId) {
      try {
        // You might need to fetch the master details here
        // This depends on your API structure
      } catch (error) {
        console.error("Error fetching master:", error);
      }
    }
    
    return response;
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    if (!selectedMaster) {
      throw new Error("Please select a DSO Master");
    }

    const payload: Partial<DSODoctor> = {
      id:          Number(id),
      firstName:   formData.firstName,
      lastName:    formData.lastName,
      fullName:    `${formData.firstName} ${formData.lastName}`.trim(),
      doctorCode:  formData.doctorCode,
      licenseNo:   formData.licenseNo,
      email:       formData.email,
      phoneNumber: formData.phoneNumber,
      address:     formData.address,
      info:        formData.info,
      dsoMasterId: selectedMaster.id,
      isActive:    formData.isActive ?? true,
    };

    await DSODoctorService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  const popupHandlers = {
    dsoMasterId: {
      value: selectedMaster?.name || "",
      actualValue: selectedMaster?.id,
      onOpen: () => setShowMasterPopup(true)
    }
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
        successMessage="Doctor updated successfully!"
        onSuccess={onSuccess}
        popupHandlers={popupHandlers}
        submitButtonText="Update Doctor"
      />
      
      <MasterPopup
        show={showMasterPopup}
        handleClose={() => setShowMasterPopup(false)}
        onSelect={(master) => {
          setSelectedMaster(master);
          setShowMasterPopup(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DSODoctorEditModal;