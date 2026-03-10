import React, { useRef } from "react";
import KiduCreateModal, { 
    type Field, 
    type PopupHandlers 
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOmaster } from "../../../../ADMIN/Types/Master/Master.types";
import DSOmasterSelectPopup from "../../../../ADMIN/Pages/Master/PopUp";
import { useState } from "react";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";

// ── Props (matches AddModalComponent interface expected by KiduSelectPopup) ───
interface Props {
    show: boolean;
    handleClose: () => void;
    onAdded: (item: DSODentalOffice) => void;
}

const fields: Field[] = [
    { name: "officeCode", rules: { type: "text", label: "Office Code", required: true, minLength: 3, maxLength: 50, colWidth: 6 } },
    { name: "officeName", rules: { type: "text", label: "Office Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
    { name: "dsoMasterId", rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 } },
    { name: "info", rules: { type: "textarea", label: "Info", required: true, minLength: 5, maxLength: 500, colWidth: 12 } },
    { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const DentalOfficeCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
    const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
    const [masterOpen, setMasterOpen] = useState(false);
    const createdDataRef = useRef<any>(null);

    const popupHandlers: PopupHandlers = {
        dsoMasterId: {
            value: selectedMaster?.name ?? "",
            onOpen: () => setMasterOpen(true),
            onClear: () => setSelectedMaster(null),
        },
    };

    const extraValues = {
        dsoMasterId: selectedMaster?.id ?? null,
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        const payload: Partial<DSODentalOffice> = {
            officeCode: formData.officeCode,
            officeName: formData.officeName,
            info: formData.info,
            dsoMasterId: Number(formData.dsoMasterId),
            isActive: formData.isActive ?? true,
        };
        
        const response = await DSODentalOfficeService.create(payload);
        createdDataRef.current = response;
    };

    const handleSuccess = () => {
        const response = createdDataRef.current;
        const newItem = response?.value || response?.data || response;
        if (newItem) {
            // Ensure the new item has the DSO name for display
            onAdded({
                ...newItem,
                dsoName: selectedMaster?.name
            });
        }
        createdDataRef.current = null;
        setSelectedMaster(null);
        handleClose();
    };

    const handleHide = () => {
        setSelectedMaster(null);
        handleClose();
    };

    return (
        <>
            <KiduCreateModal
                show={show}
                onHide={handleHide}
                title="Add Dental Office"
                subtitle="Create a new DSO Dental Office"
                fields={fields}
                onSubmit={handleSubmit}
                popupHandlers={popupHandlers}
                extraValues={extraValues}
                successMessage="Dental Office created successfully!"
                onSuccess={handleSuccess}
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

export default DentalOfficeCreateModal;