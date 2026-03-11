import React from "react";
import KiduTabbedFormCreateModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import DSODentalOfficePopup from "../Dental Office/DSODentalOfficePopup";
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
          key: "practiceId", 
          label: "Practice", 
          type: "popup",
          required: true,
          placeholder: "Select a practice",
          popupConfig: {
            component: DSODentalOfficePopup,
            props: {
              dsoMasterId: externalDsoMasterId,
              showAddButton: true
            },
            mapValue: (selected: any) => ({
              value: String(selected.id),
              display: `${selected.officeCode} - ${selected.officeName}`
            })
          }
        },
      ],
    },
     {
      key: "lab",
      label: "Lab",
      addButtonLabel: "Add Lab",
      columns: [
        { 
          key: "labId", 
          label: "Lab", 
          type: "popup",
          required: true,
          placeholder: "Select a Lab",
          popupConfig: {
            component: DSODentalOfficePopup,
            props: {
              dsoMasterId: externalDsoMasterId,
              showAddButton: true
            },
            mapValue: (selected: any) => ({
              value: String(selected.id),
              display: `${selected.officeCode} - ${selected.officeName}`
            })
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

    // Validate at least one practice is selected
    const practiceRows = tabData.practices ?? [];
    const validPractices = practiceRows.filter(
      (row) => row.practiceId && String(row.practiceId).trim() !== ""
    );

    if (validPractices.length === 0) {
      toast.error("Please add at least one practice");
      throw new Error("No practices added");
    }

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

    // 2. Build payload - filter out empty rows and map toggle values
    const practices = validPractices.map((row) => ({
      id: 0,
      dSODentalOfficeId: Number(row.practiceId),
      dSODoctorId: 0,
      isPrimary: row.isPrimary ?? false,
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
      isActive: headerData.isActive ?? true, // This comes from the header toggle
      isDeleted: false,
      dsoMasterId: dsoMasterId,
      dsoDentalDoctors: practices,
    };

    console.log("Submitting payload:", payload);

    // 3. Call API
    let result: any;
    try {
      result = await DSODoctorService.create(payload);
      console.log("API Response:", result);
    } catch (err) {
      console.error("Error in API call:", err);
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success - this will throw if not successful
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
      title="Create DSO Doctor"
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