import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  // Personal Information
  { name: "fullName",     label: "Full Name",      colWidth: 6 },
  { name: "doctorCode",   label: "Doctor Code",    colWidth: 6 },
  { name: "licenseNo",    label: "License No",     colWidth: 6 },
  { name: "firstName",    label: "First Name",     colWidth: 6 },
  { name: "lastName",     label: "Last Name",      colWidth: 6 },
  
  // Contact Information
  { name: "email",        label: "Email",          colWidth: 6 },
  { name: "phoneNumber",  label: "Phone Number",   colWidth: 6 },
  { name: "address",      label: "Address",        colWidth: 12 },
  
  // Professional Information
  { name: "info",         label: "Specialty/Info", colWidth: 12 },
  { name: "dsoName",      label: "DSO Master",     colWidth: 6 },
  { name: "dsoMasterId",  label: "DSO Master ID",  colWidth: 6 },
  
  // Status and Audit
  { name: "isActive",     label: "Status",         colWidth: 6, isToggle: true },
  { name: "createdAt",    label: "Created At",     colWidth: 6, isDate: true },
  { name: "updatedAt",    label: "Updated At",     colWidth: 6, isDate: true },
];

const DSODoctorViewModal: React.FC<Props> = ({
  show,
  onHide,
  recordId,
}) => {

  const handleFetch = async (id: string | number) => {
    const response = await DSODoctorService.getById(Number(id));
    return response;
  };

  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Doctor"
      subtitle="DSO Doctor details"
      size="lg"
      centered={true}
      recordId={recordId}
      fields={fields}
      onFetch={handleFetch}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSODoctorViewModal;