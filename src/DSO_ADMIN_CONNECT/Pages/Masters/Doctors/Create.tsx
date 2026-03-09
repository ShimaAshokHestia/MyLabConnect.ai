import React from "react";
import KiduTabbedFormCreateModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";


// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  { name: "doctorCode",  label: "Doctor Code",      type: "text",  required: true,  placeholder: "Enter doctor code",               colWidth: 3, maxLength: 200 },
  { name: "firstName",   label: "First Name",        type: "text",  required: true,  placeholder: "Enter first name",                colWidth: 3, maxLength: 200 },
  { name: "lastName",    label: "Last Name",          type: "text",  required: true,  placeholder: "Enter last name",                 colWidth: 3, maxLength: 200 },
  { name: "email",       label: "Email",              type: "email", required: false, placeholder: "Enter email address",             colWidth: 4, maxLength: 100 },
  { name: "phoneNumber", label: "Phone Number",       type: "text",  required: false, placeholder: "Enter phone number",              colWidth: 4, maxLength: 100 },
  { name: "licenseNo",   label: "License No",         type: "text",  required: true,  placeholder: "Enter license number",            colWidth: 4, maxLength: 200 },
  { name: "info",        label: "Specialty / Info",   type: "text",  required: false, placeholder: "Enter specialty or additional info", colWidth: 6, maxLength: 500 },
  { name: "address",     label: "Address",            type: "text",  required: false, placeholder: "Enter address",                   colWidth: 6, maxLength: 500 },
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs: TabConfig[] = [
  {
    key: "practices",
    label: "Practices",
    columns: [
      { key: "practiceId", label: "Practice", type: "text", required: false, placeholder: "Enter practice ID or name" },
    ],
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  practiceOptions?: { value: string; label: string }[];
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODoctorCreateModal: React.FC<Props> = ({ show, onHide, onSuccess, practiceOptions = [] }) => {
  const { requireDSOMasterId }          = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // Inject practiceOptions into the practices tab dynamically
  const resolvedTabs: TabConfig[] = tabs.map((tab) => {
    if (tab.key !== "practices") return tab;
    return {
      ...tab,
      columns: tab.columns.map((col) =>
        col.key === "practiceId" && practiceOptions.length > 0
          ? { ...col, type: "select" as const, options: practiceOptions }
          : col
      ),
    };
  });

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    const { headerData, tabData } = data;

    // 1. Get DSOMasterId from token
    let dsOMasterId: number;
    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
    }

    // 2. Build payload
    const practices = (tabData.practices ?? []).filter(
      (row) => row.practiceId && String(row.practiceId).trim() !== ""
    );

    const payload = {
      id:               0,
      doctorCode:       headerData.doctorCode  ?? "",
      firstName:        headerData.firstName   ?? "",
      lastName:         headerData.lastName    ?? "",
      fullName:         `${headerData.firstName ?? ""} ${headerData.lastName ?? ""}`.trim(),
      email:            headerData.email       ?? "",
      phoneNumber:      headerData.phoneNumber ?? "",
      licenseNo:        headerData.licenseNo   ?? "",
      info:             headerData.info        ?? "",
      address:          headerData.address     ?? "",
      isActive:         headerData.isActive    ?? true,
      isDeleted:        false,
      dsoMasterId:      dsOMasterId!,
      dsoDentalDoctors: practices.map((row) => ({
        id: 0, dSODentalOfficeId: Number(row.practiceId), dSODoctorId: 0, isActive: true, isDeleted: false,
      })),
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSODoctorService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
    }

    // 4. Assert success (shows toast + Swal and throws on failure)
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
      tabs={resolvedTabs}
      onSubmit={handleSubmit}
      submitButtonText="Create Doctor"
    />
  );
};

export default DSODoctorCreateModal;