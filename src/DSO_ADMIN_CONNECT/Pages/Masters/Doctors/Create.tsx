import React from "react";
import KiduTabbedFormCreateModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import { API_ENDPOINTS } from "../../../../CONSTANTS/API_ENDPOINTS";
import toast from "react-hot-toast";

// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  { name: "doctorCode", label: "Doctor Code", type: "text", required: true, placeholder: "Enter doctor code", colWidth: 3, maxLength: 200 },
  { name: "firstName", label: "First Name", type: "text", required: true, placeholder: "Enter first name", colWidth: 4, maxLength: 200 },
  { name: "lastName", label: "Last Name", type: "text", required: true, placeholder: "Enter last name", colWidth: 4, maxLength: 200 },
  { name: "email", label: "Email", type: "email", required: false, placeholder: "Enter email address", colWidth: 4, maxLength: 100 },
  { name: "phoneNumber", label: "Phone Number", type: "number", required: false, placeholder: "Enter phone number", colWidth: 4, maxLength: 100 },
  { name: "licenseNo", label: "License No", type: "text", required: true, placeholder: "Enter license number", colWidth: 3, maxLength: 200 },
  { name: "info", label: "Specialty / Info", type: "text", required: false, placeholder: "Enter specialty or additional info", colWidth: 4, maxLength: 500 },
  { name: "address", label: "Address", type: "text", required: false, placeholder: "Enter address", colWidth: 6, maxLength: 500 },
  // isActive is handled by the header toggle, not as a field
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  dsoMasterId?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODoctorCreateModal: React.FC<Props> = ({ 
  show, 
  onHide, 
  onSuccess, 
  dsoMasterId: externalDsoMasterId 
}) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Tab definitions with popup for practice selection ─────────────────────
  const baseTabs: TabConfig[] = [
    {
      key: "practices",
      label: "Practices",
      addButtonLabel: "Add Practice",
      columns: [
        { 
          key: "Practice", 
          label: "Practice", 
          type: "popup",
          required: true,
          placeholder: "Select a practice",
          popupConfig: {
            fetchEndpoint: externalDsoMasterId 
              ? `${API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL}?dsoMasterId=${externalDsoMasterId}`
              : API_ENDPOINTS.DSO_DENTAL_OFFICE.GET_ALL,
            columns: [
              { key: "officeCode", label: "Code", filterType: "text" },
              { key: "officeName", label: "Name", filterType: "text" },
              { 
                key: "isActive", 
                label: "Status", 
                filterType: "select", 
                filterOptions: ["true", "false"],
                render: (value: boolean) => (
                  <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
                    {value ? "Active" : "Inactive"}
                  </span>
                )
              }
            ],
            searchKeys: ["officeCode", "officeName"],
            idKey: "id",
            labelKey: "officeName",
            showAddButton: false,
          }
        },
      ],
    },
    {
      key: "lab", // This matches the key in tabData
      label: "Lab",
      addButtonLabel: "Add Lab",
      columns: [
        { 
          key: "Lab", 
          label: "Lab", 
          type: "popup",
          required: true,
          placeholder: "Select a lab",
          popupConfig: {
            fetchEndpoint: externalDsoMasterId 
              ? `${API_ENDPOINTS.LAB_MASTER.GET_ALL}?dsoMasterId=${externalDsoMasterId}`
              : API_ENDPOINTS.LAB_MASTER.GET_ALL,
            columns: [
              { key: "labCode", label: "Lab Code", filterType: "text" },
              { key: "labName", label: "Lab Name", filterType: "text" },
              { key: "displayName", label: "Display Name", filterType: "text" },
              { key: "email", label: "Email", filterType: "text" },
              { 
                key: "isActive", 
                label: "Status", 
                filterType: "select", 
                filterOptions: ["true", "false"],
                render: (value: boolean) => (
                  <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
                    {value ? "Active" : "Inactive"}
                  </span>
                )
              }
            ],
            searchKeys: ["labCode", "labName", "displayName", "email"],
            idKey: "id",
            labelKey: "labName",
            showAddButton: false,
          }
        },
      ],
    },
  ];

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    const { headerData, tabData } = data;

    console.log("Header Data:", headerData);
    console.log("Tab Data:", tabData);

    // Get practices from tabData
    const practiceRows = tabData.practices ?? [];
    
    // Filter valid practices (those with Practice value)
    const validPractices = practiceRows.filter(
      (row) => row.Practice && String(row.Practice).trim() !== ""
    );

    console.log("Valid practices:", validPractices);

    if (validPractices.length === 0) {
      toast.error("Please add at least one practice");
      throw new Error("No practices added");
    }

    // Get labs from tabData using the correct key "lab" (not "labs")
    const labRows = tabData.lab ?? [];
    
    // Filter valid labs (those with Lab value)
    const validLabs = labRows.filter(
      (row) => row.Lab && String(row.Lab).trim() !== ""
    );

    console.log("Valid labs:", validLabs);

    // Optional: Validate labs if they're required
    // if (validLabs.length === 0) {
    //   toast.error("Please add at least one lab");
    //   throw new Error("No labs added");
    // }

    // 1. Get DSOMasterId from token or props
    let dsoMasterId: number;
    try {
      dsoMasterId = externalDsoMasterId || requireDSOMasterId();
      console.log("DSO Master ID:", dsoMasterId);
    } catch (err) {
      console.error("Failed to get DSO Master ID:", err);
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload - map practices to dsoDentalDoctors array
    const practices = validPractices.map((row) => ({
      id: 0,
      dsoDentalOfficeId: Number(row.Practice),
      dsoDoctorId: 0,
      isPrimary: row.isPrimary ?? false,
      isActive: row.isActive ?? true,
      isDeleted: false,
    }));

    // 3. Build payload - map labs to labMappings array
    const labMappings = validLabs.map((row) => ({
      id: 0,
      labMasterId: Number(row.Lab),
      dsoDoctorId: 0,
      labName: row.labName || "",
      labDescription: row.labDescription || "",
      isActive: row.isActive ?? true,
      isDeleted: false,
    }));

    const payload = {
      id: 0,
      doctorCode: headerData.doctorCode ?? "",
      firstName: headerData.firstName ?? "",
      lastName: headerData.lastName ?? "",
      fullName: `${headerData.firstName ?? ""} ${headerData.lastName ?? ""}`.trim(),
      email: headerData.email ?? "",
      phoneNumber: headerData.phoneNumber ?? "",
      licenseNo: headerData.licenseNo ?? "",
      info: headerData.info ?? "",
      address: headerData.address ?? "",
      isActive: headerData.isActive ?? true,
      isDeleted: false,
      dsoMasterId: dsoMasterId,
      dsoDentalDoctors: practices,
      labMappings: labMappings, // Add lab mappings to payload
    };

    console.log("Submitting payload:", payload);

    // 4. Call API
    let result: any;
    try {
      result = await DSODoctorService.create(payload);
      console.log("API Response:", result);
    } catch (err) {
      console.error("Error in API call:", err);
      await handleApiError(err, "network");
      return;
    }

    // 5. Assert success
    if (result && result.isSucess) {
      await assertApiSuccess(result, "Failed to create DSO Doctor.");
    } else {
      console.error("Full error details:", result);
      throw new Error(result?.customMessage || result?.error || "Failed to create doctor");
    }
  };

  return (
    <KiduTabbedFormCreateModal
      show={show}
      onHide={onHide}
      title="Create Doctor"
      headerFields={headerFields}
      tabs={baseTabs}
      onSubmit={handleSubmit}
      submitButtonText="Create Doctor"
      themeColor="#ef0d50"
      successMessage="DSO Doctor created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSODoctorCreateModal;