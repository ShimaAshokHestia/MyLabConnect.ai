import React from "react";
import KiduSelectPopup from "../../../../KIDU_COMPONENTS/KiduSelectPopup";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DentalOfficeCreateModal from "./DSODentalOfficeCreateModal";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (item: DSODentalOffice) => void;
    showAddButton?: boolean;
    dsoMasterId?: number; // Optional: filter by DSO Master
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODentalOfficePopup: React.FC<Props> = ({
    show,
    onClose,
    onSelect,
    showAddButton = false,
    dsoMasterId
}) => {
    // Build endpoint with optional filter
    const fetchEndpoint = dsoMasterId 
        ? `${API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL}?dsoMasterId=${dsoMasterId}`
        : API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL;

    return (
        <KiduSelectPopup<DSODentalOffice>
            show={show}
            onClose={onClose}
            title="Select Dental Office"
            subtitle="Search and pick a dental office"
            fetchEndpoint={fetchEndpoint}
            columns={[
                {
                    key: "officeCode",
                    label: "Office Code",
                    filterType: "text",
                },
                {
                    key: "officeName",
                    label: "Office Name",
                    filterType: "text",
                },
                {
                    key: "dsoName",
                    label: "DSO Master",
                    filterType: "text",
                },
                {
                    key: "info",
                    label: "Info",
                    filterType: "text",
                },
                {
                    key: "isActive",
                    label: "Status",
                    filterType: "select",
                    filterOptions: ["true", "false"],
                    render: (value: boolean) => (
                        <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
                            {value ? "Active" : "Inactive"}
                        </span>
                    ),
                },
            ]}
            onSelect={onSelect}
            idKey="id"
            labelKey="officeName"
            searchKeys={["officeCode", "officeName", "dsoName", "info"]}
            rowsPerPage={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            themeColor="#ef0d50"
            multiSelect={false}
            showAddButton={showAddButton}
            AddModalComponent={DentalOfficeCreateModal}
            addButtonLabel="Add Dental Office"
        />
    );
};

export default DSODentalOfficePopup;