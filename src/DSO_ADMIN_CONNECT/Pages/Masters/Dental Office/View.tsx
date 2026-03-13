import React from "react";
import KiduTabbedFormViewModal, {
  type ViewHeaderField,
  type ViewTabConfig,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormViewModal";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";

// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: ViewHeaderField[] = [
  { name: "officeCode", label: "Office Code", colWidth: 3 },
  { name: "officeName", label: "Office Name", colWidth: 4 },
  { name: "email", label: "Email", colWidth: 4 },
  { name: "mobileNum", label: "Mobile Number", colWidth: 3 },
  { name: "postCode", label: "Post Code", colWidth: 4 },
  { name: "country", label: "Country", colWidth: 4 },
  { name: "city", label: "City", colWidth: 4 },
  { name: "dsoZoneName", label: "Zone", colWidth: 4, displayName: "dsoZoneName" },
  { name: "address", label: "Address", colWidth: 4, isTextarea: true },
  { name: "info", label: "Additional Info", colWidth: 4, isTextarea: true },
  // isActive is handled by the header toggle
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs: ViewTabConfig[] = [
  {
      key: "Location",
      label:"Location",
      columns: [
        {
          key:"Map Url",
          label:"Map Url",
        }
      ]
    },
     {
      key: "Address",
      label:"Change Address",
      columns: [
        {
          key:"Location",
          label:"Location",
        }
      ]
    }
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODentalOfficeViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduTabbedFormViewModal
      show={show}
      onHide={onHide}
      title="View Practice"
      //subtitle="DSO Dental Office details"
      headerFields={headerFields}
      tabs={tabs}
      recordId={recordId}
      onFetch={(id) => DSODentalOfficeService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
      themeColor="#ef0d50"
      mapTabData={(data) => {
        console.log("Mapping data for view:", data);
        
        // Map location data for the tab
        const locationData = [];
        
        // Add a row with location information
        if (data.country || data.city || data.dsoZoneName) {
          locationData.push({
            country: data.country || "",
            city: data.city || "",
            zoneName: data.dsoZoneName || "",
            dsoZoneName: data.dsoZoneName || "",
          });
        }
        
        return {
          location: locationData,
        };
      }}
    />
  );
};

export default DSODentalOfficeViewModal;