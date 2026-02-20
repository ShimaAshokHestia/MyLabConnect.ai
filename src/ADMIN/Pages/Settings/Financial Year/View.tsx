import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import FinancialYearService from "../../../Services/Settings/FinancialYear.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "finacialYearCode", label: "Financial Year Code", colWidth: 6 },
  { name: "startDate",        label: "Start Date",          colWidth: 6, isDate: true },
  { name: "endDate",          label: "End Date",            colWidth: 6, isDate: true },
  { name: "isCurrent",        label: "Current Year",        colWidth: 6, isToggle: true },
  { name: "isClosed",         label: "Closed",              colWidth: 6, isToggle: true },
  { name: "createdAt",        label: "Created At",          colWidth: 6, isDate: true },
  { name: "updatedAt",        label: "Updated At",          colWidth: 6, isDate: true },
];

const FinancialYearViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Financial Year"
      subtitle="Financial Year details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => FinancialYearService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default FinancialYearViewModal;
