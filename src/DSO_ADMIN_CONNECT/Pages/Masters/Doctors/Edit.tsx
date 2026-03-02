import React, { useState, useEffect } from "react";
import KiduTabbedFormEditModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormEditModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  {
    name: "doctorCode",
    label: "Doctor Code",
    type: "text",
    required: true,
    placeholder: "Enter doctor code",
    colWidth: 4,
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "Enter first name",
    colWidth: 4,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    placeholder: "Enter last name",
    colWidth: 4,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: false,
    placeholder: "Enter email address",
    colWidth: 4,
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text",
    required: false,
    placeholder: "Enter phone number",
    colWidth: 4,
  },
  {
    name: "licenseNo",
    label: "License No",
    type: "text",
    required: false,
    placeholder: "Enter license number",
    colWidth: 4,
  },
  {
    name: "info",
    label: "Specialty / Info",
    type: "text",
    required: false,
    placeholder: "Enter specialty or additional info",
    colWidth: 6,
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    required: false,
    placeholder: "Enter address",
    colWidth: 6,
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
  recordId: number | null;
  practiceOptions?: { value: string; label: string }[];
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODoctorEditModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  recordId,
  practiceOptions = [],
}) => {
  const [initialHeaderData, setInitialHeaderData] = useState<Record<string, any>>({});
  const [initialTabData,    setInitialTabData]    = useState<Record<string, Record<string, any>[]>>({
    practices: [{ practiceId: "" }],
  });
  const [loading, setLoading] = useState(false);

  // ── Inject practiceOptions into the practices tab if provided ─────────────
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

  // ── Fetch existing record when modal opens ────────────────────────────────
  useEffect(() => {
    if (!show || !recordId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await DSODoctorService.getById(recordId);

        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load data");
        }

        const data = response.value;

        // ── Map fetched data → header fields ──────────────────────────────
        setInitialHeaderData({
          doctorCode:  data.doctorCode  ?? "",
          firstName:   data.firstName   ?? "",
          lastName:    data.lastName    ?? "",
          email:       data.email       ?? "",
          phoneNumber: data.phoneNumber ?? "",
          licenseNo:   data.licenseNo   ?? "",
          info:        data.info        ?? "",
          address:     data.address     ?? "",
          isActive:    data.isActive    ?? true,
        });

        // ── Map fetched practices → tab rows ──────────────────────────────
        const practiceRows: Record<string, any>[] =
          Array.isArray(data.practices) && data.practices.length > 0
            ? data.practices.map((p: any) => ({
                practiceId: p.practiceId ?? p.id ?? "",
              }))
            : [{ practiceId: "" }];

        setInitialTabData({ practices: practiceRows });

      } catch (error: any) {
        console.error("Failed to load DSO Doctor:", error);
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
      setInitialHeaderData({});
      setInitialTabData({ practices: [{ practiceId: "" }] });
    }
  }, [show]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    if (!recordId) return;

    const { headerData, tabData } = data;

    // Filter out empty practice rows
    const practices = (tabData.practices ?? []).filter(
      (row) => row.practiceId && String(row.practiceId).trim() !== ""
    );

    const result = await DSODoctorService.update(recordId, {
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
    });

    if (!result || !result.isSucess) {
      throw new Error(result?.customMessage || result?.error || "Failed to update DSO Doctor");
    }

    onSuccess();
  };

  // ── Loading state — don't mount the modal until data is ready ────────────
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1055,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#fff", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 18,
              height: 18,
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.65s linear infinite",
            }}
          />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <KiduTabbedFormEditModal
      show={show}
      onHide={onHide}
      title="Edit DSO Doctor"
      headerFields={headerFields}
      tabs={resolvedTabs}
      onSubmit={handleSubmit}
      submitButtonText="Update Doctor"
      initialHeaderData={initialHeaderData}
      initialTabData={initialTabData}
    />
  );
};

export default DSODoctorEditModal;
