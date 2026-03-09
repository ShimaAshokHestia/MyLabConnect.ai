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

    //  Get DSOMasterId from session
    let dsOMasterId: number;

    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    //  Build payload
    const payload: Partial<DSOIndication> = {
      name: formData.name,
      dsoProthesisTypeId: selectedProsthesis?.id,
      dsoMasterId: dsOMasterId,
      isActive: formData.isActive ?? true,
    };

    // 3Call API
    let result: any;

    try {
      result = await DSOIndicationService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    //  Validate response
    await assertApiSuccess(result, "Failed to create Indication.");
  };


  // ── Reset on close ────────────────────────────────────────────────────────

  const handleHide = () => {
    setSelectedProsthesis(null);
    onHide();
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
        onSuccess={onSuccess}
      />

      <DSOProsthesisTypePopup
        show={prosthesisOpen}
        onClose={() => setProsthesisOpen(false)}
        onSelect={(prosthesis) => {
          setSelectedProsthesis(prosthesis);
          setProsthesisOpen(false);
        }}
      />
    </>
  );
};

export default DSOIndicationCreateModal;