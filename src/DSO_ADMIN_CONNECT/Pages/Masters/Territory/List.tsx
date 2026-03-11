import React, { useState, useRef } from "react";
import KiduServerTableList from "../../../../KIDU_COMPONENTS/KiduServerTableList";
import type { KiduColumn } from "../../../../KIDU_COMPONENTS/KiduServerTable";
import Swal from "sweetalert2";
import DSOTerritoryService from "../../../Services/Masters/DsoTerritory.services";
import DSOTerritoryCreateModal from "./Create";
import DSOTerritoryEditModal from "./Edit";
import DSOTerritoryViewModal from "./View";

// ── Column definitions ────────────────────────────────────────────────────────

const columns: KiduColumn[] = [
    {
        key: "name",
        label: "Territory Name",
        enableSorting: true,
        enableFiltering: true,
        filterType: "text",
    },
    // {
    //     key: "dsoName",
    //     label: "DSO Master",
    //     enableSorting: true,
    //     enableFiltering: false, // ID-based, not filterable by name
    // },
    // {
    //     key: "createdAt",
    //     label: "Created At",
    //     type: "date",
    //     enableSorting: true,
    //     enableFiltering: false,
    // },
    {
        key: "isActive",
        label: "Status",
        type: "badge",
        enableSorting: false,
        enableFiltering: true,
        filterType: "select",
        filterOptions: ["Inactive", "Active"],
        render: (value) => (
            <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
                {value ? "Active" : "Inactive"}
            </span>
        ),
    },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DSOTerritoryList: React.FC = () => {
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [recordId, setRecordId] = useState<string | number>("");
    const tableKeyRef = useRef(0);
    const [tableKey, setTableKey] = useState(0);

    const refreshTable = () => {
        tableKeyRef.current += 1;
        setTableKey(tableKeyRef.current);
    };

    const handleEditClick = (row: any) => { setRecordId(row.id); setShowEdit(true); };
    const handleViewClick = (row: any) => { setRecordId(row.id); setShowView(true); };

    const handleDeleteClick = async (row: any) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This territory will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef0d50",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
            await DSOTerritoryService.delete(row.id);
            refreshTable();
            Swal.fire("Deleted!", "Territory has been deleted.", "success");
        }
    };

    return (
        <>
            <KiduServerTableList
                key={tableKey}
                title="DSO Territories"
                subtitle="Manage territory master data"
                columns={columns}
                paginatedFetchService={DSOTerritoryService.getPaginatedList}
                rowKey="id"
                showAddButton={true}
                addButtonLabel="Add Territory"
                onAddClick={() => setShowCreate(true)}
                onEditClick={handleEditClick}
                onViewClick={handleViewClick}
                onDeleteClick={handleDeleteClick}
                showActions={true}
                showSearch={true}
                showFilters={true}
                showExport={true}
                showColumnToggle={true}
                defaultRowsPerPage={10}
                highlightOnHover={true}
                auditLogTableName="dso_territory"
            />

            <DSOTerritoryCreateModal
                show={showCreate}
                onHide={() => setShowCreate(false)}
                onSuccess={() => { setShowCreate(false); refreshTable(); }}
            />

            {recordId && (
                <>
                    <DSOTerritoryEditModal
                        show={showEdit}
                        onHide={() => setShowEdit(false)}
                        onSuccess={() => { setShowEdit(false); refreshTable(); }}
                        recordId={recordId}
                    />
                    <DSOTerritoryViewModal
                        show={showView}
                        onHide={() => setShowView(false)}
                        recordId={recordId}
                    />
                </>
            )}
        </>
    );
};

export default DSOTerritoryList;
