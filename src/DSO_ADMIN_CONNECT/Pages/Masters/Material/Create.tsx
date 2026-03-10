import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOMaterial } from "../../../Types/Masters/DsoMaterial.types";
import DSOMaterialService from "../../../Services/Masters/DsoMaterial.services";
import DSORestorationTypePopup from "../../Restoration/DSORestorationTypePopup";
import type { DSORestoration } from "../../../Types/Restoration/Restoration.types";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "name", rules: { type: "text", label: "Material Name", required: true, minLength: 3, maxLength: 100, colWidth: 6 } },
  { name: "dsoRestorationTypeId", rules: { type: "popup", label: "Restoration Type", required: true, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

const DSOMaterialCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  const [selectedRestorationType, setSelectedRestorationType] = useState<DSORestoration | null>(null);
  const [restorationTypeOpen, setRestorationTypeOpen] = useState(false);

  const popupHandlers: PopupHandlers = {
    dsoRestorationTypeId: {
      value: selectedRestorationType?.name ?? "",
      onOpen: () => setRestorationTypeOpen(true),
      onClear: () => setSelectedRestorationType(null),
    },
  };

  const extraValues = {
    dsoRestorationTypeId: selectedRestorationType?.id ?? null,
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);
    console.log("Selected Restoration Type:", selectedRestorationType);

    if (!selectedRestorationType?.id) {
      toast.error("Please select a restoration type");
      return;
    }

    try {
      // Get DSOMasterId from session
      let dsoMasterId: number;
      try {
        dsoMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsoMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      // Build payload
      const payload: Partial<DSOMaterial> = {
        name: formData.name,
        dsoRestorationTypeId: Number(selectedRestorationType.id),
        dsoMasterId: dsoMasterId,
        isActive: formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      const result = await DSOMaterialService.create(payload);
      console.log("API Response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Material.");
        // Success! The modal will show the success message
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create material");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };

  const handleHide = () => {
    setSelectedRestorationType(null);
    onHide();
  };

  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedRestorationType(null);
    onSuccess();
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Material"
        subtitle="Add a new material"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Material created successfully!"
        onSuccess={handleSuccess}
      />

      <DSORestorationTypePopup
        show={restorationTypeOpen}
        onClose={() => setRestorationTypeOpen(false)}
        onSelect={(type) => {
          console.log("Selected restoration type:", type);
          setSelectedRestorationType(type);
          setRestorationTypeOpen(false);
        }}
      />
    </>
  );
};

export default DSOMaterialCreateModal;