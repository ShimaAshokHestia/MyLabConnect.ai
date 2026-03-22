// src/Pages/AppAdmin/DentalOffice/View.tsx

import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DentalOfficeService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/DsoDentalOffice.services";

// ── Field definitions ─────────────────────────────────────────────────────────
// isActive is excluded — KiduViewModal renders it in the header automatically.
// dsoName added to display resolved DSO Master name.
const fields: ViewField[] = [
    { name: "officeCode", label: "Office Code", colWidth: 6 },
    { name: "dsoName", label: "DSO Master", colWidth: 6 },
    { name: "officeName", label: "Office Name", colWidth: 6 },
    { name: "dsoZoneName", label: "DSO Zone", colWidth: 4 },
    { name: "mobileNum", label: "Mobile Number", colWidth: 6 },
    { name: "email", label: "Email", colWidth: 6 },
    { name: "city", label: "City", colWidth: 4 },
    { name: "country", label: "Country", colWidth: 4 },
    { name: "postCode", label: "Post Code", colWidth: 4 },
    { name: "address", label: "Address", colWidth: 6, isTextarea: true },
    { name: "alternateAddress", label: "Alternate Address", colWidth: 6, isTextarea: true },
    { name: "mapUrl", label: "Map URL", colWidth: 12 },
    { name: "info", label: "Additional Info", colWidth: 12, isTextarea: true },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
    show: boolean;
    onHide: () => void;
    recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DentalOfficeAdminViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
    return (
        <KiduViewModal
            show={show}
            modalWidth={800}
            onHide={onHide}
            title="View Dental Office"
            subtitle="Dental office details"
            fields={fields}
            recordId={recordId}
            onFetch={async (id) => {
                const response = await DentalOfficeService.getById(Number(id));

                // Ensure dsoName is populated — fall back to ID if name not in response
                if (response?.value && !response.value.dsoName && response.value.dsoMasterId) {
                    response.value.dsoName = `DSO #${response.value.dsoMasterId}`;
                }

                return response;
            }}
            showBadge={true}
            badgeText="Read Only"
            size="xl"
        />
    );
};

export default DentalOfficeAdminViewModal;