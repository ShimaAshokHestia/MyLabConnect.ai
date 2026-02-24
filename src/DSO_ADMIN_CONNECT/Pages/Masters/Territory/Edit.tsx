import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
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
    recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSOTerritoryEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
    const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
    const [masterOpen, setMasterOpen] = useState(false);

    // Reset selection when modal closes
    useEffect(() => {
        if (!show) {
            setSelectedMaster(null);
        }
    }, [show]);

    // ── Fetch handler ─────────────────────────────────────────────────────────
    const handleFetch = async (id: string | number) => {
        const response = await DSOTerritoryService.getById(Number(id));
        console.log("Fetch Response:", response);

        const data = response?.value || response;

        // Pre-populate the DSO Master pill from fetched data
        if (data?.dsoMasterId && data?.dsoName) {
            setSelectedMaster({
                id: data.dsoMasterId,
                name: data.dsoName,
            } as DSOmaster);
        }

        return response;
    };

    // ── Update handler ────────────────────────────────────────────────────────
    const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
        const payload: Partial<DSOTerritory> = {
            id: Number(id),
            name: formData.name,
            dsoMasterId: Number(formData.dsoMasterId),
            isActive: formData.isActive ?? true,
        };

        await DSOTerritoryService.update(Number(id), payload);
        return { isSucess: true, value: payload };
    };

    // ── Popup handlers ────────────────────────────────────────────────────────
    const popupHandlers = {
        dsoMasterId: {
            value: selectedMaster?.name ?? "",
            actualValue: selectedMaster?.id,
            onOpen: () => setMasterOpen(true),
            onClear: () => setSelectedMaster(null),
        },
    };

    return (
        <>
            <KiduEditModal
                show={show}
                onHide={onHide}
                title="Edit Territory"
                subtitle="Update DSO Territory details"
                fields={fields}
                recordId={recordId}
                onFetch={handleFetch}
                onUpdate={handleUpdate}
                popupHandlers={popupHandlers}
                successMessage="Territory updated successfully!"
                onSuccess={onSuccess}
                submitButtonText="Update Territory"
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

export default DSOTerritoryEditModal;
