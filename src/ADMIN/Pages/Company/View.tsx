import React from "react";
import type { ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import KiduViewModal from "../../../KIDU_COMPONENTS/KiduViewModal";
import CompanyService from "../../Services/Company/Company.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "comapanyName",  label: "Company Name",   colWidth: 6 },
  { name: "email",         label: "Email",          colWidth: 6 },
  { name: "contactNumber", label: "Contact Number", colWidth: 6 },
  { name: "website",       label: "Website",        colWidth: 6 },
  { name: "taxNumber",     label: "Tax Number",     colWidth: 6 },
  { name: "invoicePrefix", label: "Invoice Prefix", colWidth: 6 },
  { name: "addressLine1",  label: "Address Line 1", colWidth: 6 },
  { name: "addressLine2",  label: "Address Line 2", colWidth: 6 },
  { name: "city",          label: "City",           colWidth: 6 },
  { name: "state",         label: "State",          colWidth: 6 },
  { name: "country",       label: "Country",        colWidth: 6 },
  { name: "zipCode",       label: "Zip Code",       colWidth: 6 },
  { name: "isActive",      label: "Status",         colWidth: 6, isToggle: true },
  { name: "createdAt",     label: "Created At",     colWidth: 6, isDate: true },
  { name: "updatedAt",     label: "Updated At",     colWidth: 6, isDate: true },
];

const CompanyViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Company"
      subtitle="Company details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => CompanyService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default CompanyViewModal;
