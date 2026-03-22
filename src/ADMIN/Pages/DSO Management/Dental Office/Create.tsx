// src/Pages/AppAdmin/DentalOffice/Create.tsx

import React, { useState, useCallback } from "react";
import KiduCreateModal, { type Field, type PopupHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import type { DSOLookupItem } from "../../../../Types/Auth/Lookup.types";
import type { DSOZone } from "../../../../DSO_ADMIN_CONNECT/Types/Setup/DsoZone.types";
import type { DentalOffice } from "../../../../DSO_ADMIN_CONNECT/Types/Masters/DsoDentalOffice.types";
import DentalOfficeService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/DsoDentalOffice.services";
import DSOZonePopup from "../../../../DSO_ADMIN_CONNECT/Pages/Setup/Zone/DSOZonePopup";
import DSOPopup from "../../Master/DsoLookupPopup";


// ── Field definitions ─────────────────────────────────────────────────────────
// dsoMasterId added as popup field — all original fields kept intact
const fields: Field[] = [
  {
    name: "officeCode",
    rules: { type: "text", label: "Office Code", required: true, minLength: 2, maxLength: 10, colWidth: 6 },
  },
    {
    // New popup field for AppAdmin — selects DSO Master instead of reading from session
    name: "dsoMasterId",
    rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 },
  },
  {
    name: "officeName",
    rules: { type: "text", label: "Office Name", required: true, minLength: 3, maxLength: 200, colWidth: 6 },
  },
  {
    name: "dsoZoneId",
    rules: { type: "popup", label: "DSO Zone", required: true, colWidth: 6 },
  },
 
  {
    name: "mobileNum",
    rules: { type: "text", label: "Mobile Number", required: true, maxLength: 15, pattern: /^[0-9]+$/, colWidth: 6 },
  },
  {
    name: "email",
    rules: { type: "email", label: "Email", required: true, maxLength: 100, colWidth: 6 },
  },
  {
    name: "city",
    rules: { type: "text", label: "City", required: true, maxLength: 50, colWidth: 4 },
  },
  {
    name: "country",
    rules: { type: "text", label: "Country", required: true, maxLength: 50, colWidth: 4 },
  },
   {
    name: "postCode",
    rules: { type: "text", label: "Post Code", required: true, maxLength: 20, colWidth: 4 },
  },

  {
    name: "address",
    rules: { type: "textarea", label: "Address", required: true, maxLength: 500, colWidth: 6 },
  },
  {
    name: "alternateAddress",
    rules: { type: "textarea", label: "Alternate Address", required: false, maxLength: 500, colWidth: 6 },
  },
  {
    name: "mapUrl",
    rules: { type: "url", label: "Map URL", required: false, maxLength: 500, colWidth: 12 },
  },
  {
    name: "info",
    rules: { type: "textarea", label: "Additional Info", required: false, maxLength: 500, colWidth: 12 },
  },
  {
    name: "isActive",
    rules: { type: "toggle", label: "Active", colWidth: 6 },
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DentalOfficeAdminCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── DSO Zone popup state ──────────────────────────────────────────────────
  const [showZonePopup, setShowZonePopup] = useState(false);
  const [selectedZone, setSelectedZone] = useState<{ id: number; name: string } | null>(null);

  // ── DSO Master popup state ────────────────────────────────────────────────
  const [showDSOPopup, setShowDSOPopup] = useState(false);
  const [selectedDSO, setSelectedDSO] = useState<DSOLookupItem | null>(null);

  // ── Popup handlers passed to KiduCreateModal ──────────────────────────────
  const popupHandlers: PopupHandlers = {
    dsoZoneId: {
      value: selectedZone?.name ?? "",
      onOpen: () => setShowZonePopup(true),
      onClear: () => setSelectedZone(null),
    },
    dsoMasterId: {
      value: selectedDSO?.name ?? "",
      onOpen: () => setShowDSOPopup(true),
      onClear: () => setSelectedDSO(null),
    },
  };

  // ── Zone selection handler ────────────────────────────────────────────────
  const handleZoneSelect = useCallback((zone: DSOZone) => {
    setSelectedZone({ id: zone.id!, name: zone.name! });
    setShowZonePopup(false);
  }, []);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedZone) {
      throw new Error("Please select a DSO Zone.");
    }
    if (!selectedDSO) {
      throw new Error("Please select a DSO Master.");
    }

    const payload: Partial<DentalOffice> = {
      officeCode: formData.officeCode,
      officeName: formData.officeName,
      postCode: formData.postCode,
      mobileNum: formData.mobileNum,
      email: formData.email,
      city: formData.city,
      country: formData.country,
      address: formData.address,
      alternateAddress: formData.alternateAddress || "",
      mapUrl: formData.mapUrl || "",
      dsoZoneId: selectedZone.id,
      info: formData.info || "",
      dsoMasterId: selectedDSO.id,
      isActive: formData.isActive ?? true,
    };

    let result: any;
    try {
      result = await DentalOfficeService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    await assertApiSuccess(result, "Failed to create Dental Office.");
  };

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleHide = () => {
    setSelectedZone(null);
    setSelectedDSO(null);
    onHide();
  };

  const handleSuccess = () => {
    setSelectedZone(null);
    setSelectedDSO(null);
    onSuccess();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        modalWidth={800}
        onHide={handleHide}
        title="Create Dental Office"
        subtitle="Add a new dental office (AppAdmin)"
        fields={fields}
        popupHandlers={popupHandlers}
        onSubmit={handleSubmit}
        successMessage="Dental Office created successfully!"
        onSuccess={handleSuccess}
        size="xl"
      />

      {/* DSO Zone selection popup */}
      <DSOZonePopup
        show={showZonePopup}
        onClose={() => setShowZonePopup(false)}
        onSelect={handleZoneSelect}
        showAddButton={true}
      />

      {/* DSO Master selection popup */}
      <DSOPopup
        show={showDSOPopup}
        onClose={() => setShowDSOPopup(false)}
        onSelect={(dso) => {
          setSelectedDSO(dso);
          setShowDSOPopup(false);
        }}
      />
    </>
  );
};

export default DentalOfficeAdminCreateModal;