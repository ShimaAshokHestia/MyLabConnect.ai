import React, { useState } from "react";
import KiduTabbedFormCreateModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormCreateModal";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DSOZonePopup from "../../Setup/Zone/DSOZonePopup";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import COUNTRIES from "../../../../Configs/Country";
import CITIES from "../../../../Configs/City";
import toast from "react-hot-toast";

// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  { name: "officeCode", label: "Office Code", type: "text", required: true, placeholder: "Enter office code", colWidth: 3, maxLength: 50 },
  { name: "officeName", label: "Office Name", type: "text", required: true, placeholder: "Enter office name", colWidth: 4, maxLength: 100 },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email", colWidth: 4, maxLength: 150 },
  { name: "mobileNum", label: "Mobile Number", type: "number", required: true, placeholder: "Enter mobile number", colWidth: 3, maxLength: 20 },
  { name: "postCode", label: "Post Code", type: "number", required: true, placeholder: "Enter post code", colWidth: 4, maxLength: 20 },
  { 
    name: "country", 
    label: "Country", 
    type: "select", 
    required: true, 
    placeholder: "Select country", 
    colWidth: 4,
    options: COUNTRIES.map(c => ({ value: c.value, label: c.label }))
  },
  { 
    name: "city", 
    label: "City", 
    type: "select", 
    required: true, 
    placeholder: "Select City", 
    colWidth: 4,
    options: CITIES.map(c => ({ value: c.value, label: c.label }))
  },
  { name: "dsoZoneId", label: "Zone", type: "popup", required: true, placeholder: "Select zone", colWidth: 4 },
  { name: "address", label: "Address", type: "textarea", required: true, placeholder: "Enter address", colWidth: 4, maxLength: 255 },
  { name: "info", label: "Additional Info", type: "textarea", required: false, placeholder: "Enter additional info", colWidth: 4, maxLength: 500 },
  // isActive is handled by the header toggle, not as a field
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODentalOfficeCreateModal: React.FC<Props> = ({ 
  show, 
  onHide, 
  onSuccess 
}) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // State for zone popup
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [zonePopupOpen, setZonePopupOpen] = useState(false);

  // ── Tab definitions ────────────────────────────────────────────────────────
  // Since all fields are in header, we don't need any tabs
  const baseTabs: TabConfig[] = [
    {
      key: "Location",
      label:"Location",
      addButtonLabel: "Add Location",
      columns: [
        {
          key:"Map Url",
          label:"Map Url",
          type:"popup",
          placeholder:"Select Map"
        }
      ]
    },
     {
      key: "Address",
      label:"Change Address",
      addButtonLabel: "Add Address",
      columns: [
        {
          key:"Location",
          label:"Location",
          type:"popup",
          placeholder:"Select Location"
        }
      ]
    }
  ];

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    const { headerData } = data;

    console.log("Header Data:", headerData);
    console.log("Selected Zone:", selectedZone);

    // Validate zone selection
    if (!selectedZone?.id) {
      toast.error("Please select a zone");
      throw new Error("No zone selected");
    }

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
    const payload: Partial<DSODentalOffice> = {
      officeCode: headerData.officeCode,
      officeName: headerData.officeName,
      email: headerData.email ?? "",
      mobileNum: headerData.mobileNum ?? "",
      postCode: headerData.postCode ?? "",
      country: headerData.country ?? "",
      city: headerData.city ?? "",
      dsoZoneId: selectedZone?.id ? Number(selectedZone.id) : undefined,
      address: headerData.address ?? "",
      info: headerData.info ?? "",
      dsoMasterId: dsOMasterId,
      isActive: headerData.isActive ?? true,
    };

    console.log("Submitting payload:", payload);

    // 3. Call API
    let result: any;
    try {
      result = await DSODentalOfficeService.create(payload);
      console.log("API Response:", result);
    } catch (err) {
      console.error("Error in API call:", err);
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    if (result && result.isSucess) {
      await assertApiSuccess(result, "Failed to create DSO Dental Office.");
    } else {
      console.error("Full error details:", result);
      throw new Error(result?.customMessage || result?.error || "Failed to create dental office");
    }
  };

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleHide = () => {
    setSelectedZone(null);
    onHide();
  };

  // ── Handle successful creation ────────────────────────────────────────────
  const handleSuccess = () => {
    console.log("Creation successful, calling onSuccess");
    setSelectedZone(null);
    onSuccess();
  };

  return (
    <>
      <KiduTabbedFormCreateModal
        show={show}
        onHide={handleHide}
        title="Create Practice"
        headerFields={headerFields}
        tabs={baseTabs}
        onSubmit={handleSubmit}
        submitButtonText="Create Practice"
        themeColor="#ef0d50"
        successMessage="Practice created successfully!"
        onSuccess={handleSuccess}
      />

      <DSOZonePopup
        show={zonePopupOpen}
        onClose={() => setZonePopupOpen(false)}
        onSelect={(zone) => {
          console.log("Selected zone:", zone);
          setSelectedZone(zone);
          setZonePopupOpen(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DSODentalOfficeCreateModal;