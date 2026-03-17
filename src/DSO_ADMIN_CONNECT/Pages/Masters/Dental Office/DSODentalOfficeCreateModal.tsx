// src/Pages/Masters/DentalOffice/Create.tsx

import React, { useRef } from "react";
import KiduCreateModal, {
  type Field,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import DentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import type { DentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";

interface Props {
  show: boolean;
  handleClose: () => void;
  onAdded: (item: DentalOffice) => void;
  dsoZoneOptions?: Array<{ value: number; label: string }>;
  dsoMasterOptions?: Array<{ value: number; label: string }>;
}

// ── Field definitions ─────────────────────────────────────────────────────────
const fields: Field[] = [
  {
    name: "officeCode",
    rules: { type: "text", label: "Office Code", required: true, maxLength: 50, colWidth: 6 },
  },
  {
    name: "officeName",
    rules: { type: "text", label: "Office Name", required: true, maxLength: 100, colWidth: 6 },
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
    name: "dsoZoneId",
    rules: { type: "select", label: "DSO Zone", required: true, colWidth: 6 },
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

// ── Component ─────────────────────────────────────────────────────────────────
const DentalOfficeCreateModal: React.FC<Props> = ({ 
  show, 
  handleClose, 
  onAdded,
  dsoZoneOptions = [],
}) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();
  const createdDataRef = useRef<any>(null);

  // Prepare options for select fields
  const options = {
    dsoZoneId: dsoZoneOptions,
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);

    try {
      // 1. Get DSOMasterId from token
      let dsOMasterId: number;
      try {
        dsOMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsOMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // 2. Build payload
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
        dsoZoneId: Number(formData.dsoZoneId),
        info: formData.info || "",
        dsoMasterId: dsOMasterId, // Use from token, not from form
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      // 3. Call API
      const result = await DentalOfficeService.create(payload);
      console.log("API Response:", result);

      // 4. Store result in ref for later use
      createdDataRef.current = result;

      // 5. Assert success
      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Dental Office.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create dental office");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  const handleSuccess = () => {
    const response = createdDataRef.current;
    const newItem = response?.value || response?.data || response;
    if (newItem) {
      onAdded(newItem);
    }
    createdDataRef.current = null;
    handleClose();
  };

  const handleHide = () => {
    handleClose();
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={handleHide}
      title="Add Dental Office"
      subtitle="Create a new dental office"
      fields={fields}
      options={options}
      onSubmit={handleSubmit}
      successMessage="Dental Office created successfully!"
      onSuccess={handleSuccess}
      size="xl"
    />
  );
};

export default DentalOfficeCreateModal;