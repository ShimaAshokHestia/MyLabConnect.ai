// src/Pages/AppAdmin/Lab/DSOPopup.tsx

import React, { useState, useEffect } from "react";
import type { DSOLookupItem } from "../../../Types/Auth/Lookup.types";
import type { KiduSelectColumn } from "../../../KIDU_COMPONENTS/KiduSelectPopup";
import LookupService from "../../../Services/Common/Lookup.services";
import KiduSelectPopup from "../../../KIDU_COMPONENTS/KiduSelectPopup";

// ── Column definitions ────────────────────────────────────────────────────────
const columns: KiduSelectColumn<DSOLookupItem>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "DSO Name", filterType: "text" },
  {
    key: "isActive",
    label: "Status",
    filterType: "select",
    filterOptions: ["Active", "Inactive"],
    render: (value: boolean) => (
      <span
        style={{
          color: value ? "#28a745" : "#dc3545",
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: 4,
          backgroundColor: value ? "#e8f5e9" : "#ffebee",
          fontSize: "0.82rem",
        }}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const searchKeys: (keyof DSOLookupItem)[] = ["name"];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (dso: DSOLookupItem) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSOPopup: React.FC<Props> = ({ show, onClose, onSelect }) => {
  const [data, setData] = useState<DSOLookupItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    LookupService.getDSOList()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [show]);

  return (
    <KiduSelectPopup<DSOLookupItem>
      show={show}
      onClose={onClose}
      title="Select DSO"
      subtitle="Choose a DSO Master to associate with this lab"
      data={data}
      loading={loading}
      columns={columns}
      onSelect={onSelect}
      idKey="id"
      labelKey="name"
      searchKeys={searchKeys}
      rowsPerPage={10}
      showAddButton={false}
    />
  );
};

export default DSOPopup;