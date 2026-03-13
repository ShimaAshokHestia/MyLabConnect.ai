import React, { useState, useEffect } from "react";
import KiduTabbedFormEditModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormEditModal";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DSOZonePopup from "../../Setup/Zone/DSOZonePopup";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import COUNTRIES from "../../../../Configs/Country";
import CITIES from "../../../../Configs/City";
import toast from "react-hot-toast";

// ── Header fields (same as create page) ───────────────────────────────────────
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
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODentalOfficeEditModal: React.FC<Props> = ({ 
  show, 
  onHide, 
  onSuccess, 
  recordId 
}) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // State for zone popup
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [zonePopupOpen, setZonePopupOpen] = useState(false);
  
  // State for initial data
  const [initialHeaderData, setInitialHeaderData] = useState<Record<string, any>>({});
  const [initialTabData, setInitialTabData] = useState<Record<string, Record<string, any>[]>>({});
  const [loading, setLoading] = useState(false);

  // ── Tab definitions ────────────────────────────────────────────────────────
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

  // ── Fetch existing record when modal opens ────────────────────────────────
  useEffect(() => {
    if (!show || !recordId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching dental office data for ID:", recordId);
        
        const response = await DSODentalOfficeService.getById(Number(recordId));
        console.log("Dental office data response:", response);
        
        await assertApiSuccess(response, "Failed to load dental office data.");

        const data = response.value;
        console.log("Dental office data:", data);

        // Set header data
        setInitialHeaderData({
          officeCode: data.officeCode ?? "",
          officeName: data.officeName ?? "",
          email: data.email ?? "",
          mobileNum: data.mobileNum ?? "",
          postCode: data.postCode ?? "",
          country: data.country ?? "",
          city: data.city ?? "",
          address: data.address ?? "",
          info: data.info ?? "",
          isActive: data.isActive ?? true,
        });

        // Set selected zone from fetched data
        if (data?.dsoZoneId) {
          const zoneData = {
            id: data.dsoZoneId,
            name: data.dsoZoneName || `Zone #${data.dsoZoneId}`
          };
          setSelectedZone(zoneData);
          
          // Set the tab data with the zone info - this is what displays in the input
          setInitialTabData({
            Location: [{
              dsoZoneId: String(data.dsoZoneId),
              dsoZoneIdDisplay: data.dsoZoneName || `Zone #${data.dsoZoneId}`
            }]
          });
        } else {
          // Empty row if no zone
          setInitialTabData({
            Location: [{
              dsoZoneId: "",
              dsoZoneIdDisplay: ""
            }]
          });
        }
        
      } catch (err: any) {
        console.error("Error fetching dental office data:", err);
        onHide();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show, recordId]);

  // ── Reset when modal closes ───────────────────────────────────────────────
  useEffect(() => {
    if (!show) {
      setSelectedZone(null);
      setInitialHeaderData({});
      setInitialTabData({});
    }
  }, [show]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    if (!recordId) return;
    
    const { headerData, tabData } = data;

    console.log("Header Data:", headerData);
    console.log("Tab Data:", tabData);
    console.log("Selected Zone:", selectedZone);

    // Get zone from tabData or selectedZone
    let zoneId = selectedZone?.id;
    
    // If selectedZone is not set, try to get from tabData
    if (!zoneId && tabData.Location && tabData.Location[0] && tabData.Location[0].dsoZoneId) {
      zoneId = tabData.Location[0].dsoZoneId;
    }

    // Validate zone selection
    if (!zoneId) {
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
      id: Number(recordId),
      officeCode: headerData.officeCode,
      officeName: headerData.officeName,
      email: headerData.email ?? "",
      mobileNum: headerData.mobileNum ?? "",
      postCode: headerData.postCode ?? "",
      country: headerData.country ?? "",
      city: headerData.city ?? "",
      dsoZoneId: Number(zoneId),
      address: headerData.address ?? "",
      info: headerData.info ?? "",
      dsoMasterId: dsOMasterId,
      isActive: headerData.isActive ?? true,
    };

    console.log("Submitting payload:", payload);

    // 3. Call API
    let result: any;
    try {
      result = await DSODentalOfficeService.update(Number(recordId), payload);
      console.log("API Response:", result);
    } catch (err) {
      console.error("Error in API call:", err);
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    if (result && result.isSucess) {
      await assertApiSuccess(result, "Failed to update DSO Dental Office.");
    } else {
      console.error("Full error details:", result);
      throw new Error(result?.customMessage || result?.error || "Failed to update dental office");
    }
  };

  // ── Loading overlay ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ 
        position: "fixed", 
        inset: 0, 
        background: "rgba(0,0,0,0.45)", 
        zIndex: 1055, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ 
          color: "#fff", 
          fontSize: "0.9rem", 
          display: "flex", 
          alignItems: "center", 
          gap: 10 
        }}>
          <span style={{ 
            width: 18, 
            height: 18, 
            border: "2px solid rgba(255,255,255,0.35)", 
            borderTopColor: "#fff", 
            borderRadius: "50%", 
            display: "inline-block", 
            animation: "spin 0.65s linear infinite" 
          }} />
          Loading dental office data...
        </div>
      </div>
    );
  }

  return (
    <>
      <KiduTabbedFormEditModal
        show={show}
        onHide={onHide}
        title="Edit Practice"
        headerFields={headerFields}
        tabs={baseTabs}
        onSubmit={handleSubmit}
        submitButtonText="Update Practice"
        themeColor="#ef0d50"
        successMessage="Practice updated successfully!"
        onSuccess={onSuccess}
        initialHeaderData={initialHeaderData}
        initialTabData={initialTabData}
      />

      <DSOZonePopup
        show={zonePopupOpen}
        onClose={() => setZonePopupOpen(false)}
        onSelect={(zone) => {
          console.log("Selected zone:", zone);
          setSelectedZone(zone);
          setZonePopupOpen(false);
          
          // Also update the tab data when zone is selected
          setInitialTabData({
            Location: [{
              dsoZoneId: String(zone.id),
              dsoZoneIdDisplay: zone.name || `Zone #${zone.id}`
            }]
          });
        }}
        showAddButton={true}
      />
    </>
  );
};

export default DSODentalOfficeEditModal;