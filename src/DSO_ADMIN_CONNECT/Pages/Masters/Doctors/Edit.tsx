import React, { useState, useEffect } from "react";
import KiduTabbedFormEditModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormEditModal";
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
  recordId: number | null;
  dsoMasterId?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODoctorEditModal: React.FC<Props> = ({ 
  show, 
  onHide, 
  onSuccess, 
  recordId,
  dsoMasterId: externalDsoMasterId 
}) => {
  const [initialHeaderData, setInitialHeaderData] = useState<Record<string, any>>({});
  const [initialTabData, setInitialTabData] = useState<Record<string, Record<string, any>[]>>({ 
    practices: [] 
  });
  const [loading, setLoading] = useState(false);

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
  ];

  // ── Fetch existing record when modal opens ────────────────────────────────
  useEffect(() => {
    if (!show || !recordId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching doctor data for ID:", recordId);
        
        const response = await DSODoctorService.getById(recordId);
        console.log("Doctor data response:", response);
        
        await assertApiSuccess(response, "Failed to load doctor data.");

        const data = response.value;
        console.log("Doctor data:", data);

        // Set header data
        setInitialHeaderData({
          doctorCode: data.doctorCode ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phoneNumber: data.phoneNumber ?? "",
          licenseNo: data.licenseNo ?? "",
          info: data.info ?? "",
          address: data.address ?? "",
          isActive: data.isActive ?? true,
        });

        // Map practices data
        let practiceRows: Record<string, any>[] = [];
        
        if (Array.isArray(data.dsoDentalDoctors) && data.dsoDentalDoctors.length > 0) {
          practiceRows = data.dsoDentalDoctors.map((p: any) => {
            // Find the matching dental office to get display details
            const practiceId = p.dSODentalOfficeId ? String(p.dSODentalOfficeId) : "";
            
            return { 
              practiceId: practiceId,
              practiceIdDisplay: p.dentalOfficeName || p.officeName || `Practice #${practiceId}`,
              isPrimary: p.isPrimary ?? false,
              isActive: p.isActive ?? true,
              id: p.id ?? 0
            };
          });
        } else {
          // Add an empty row so the practice field shows immediately
          practiceRows = [{ 
            practiceId: "",
            practiceIdDisplay: "",
            isPrimary: false,
            isActive: true,
            id: 0
          }];
        }

        console.log("Mapped practice rows:", practiceRows);
        setInitialTabData({ practices: practiceRows });
        
      } catch (err: any) {
        console.error("Error fetching doctor data:", err);
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
      setInitialTabData({ practices: [] });
    }
  }, [show]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    if (!recordId) return;
    
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
        id: row.id ?? 0,
        dSODentalOfficeId: Number(row.practiceId),
        dSODoctorId: recordId,
        isPrimary: row.isPrimary ?? false,
        isActive: row.isActive ?? true,
        isDeleted: false,
      }));

    const payload = {
      id: recordId,
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

    console.log("Submit payload:", payload);

    // 3. Call API
    let result: any;
    try {
      result = await DSODoctorService.update(recordId, payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update DSO Doctor.");

    // 5. Notify parent
    onSuccess();
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
          Loading doctor data...
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
      tabs={baseTabs}
      onSubmit={handleSubmit}
      submitButtonText="Update Doctor"
      initialHeaderData={initialHeaderData}
      initialTabData={initialTabData}
      themeColor="#ef0d50"
    />
  );
};

export default DSODoctorEditModal;