import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOTerritoryService from "../../../Services/Masters/DsoTerritory.services";

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    show: boolean;
    onHide: () => void;
    recordId: string | number;
}

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: ViewField[] = [
    { name: "name", label: "Territory Name", colWidth: 6 },
    { name: "dsoName", label: "DSO Master", colWidth: 6 },
    { name: "isActive", label: "Status", colWidth: 6, isToggle: true },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DSOTerritoryViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
    return (
        <KiduViewModal
            show={show}
            onHide={onHide}
            title="View Territory"
            subtitle="DSO Territory details"
            fields={fields}
            recordId={recordId}
            onFetch={(id) => DSOTerritoryService.getById(Number(id))}
            showBadge={true}
            badgeText="Read Only"
        />
    );
};

export default DSOTerritoryViewModal;
