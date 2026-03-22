// src/Pages/Masters/DentalOffice/View.tsx

import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "officeCode", label: "Office Code", colWidth: 6 },
  { name: "officeName", label: "Office Name", colWidth: 6 },
  { name: "postCode", label: "Post Code", colWidth: 4 },
  { name: "mobileNum", label: "Mobile Number", colWidth: 4 },
  { name: "email", label: "Email", colWidth: 4 },
  { name: "city", label: "City", colWidth: 4 },
  { name: "country", label: "Country", colWidth: 4 },
  { name: "dsoZoneName", label: "DSO Zone", colWidth: 4 },
  { name: "address", label: "Address", colWidth: 6 },
  { name: "alternateAddress", label: "Alternate Address", colWidth: 6 },
  { name: "mapUrl", label: "Map URL", colWidth: 12 },
  { name: "info", label: "Additional Info", colWidth: 12 },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

const DentalOfficeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      modalWidth={800}
      onHide={onHide}
      title="View Dental Office"
      subtitle="Dental office details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DentalOfficeService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DentalOfficeViewModal;