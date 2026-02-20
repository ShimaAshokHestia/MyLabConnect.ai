import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "fullName",    label: "Full Name",      colWidth: 6 },
  { name: "doctorCode",  label: "Doctor Code",    colWidth: 6 },
  { name: "licenseNo",   label: "License No",     colWidth: 6 },
  { name: "firstName",   label: "First Name",     colWidth: 6 },
  { name: "lastName",    label: "Last Name",      colWidth: 6 },
  { name: "email",       label: "Email",          colWidth: 6 },
  { name: "phoneNumber", label: "Phone Number",   colWidth: 6 },
  { name: "dsoName",     label: "DSO Master",     colWidth: 6 },
  { name: "address",     label: "Address",        colWidth: 12, isTextarea: true },
  { name: "info",        label: "Specialty/Info", colWidth: 12, isTextarea: true },
  { name: "isActive",    label: "Status",         colWidth: 6,  isToggle: true },
  { name: "createdAt",   label: "Created At",     colWidth: 6,  isDate: true },
  { name: "updatedAt",   label: "Updated At",     colWidth: 6,  isDate: true },
];

const DSODoctorViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Doctor"
      subtitle="DSO Doctor details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSODoctorService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSODoctorViewModal;
