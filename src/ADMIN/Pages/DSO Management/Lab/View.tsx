// src/Pages/AppAdmin/Lab/View.tsx

import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import LabMasterService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/Lab.services";

// ── Authentication type map ───────────────────────────────────────────────────
const AUTHENTICATION_TYPE_MAP: Record<number, string> = {
    1: "Normal",
    2: "SSO",
    3: "Basic",
};

// ── Field definitions ─────────────────────────────────────────────────────────
// isActive is excluded — KiduViewModal renders it in the header automatically.
// dsoMasterName is a resolved display field returned alongside dsoMasterId.
const fields: ViewField[] = [
    { name: "labCode", label: "Lab Code", colWidth: 6 },
      { name: "dsoName", label: "DSO Name", colWidth: 6 },
    { name: "labName", label: "Lab Name", colWidth: 6 },
    { name: "displayName", label: "Display Name", colWidth: 6 },
    { name: "email", label: "Email", colWidth: 6 },
    { name: "phone", label: "Phone", colWidth: 6 },
    { name: "authenticationType", label: "Authentication Type", colWidth: 6 },
    { name: "labGroupId", label: "Lab Group", colWidth: 6 },
    { name: "logoforRX", label: "Logo for RX", colWidth: 6 },
    { name: "lmsSystem", label: "LMS System", colWidth: 6 },
     { name: "address", label: "Address", colWidth: 12 },
    { name: "triosId", label: "Trios Id", colWidth: 6 },
    { name: "triosLabCode", label: "Trios Lab Code", colWidth: 6 },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
    show: boolean;
    onHide: () => void;
    recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const LabAdminViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
    return (
        <KiduViewModal
            show={show}
            modalWidth={800}
            onHide={onHide}
            title="View Lab"
            subtitle="Lab Master details"
            fields={fields}
            recordId={recordId}
            onFetch={async (id) => {
                const response = await LabMasterService.getById(Number(id));

                if (response?.value) {
                    // Resolve authenticationType number → label
                    if (response.value.authenticationType !== undefined) {
                        response.value.authenticationType =
                            AUTHENTICATION_TYPE_MAP[response.value.authenticationType] ??
                            String(response.value.authenticationType);
                    }

                    // Ensure dsoName is populated — fall back to ID if name not in response
                    if (!response.value.dsoName && response.value.dsoMasterId) {
                        response.value.dsoName = `DSO #${response.value.dsoMasterId}`;
                    }
                }

                return response;
            }}
            showBadge={true}
            badgeText="Read Only"
        />
    );
};

export default LabAdminViewModal;