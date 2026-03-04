import React from "react";
import KiduTabbedFormCreateModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  {
    name: "doctorCode",
    label: "Doctor Code",
    type: "text",
    required: true,
    placeholder: "Enter doctor code",
    colWidth: 3,
    maxLength: 200,
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "Enter first name",
    colWidth: 3,
    maxLength: 200,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    placeholder: "Enter last name",
    colWidth: 3,
    maxLength: 200,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: false,
    placeholder: "Enter email address",
    colWidth: 4,
    maxLength: 100,
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text",
    required: false,
    placeholder: "Enter phone number",
    colWidth: 4,
    maxLength: 100,
  },
  {
    name: "licenseNo",
    label: "License No",
    type: "text",
    required: true,
    placeholder: "Enter license number",
    colWidth: 4,
    maxLength: 200,
  },
  {
    name: "info",
    label: "Specialty / Info",
    type: "text",
    required: false,
    placeholder: "Enter specialty or additional info",
    colWidth: 6,
    maxLength: 500,
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    required: false,
    placeholder: "Enter address",
    colWidth: 6,
    maxLength: 500,
  },
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs: TabConfig[] = [
  {
    key: "practices",
    label: "Practices",
    columns: [
      {
        key: "practiceId",
        label: "Practice",
        type: "text",
        required: true,
        placeholder: "Enter practice ID or name",
      },
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
const DSODoctorCreateModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  practiceOptions = [],
}) => {

  // Inject practiceOptions into the practices tab dynamically
  const resolvedTabs: TabConfig[] = tabs.map((tab) => {
    if (tab.key !== "practices") return tab;
    return {
      ...tab,
      columns: tab.columns.map((col) => {
        if (col.key !== "practiceId") return col;
        return practiceOptions.length > 0
          ? { ...col, type: "select" as const, options: practiceOptions }
          : col;
      }),
    };
  });

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    const { headerData, tabData } = data;

    // Filter out empty practice rows
    const practices = (tabData.practices ?? []).filter(
      (row) => row.practiceId && String(row.practiceId).trim() !== ""
    );

    const result = await DSODoctorService.create({
      doctorCode:  headerData.doctorCode,
      firstName:   headerData.firstName,
      lastName:    headerData.lastName,
      fullName:    `${headerData.firstName} ${headerData.lastName}`,
      email:       headerData.email       || undefined,
      phoneNumber: headerData.phoneNumber || undefined,
      licenseNo:   headerData.licenseNo   || undefined,
      info:        headerData.info        || undefined,
      address:     headerData.address     || undefined,
      isActive:    headerData.isActive    ?? true,
      isDeleted:   false,
    });

    if (!result || !result.isSucess) {
      throw new Error(result?.customMessage || result?.error || "Failed to create DSO Doctor");
    }

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