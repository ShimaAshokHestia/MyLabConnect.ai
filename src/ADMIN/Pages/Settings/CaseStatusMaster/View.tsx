// src/DSO/Pages/CaseStatusMaster/View.tsx

import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import CaseStatusService from "../../../Services/CaseStatus/CaseStatus.services";



// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}


// ── Field definitions ─────────────────────────────────────────────────────────

const fields: ViewField[] = [
  { name: "caseStatusName", label: "Case Status Name", colWidth: 6 },
  {
    name: "createdAt",
    label: "Created At",
    colWidth: 6,
    isDate: true,
    formatter: (value) => {
      if (!value) return "—";
      const date = new Date(value);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
  { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
  { name: "isDeleted", label: "Deleted", colWidth: 6, isToggle: true },
];


// ── Component ─────────────────────────────────────────────────────────────────

const CaseStatusViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Case Status"
      subtitle="Case Status details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => CaseStatusService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default CaseStatusViewModal;