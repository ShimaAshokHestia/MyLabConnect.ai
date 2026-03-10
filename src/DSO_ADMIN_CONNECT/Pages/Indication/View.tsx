import React from "react";
import KiduViewModal, { type ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import DSOIndicationService from "../../Services/Setup/DSOIndication.services";

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    show: boolean;
    onHide: () => void;
    recordId: string | number;
}

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: ViewField[] = [
    { name: "id", label: "ID", colWidth: 6 },
    { name: "name", label: "Indication Name", colWidth: 6 },
    { name: "dsoProthesisname", label: "Prosthesis Type", colWidth: 6 },
    { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DSOIndicationModal: React.FC<Props> = ({ show, onHide, recordId }) => {
    return (
        <KiduViewModal
            show={show}
            onHide={onHide}
            title="View Restoration Type"
            subtitle="DSO Restoration Type details"
            fields={fields}
            recordId={recordId}
            onFetch={(id) => DSOIndicationService.getById(Number(id))}
            showBadge={true}
            badgeText="Read Only"
        />
    );
};

export default DSOIndicationModal;