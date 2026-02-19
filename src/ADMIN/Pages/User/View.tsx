import React from "react";
import type { ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import UserService from "../../Services/User/User.services";
import KiduViewModal from "../../../KIDU_COMPONENTS/KiduViewModal";

interface Props {
    show: boolean;
    onHide: () => void;
    recordId: string | number;
}

const authenticationTypeLabels: Record<number, string> = {
    0: "Standard",
    1: "OAuth",
    2: "LDAP",
    3: "SSO",
};

const fields: ViewField[] = [
    // Basic Info
    { name: "userName", label: "User Name", colWidth: 6 },
    { name: "userEmail", label: "Email", colWidth: 6 },
    { name: "phoneNumber", label: "Phone Number", colWidth: 6 },
    { name: "address", label: "Address", colWidth: 6 },

    // Relation Fields
    { name: "userTypeName", label: "User Type", colWidth: 6 },
    { name: "companyName", label: "Company", colWidth: 6 },
    { name: "userTypeId", label: "User Type ID", colWidth: 6 },
    { name: "companyId", label: "Company ID", colWidth: 6 },

    // Auth Type with formatter
    { name: "authenticationType", label: "Authentication Type", colWidth: 6, formatter: (value) => authenticationTypeLabels[Number(value)] ?? "Unknown", },

    // Status & Flags
    { name: "isActive", label: "Active", colWidth: 4, isToggle: true },
    { name: "islocked", label: "Locked", colWidth: 4, isToggle: true },
    { name: "isDeleted", label: "Deleted", colWidth: 4, isToggle: true },

    // Audit
    { name: "createdAt", label: "Created At", colWidth: 6, isDate: true },
    { name: "updatedAt", label: "Updated At", colWidth: 6, isDate: true },
];

const UserViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {

    const handleFetch = async (id: string | number) => {
        const response = await UserService.getById(Number(id));
        return response;
    };

    return (
        <KiduViewModal
            show={show}
            onHide={onHide}
            title="View User"
            subtitle="User details"
            size="lg"
            centered={true}
            recordId={recordId}
            fields={fields}
            onFetch={handleFetch}
            showBadge={true}
            badgeText="Read Only"
        />
    );
};

export default UserViewModal;