// src/Pages/Masters/DentalOffice/Edit.tsx

import React, { useState, useCallback, useEffect } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import DentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import type { DentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import DSOZonePopup from "../../Setup/Zone/DSOZonePopup";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import type { PopupHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";

const fields: Field[] = [
  {
    name: "officeCode",
    rules: { type: "text", label: "Office Code", required: true, minLength: 2, maxLength: 50, colWidth: 6 },
  },
  {
    name: "officeName",
    rules: { type: "text", label: "Office Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 },
  },
  {
    name: "postCode",
    rules: { type: "text", label: "Post Code", required: true, maxLength: 20, colWidth: 4 },
  },
  {
    name: "mobileNum",
    rules: { type: "text", label: "Mobile Number", required: true, maxLength: 15, pattern: /^[0-9]+$/, colWidth: 4 },
  },
  {
    name: "email",
    rules: { type: "email", label: "Email", required: true, maxLength: 100, colWidth: 4 },
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
    name: "dsoZoneId",
    rules: { type: "popup", label: "DSO Zone", required: true, colWidth: 4 },
  },
  {
    name: "address",
    rules: { type: "textarea", label: "Address", required: true, maxLength: 200, colWidth: 6 },
  },
  {
    name: "alternateAddress",
    rules: { type: "textarea", label: "Alternate Address", required: false, maxLength: 200, colWidth: 6 },
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

const DentalOfficeEditModal: React.FC<Props> = ({ 
  show, 
  onHide, 
  onSuccess, 
  recordId 
}) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();
  
  // State for popup
  const [showZonePopup, setShowZonePopup] = useState(false);
  const [selectedZone, setSelectedZone] = useState<{ id: number; name: string } | null>(null);
  const [initialZoneName, setInitialZoneName] = useState<string>("");

  // Popup handlers for DSO Zone
  const popupHandlers: PopupHandlers = {
    dsoZoneId: {
      value: selectedZone?.name || initialZoneName,
      onOpen: () => setShowZonePopup(true),
      onClear: () => setSelectedZone(null),
    },
  };

  // Handle zone selection from popup
  const handleZoneSelect = useCallback((zone: DSOZone) => {
    setSelectedZone({
      id: zone.id!,
      name: zone.name!,
    });
    setShowZonePopup(false);
  }, []);

  // ── Fetch existing data ───────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DentalOfficeService.getById(Number(id));
    
    // Extract the data from response
    const data = response?.value || response?.data || response;
    
    // Set initial zone info for display
    if (data?.dsoZoneId && data?.dsoZoneName) {
      setSelectedZone({
        id: data.dsoZoneId,
        name: data.dsoZoneName,
      });
      setInitialZoneName(data.dsoZoneName);
    }
    
    return response;
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    // Validate that zone is selected
    if (!selectedZone) {
      throw new Error("Please select a DSO Zone");
    }

    // 1. Get DSOMasterId from token
    let dsOMasterId: number;
    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload
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
      dsoMasterId: dsOMasterId,
      isActive: formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DentalOfficeService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update Dental Office.");
    
    return result;
  };

  const handleModalHide = () => {
    // Reset state when modal closes
    setSelectedZone(null);
    setInitialZoneName("");
    onHide();
  };

  const handleSuccess = () => {
    // Reset state after success
    setSelectedZone(null);
    setInitialZoneName("");
    onSuccess();
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!show) {
      setSelectedZone(null);
      setInitialZoneName("");
      setShowZonePopup(false);
    }
  }, [show]);

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={handleModalHide}
        title="Edit Dental Office"
        subtitle="Update dental office details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        popupHandlers={popupHandlers}
        successMessage="Dental Office updated successfully!"
        onSuccess={handleSuccess}
        size="xl"
      />

      {/* DSO Zone Popup */}
      <DSOZonePopup
        show={showZonePopup}
        onClose={() => setShowZonePopup(false)}
        onSelect={handleZoneSelect}
        showAddButton={true}
      />
    </>
  );
};

export default DentalOfficeEditModal;