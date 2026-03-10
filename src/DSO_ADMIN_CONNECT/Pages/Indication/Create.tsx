import React, { useState } from "react";
import KiduCreateModal, {
  type Field,
  type PopupHandlers,
} from "../../../KIDU_COMPONENTS/KiduCreateModal";

import type { DSOIndication } from "../../Types/Setup/DSOIndication.types";
import type { DSOProsthesisType } from "../../Types/Prosthesis/Prosthesis.types";

import DSOIndicationService from "../../Services/Setup/DSOIndication.services";

import DSOProsthesisTypePopup from "../Prosthesis/ProsthesisTypePopup";

import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../Services/AuthServices/APIErrorHandler.services";
import toast from "react-hot-toast";


// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  {
    name: "name",
    rules: {
      type: "text",
      label: "Indication Name",
      required: true,
      minLength: 3,
      maxLength: 100,
      colWidth: 12,
    },
  },
  {
    name: "dsoProthesisTypeId",
    rules: {
      type: "popup",
      label: "Prosthesis Type",
      required: true,
      colWidth: 6,
    },
  },
  {
    name: "isActive",
    rules: {
      type: "toggle",
      label: "Active",
      colWidth: 6,
    },
  },
];


// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}


// ── Component ─────────────────────────────────────────────────────────────────

const DSOIndicationCreateModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
}) => {

  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  const [selectedProsthesis, setSelectedProsthesis] =
    useState<DSOProsthesisType | null>(null);

  const [prosthesisOpen, setProsthesisOpen] = useState(false);
  


  // ── Popup handlers ────────────────────────────────────────────────────────

  const popupHandlers: PopupHandlers = {
    dsoProthesisTypeId: {
      value: selectedProsthesis?.name ?? "",
      onOpen: () => setProsthesisOpen(true),
      onClear: () => setSelectedProsthesis(null),
    },
  };

  const extraValues = {
    dsoProthesisTypeId: selectedProsthesis?.id ?? null,
  };


  // ── Submit handler ────────────────────────────────────────────────────────

  const handleSubmit = async (formData: Record<string, any>) => {
    console.log("Form Data received:", formData);
    console.log("Selected Prosthesis:", selectedProsthesis);

    if (!selectedProsthesis?.id) {
      console.error("No prosthesis selected");
      toast.error("Please select a prosthesis type");
      return;
    }

    try {
      //  Get DSOMasterId from session
      let dsOMasterId: number;
      try {
        dsOMasterId = requireDSOMasterId();
        console.log("DSO Master ID:", dsOMasterId);
      } catch (err) {
        console.error("Failed to get DSO Master ID:", err);
        await handleApiError(err, "session");
        return;
      }

      //  Build payload
      const payload: Partial<DSOIndication> = {
        name:               formData.name,
        dsoProthesisTypeId: Number(selectedProsthesis.id),
        dsoMasterId:        dsOMasterId,
        isActive:           formData.isActive ?? true,
      };

      console.log("Submitting payload:", payload);

      
      const result = await DSOIndicationService.create(payload);
      console.log("API Response:", result);

      if (result && result.isSucess) {
        await assertApiSuccess(result, "Failed to create Indication.");
      } else {
        console.error("Full error details:", result);
        throw new Error(result?.customMessage || result?.error || "Failed to create Indication");
      }

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      await handleApiError(err, "network");
      throw err;
    }
  };


  

  const handleHide = () => {
    setSelectedProsthesis(null);
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────

  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedProsthesis(null);
    onSuccess();
  };


  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={handleHide}
        title="Create Indication"
        subtitle="Add a new DSO Indication"
        fields={fields}
        onSubmit={handleSubmit}
        popupHandlers={popupHandlers}
        extraValues={extraValues}
        successMessage="Indication created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOProsthesisTypePopup
        show={prosthesisOpen}
        onClose={() => setProsthesisOpen(false)}
        onSelect={(prosthesis) => {
          console.log("Selected prosthesis:", prosthesis);
          setSelectedProsthesis(prosthesis);
          setProsthesisOpen(false);
        }}
      />
    </>
  );
};

export default DSOIndicationCreateModal;