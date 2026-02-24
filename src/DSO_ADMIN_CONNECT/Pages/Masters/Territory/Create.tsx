import React, { useState } from "react";
import KiduCreateModal, {
    type Field,
    type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DSOTerritoryService from "../../../Services/Masters/DsoTerritory.services";
import type { DSOTerritory } from "../../../Types/Masters/DsoTerritory.types";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
    { name: "name", rules: { type: "text", label: "Territory Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOTerritoryCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
    const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
    const [masterOpen, setMasterOpen] = useState(false);

    // ── Popup handlers ────────────────────────────────────────────────────────
    const popupHandlers: PopupHandlers = {
        dsoMasterId: {
            value: selectedMaster?.name ?? "",
            onOpen: () => setMasterOpen(true),
            onClear: () => setSelectedMaster(null),
        },
    };

    // extraValues carries the actual ID merged at submit time
    const extraValues = {
        dsoMasterId: selectedMaster?.id ?? null,
    };

    // ── Submit handler ────────────────────────────────────────────────────────
    const handleSubmit = async (formData: Record<string, any>) => {
        const payload: Partial<DSOTerritory> = {
            name: formData.name,
            dsoMasterId: Number(formData.dsoMasterId),
            isActive: formData.isActive ?? true,
        };

        await DSOTerritoryService.create(payload);
    };

    // ── Reset local state when modal closes ───────────────────────────────────
    const handleHide = () => {
        setSelectedMaster(null);
        onHide();
    };

    return (
        <>
            <KiduCreateModal
                show={show}
                onHide={handleHide}
                title="Create Territory"
                subtitle="Add a new DSO Territory"
                fields={fields}
                onSubmit={handleSubmit}
                popupHandlers={popupHandlers}
                extraValues={extraValues}
                successMessage="Territory created successfully!"
                onSuccess={onSuccess}
            />

            <DSOmasterSelectPopup
                show={masterOpen}
                onClose={() => setMasterOpen(false)}
                onSelect={(master) => {
                    setSelectedMaster(master);
                    setMasterOpen(false);
                }}
            />
        </>
    );
};

export default DSOTerritoryCreateModal;
