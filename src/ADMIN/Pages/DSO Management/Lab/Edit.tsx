// src/Pages/AppAdmin/Lab/Edit.tsx

import React, { useState, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DropdownHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import LabGroupService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/Labgroup.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import type { DSOLookupItem } from "../../../../Types/Auth/Lookup.types";
import LabMasterService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/Lab.services";
import type { LabMaster } from "../../../../DSO_ADMIN_CONNECT/Types/Masters/Lab.types";
import DSOPopup from "../../Master/DsoLookupPopup";

// ── Authentication type static options ────────────────────────────────────────
const AUTHENTICATION_TYPE_OPTIONS = [
    { value: 1, label: "Normal" },
    { value: 2, label: "SSO" },
    { value: 3, label: "Basic" },
];

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
    {
        name: "labCode",
        rules: { type: "text", label: "Lab Code", required: true, minLength: 3, maxLength: 10, colWidth: 6, disabled: true },
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
        rules: { type: "text", label: "LMS System", required: false, minLength: 3, maxLength: 100, colWidth: 6 },
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
const dropdownHandlers: DropdownHandlers = {
    labGroupId: {
        paginatedFetch: async (params) => {
            const result = await LabGroupService.getPaginatedList({
                pageNumber: params.pageNumber,
                pageSize: params.pageSize,
                searchTerm: params.searchTerm,
                sortBy: "",
                sortDescending: false,
            });
            return { data: result.data, total: result.total };
        },
        mapOption: (row) => ({
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
    recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const LabAdminEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
    const { handleApiError, assertApiSuccess } = useApiErrorHandler();

    // ── DSO popup state ───────────────────────────────────────────────────────
    const [selectedDSO, setSelectedDSO] = useState<DSOLookupItem | null>(null);
    const [dsoPopupOpen, setDsoPopupOpen] = useState(false);

    // Reset DSO state when modal closes
    useEffect(() => {
        if (!show) {
            setSelectedDSO(null);
        }
    }, [show]);

    // ── Popup handlers passed to KiduEditModal ────────────────────────────────
    const popupHandlers = {
        dsoMasterId: {
            value: selectedDSO?.name ?? "",
            actualValue: selectedDSO?.id,
            onOpen: () => setDsoPopupOpen(true),
            onClear: () => setSelectedDSO(null),
        },
    };

    // ── Fetch handler — pre-fills form including DSO pill ─────────────────────
    const handleFetch = async (id: string | number) => {
        const response = await LabMasterService.getById(Number(id));

        if (response?.isSucess && response.value) {
            const data = response.value;

            // Pre-populate DSO pill from fetched data
            // The API should return dsoMasterId + dsoName (or similar); adjust keys as needed
            if (data.dsoMasterId) {
                setSelectedDSO({
                    id: data.dsoMasterId,
                    name: data.dsoName ?? `DSO #${data.dsoMasterId}`,
                    isActive: true,
                });
            }
        }

        return response;
    };

    // ── Update handler ────────────────────────────────────────────────────────
    const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
        if (!selectedDSO?.id) {
            throw new Error("Please select a DSO Master.");
        }

        const payload: Partial<LabMaster> = {
            id: Number(id),
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
            result = await LabMasterService.update(Number(id), payload);
        } catch (err) {
            await handleApiError(err, "network");
            return;
        }

        await assertApiSuccess(result, "Failed to update Lab.");
        return result;
    };

    return (
        <>
            <KiduEditModal
                show={show}
                modalWidth={800}
                onHide={onHide}
                title="Edit Lab"
                subtitle="Update Lab details (AppAdmin)"
                fields={fields}
                recordId={recordId}
                onFetch={handleFetch}
                onUpdate={handleUpdate}
                popupHandlers={popupHandlers}
                dropdownHandlers={dropdownHandlers}
                successMessage="Lab updated successfully!"
                onSuccess={onSuccess}
                submitButtonText="Update Lab"
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

export default LabAdminEditModal;