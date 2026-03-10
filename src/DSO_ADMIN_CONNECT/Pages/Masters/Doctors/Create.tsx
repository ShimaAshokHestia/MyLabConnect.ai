import React from "react";
import KiduTabbedFormCreateModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import DSODentalOfficePopup from "../Dental Office/DSODentalOfficePopup";

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
          placeholder: "🔍 Select a practice",
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
    // You can add more tabs here if needed (e.g., specialties)
  ];

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    const { headerData, tabData } = data;

    // 1. Get DSOMasterId from token or props
    let dsoMasterId: number;
    try {
      dsoMasterId = externalDsoMasterId || requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload - filter out empty rows and map toggle values
    const practices = (tabData.practices ?? [])
      .filter((row) => row.practiceId && String(row.practiceId).trim() !== "")
      .map((row) => ({
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
      isActive: headerData.isActive ?? true,
      isDeleted: false,
      dsoMasterId: dsoMasterId,
      dsoDentalDoctors: practices,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSODoctorService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create DSO Doctor.");

    // 5. Notify parent
    onSuccess();
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
    />
  );
};

export default DSODoctorCreateModal;