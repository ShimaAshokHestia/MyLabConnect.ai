// src/Pages/AppAdmin/Lab/Create.tsx

import React, { useState } from "react";
import KiduCreateModal, {
    type Field,
    type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import LabGroupService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/Labgroup.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import type { DSOLookupItem } from "../../../../Types/Auth/Lookup.types";
import type { LabMaster } from "../../../../DSO_ADMIN_CONNECT/Types/Masters/Lab.types";
import LabMasterService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/Lab.services";
import DSOPopup from "../../Master/DsoLookupPopup";


// ── Authentication type static options ────────────────────────────────────────
const AUTHENTICATION_TYPE_OPTIONS = [
    { value: 1, label: "Normal" },
    { value: 2, label: "SSO" },
    { value: 3, label: "Basic" },
];

// ── Field definitions ─────────────────────────────────────────────────────────
// dsoMasterId is now a popup field; labGroupId remains a smartdropdown
const fields: Field[] = [
    {
        name: "labCode",
        rules: { type: "text", label: "Lab Code", required: true, minLength: 3, maxLength: 10, colWidth: 6 },
    },
     {
        // Popup field — resolved via DSOPopup
        name: "dsoMasterId",
        rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 },
    },
    {
        name: "labName",
        rules: { type: "text", label: "Lab Name", required: true, minLength: 3, maxLength: 200, colWidth: 6 },
    },
    {
        name: "displayName",
        rules: { type: "text", label: "Display Name", required: false, minLength: 3, maxLength: 200, colWidth: 6 },
    },
    {
        name: "email",
        rules: { type: "email", label: "Email", required: false, minLength: 3, maxLength: 100, colWidth: 6 },
    },
    {
        name: "phone",
        rules: { type: "number", label: "Phone", required: false, minLength: 3, maxLength: 100, colWidth: 6 },
    },
   
    {
        name: "labGroupId",
        rules: { type: "smartdropdown", label: "Lab Group", required: true, colWidth: 6 },
    },
    {
        name: "authenticationType",
        rules: { type: "smartdropdown", label: "Authentication Type", required: true, colWidth: 6 },
    },
    {
        name: "logoforRX",
        rules: { type: "text", label: "Logo for RX", required: false, minLength: 3, maxLength: 200, colWidth: 6 },
    },
    {
        name: "lmsSystem",
        rules: { type: "text", label: "LMS System", required: false, minLength: 3, maxLength: 200, colWidth: 6 },
    },
     {
        name: "address",
        rules: { type: "textarea", label: "Address", required: false, minLength: 3, maxLength: 500, colWidth: 12 },
    },
    {
        name: "triosId",
        rules: { type: "number", label: "Trios Id", required: false, minLength: 1, maxLength: 100, colWidth: 6 },
    },
    {
        name: "triosLabCode",
        rules: { type: "text", label: "Trios Lab Code", required: false, minLength: 3, maxLength: 10, colWidth: 6 },
    },
    {
        name: "isActive",
        rules: { type: "toggle", label: "Active", colWidth: 6 },
    },
];

// ── Dropdown handlers ─────────────────────────────────────────────────────────
const dropdownHandlers = {
    labGroupId: {
        paginatedFetch: async (params: any) => {
            const result = await LabGroupService.getPaginatedList({
                pageNumber: params.pageNumber,
                pageSize: params.pageSize,
                searchTerm: params.searchTerm,
                sortBy: "",
                sortDescending: false,
            });
            return { data: result.data, total: result.total };
        },
        mapOption: (row: any) => ({
            value: row.id,
            label: row.name ?? row.groupName ?? String(row.id),
        }),
        pageSize: 10,
        placeholder: "Select Lab Group...",
    },
    authenticationType: {
        staticOptions: AUTHENTICATION_TYPE_OPTIONS,
        placeholder: "Select Authentication Type...",
    },
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const LabAdminCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
    const { handleApiError, assertApiSuccess } = useApiErrorHandler();

    // ── DSO popup state ───────────────────────────────────────────────────────
    const [selectedDSO, setSelectedDSO] = useState<DSOLookupItem | null>(null);
    const [dsoPopupOpen, setDsoPopupOpen] = useState(false);

    // ── Popup handlers passed to KiduCreateModal ──────────────────────────────
    const popupHandlers: PopupHandlers = {
        dsoMasterId: {
            value: selectedDSO?.name ?? "",
            onOpen: () => setDsoPopupOpen(true),
            onClear: () => setSelectedDSO(null),
        },
    };

    // dsoMasterId actual numeric value sent alongside formData
    const extraValues = {
        dsoMasterId: selectedDSO?.id ?? null,
    };

    // ── Submit handler ────────────────────────────────────────────────────────
    const handleSubmit = async (formData: Record<string, any>) => {
        // Validate DSO selection (popup fields are validated by KiduCreateModal,
        // but we double-check the resolved ID here for safety)
        if (!selectedDSO?.id) {
            throw new Error("Please select a DSO Master.");
        }

        const payload: Partial<LabMaster> = {
            labCode: formData.labCode,
            labName: formData.labName,
            displayName: formData.displayName || undefined,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            address: formData.address || undefined,
            labGroupId: formData.labGroupId ? Number(formData.labGroupId) : undefined,
            authenticationType: formData.authenticationType
                ? Number(formData.authenticationType)
                : 1,
            logoforRX: formData.logoforRX || undefined,
            lmsSystem: formData.lmsSystem || undefined,
            isActive: formData.isActive ?? true,
            triosId: formData.triosId || undefined,
            triosLabCode: formData.triosLabCode || undefined,
            dsoLabMappings: [
                {
                    dsoMasterId: selectedDSO.id,
                    isActive: true,
                    isDeleted: false,
                },
            ],
        };

        let result: any;
        try {
            result = await LabMasterService.create(payload);
        } catch (err) {
            await handleApiError(err, "network");
            return;
        }

        await assertApiSuccess(result, "Failed to create Lab.");
    };

    // ── Reset popup state on close ────────────────────────────────────────────
    const handleHide = () => {
        setSelectedDSO(null);
        onHide();
    };

    const handleSuccess = () => {
        setSelectedDSO(null);
        onSuccess();
    };

    return (
        <>
            <KiduCreateModal
                show={show}
                modalWidth={800}
                onHide={handleHide}
                title="Create Lab"
                subtitle="Add a new Lab (AppAdmin)"
                fields={fields}
                onSubmit={handleSubmit}
                popupHandlers={popupHandlers}
                dropdownHandlers={dropdownHandlers}
                extraValues={extraValues}
                successMessage="Lab created successfully!"
                onSuccess={handleSuccess}
            />

            {/* DSO Master selection popup */}
            <DSOPopup
                show={dsoPopupOpen}
                onClose={() => setDsoPopupOpen(false)}
                onSelect={(dso) => {
                    setSelectedDSO(dso);
                    setDsoPopupOpen(false);
                }}
            />
        </>
    );
};

export default LabAdminCreateModal;