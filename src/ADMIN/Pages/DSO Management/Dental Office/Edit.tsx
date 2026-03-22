// src/Pages/AppAdmin/DentalOffice/Edit.tsx

import React, { useState, useCallback, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DSOZone } from "../../../../DSO_ADMIN_CONNECT/Types/Setup/DsoZone.types";
import DentalOfficeService from "../../../../DSO_ADMIN_CONNECT/Services/Masters/DsoDentalOffice.services";
import type { DentalOffice } from "../../../../DSO_ADMIN_CONNECT/Types/Masters/DsoDentalOffice.types";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import type { DSOLookupItem } from "../../../../Types/Auth/Lookup.types";
import DSOZonePopup from "../../../../DSO_ADMIN_CONNECT/Pages/Setup/Zone/DSOZonePopup";
import DSOPopup from "../../Master/DsoLookupPopup";


// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  {
    name: "officeCode",
    rules: { type: "text", label: "Office Code", required: true, minLength: 2, maxLength: 10, colWidth: 6 },
  },
   {
    // New popup field for AppAdmin — replaces session-based dsoMasterId
    name: "dsoMasterId",
    rules: { type: "popup", label: "DSO Master", required: true, colWidth: 6 },
  },
  {
    name: "officeName",
    rules: { type: "text", label: "Office Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 },
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
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DentalOfficeAdminEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── DSO Zone popup state ──────────────────────────────────────────────────
  const [showZonePopup, setShowZonePopup] = useState(false);
  const [selectedZone, setSelectedZone] = useState<{ id: number; name: string } | null>(null);

  // ── DSO Master popup state ────────────────────────────────────────────────
  const [showDSOPopup, setShowDSOPopup] = useState(false);
  const [selectedDSO, setSelectedDSO] = useState<DSOLookupItem | null>(null);

  // Reset all popup state when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedZone(null);
      setSelectedDSO(null);
      setShowZonePopup(false);
      setShowDSOPopup(false);
    }
  }, [show]);

  // ── Popup handlers passed to KiduEditModal ────────────────────────────────
  const popupHandlers = {
    dsoZoneId: {
      value: selectedZone?.name ?? "",
      actualValue: selectedZone?.id,
      onOpen: () => setShowZonePopup(true),
      onClear: () => setSelectedZone(null),
    },
    dsoMasterId: {
      value: selectedDSO?.name ?? "",
      actualValue: selectedDSO?.id,
      onOpen: () => setShowDSOPopup(true),
      onClear: () => setSelectedDSO(null),
    },
  };

  // ── Zone selection handler ────────────────────────────────────────────────
  const handleZoneSelect = useCallback((zone: DSOZone) => {
    setSelectedZone({ id: zone.id!, name: zone.name! });
    setShowZonePopup(false);
  }, []);

  // ── Fetch handler — pre-fills both popup pills ────────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DentalOfficeService.getById(Number(id));
    const data = response?.value ?? response?.data ?? response;

    // Pre-populate DSO Zone pill
    if (data?.dsoZoneId && data?.dsoZoneName) {
      setSelectedZone({ id: data.dsoZoneId, name: data.dsoZoneName });
    }

    // Pre-populate DSO Master pill — fall back to ID if name not in response
    if (data?.dsoMasterId) {
      setSelectedDSO({
        id: data.dsoMasterId,
        name: data.dsoName ?? `DSO #${data.dsoMasterId}`,
        isActive: true,
      });
    }

    return response;
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    if (!selectedZone) {
      throw new Error("Please select a DSO Zone.");
    }
    if (!selectedDSO) {
      throw new Error("Please select a DSO Master.");
    }

    const payload: Partial<DentalOffice> = {
      id: Number(id),
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
      result = await DentalOfficeService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    await assertApiSuccess(result, "Failed to update Dental Office.");
    return result;
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
      <KiduEditModal
        show={show}

        onHide={handleHide}
        title="Edit Dental Office"
        subtitle="Update dental office details (AppAdmin)"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Dental Office updated successfully!"
        onSuccess={handleSuccess}
        submitButtonText="Update Dental Office"
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

export default DentalOfficeAdminEditModal;