// src/Pages/Masters/DSODoctor/Edit.tsx

import React, { useState, useEffect } from "react";
import KiduTabbedFormEditModal, {
  type TabConfig,
  type TabbedFormField,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormEditModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import toast from "react-hot-toast";
import DSOZonePopup from "../../Setup/Zone/DSOZonePopup";
import LabMasterPopup from "../../Masters/Lab/DSOLabMasterPopup"; // You'll need to create this

// ── Header fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  { name: "doctorCode", label: "Doctor Code", type: "text", required: true, placeholder: "Enter doctor code", colWidth: 3, maxLength: 200 },
  { name: "firstName", label: "First Name", type: "text", required: true, placeholder: "Enter first name", colWidth: 4, maxLength: 200 },
  { name: "lastName", label: "Last Name", type: "text", required: true, placeholder: "Enter last name", colWidth: 4, maxLength: 200 },
  { name: "email", label: "Email", type: "email", required: false, placeholder: "Enter email address", colWidth: 4, maxLength: 100 },
   { name: "triosDoctorId", label: "Trios Doctor Id", type: "text", required: false, placeholder: "Enter trios doctor id", colWidth: 4, maxLength: 200 },
  { name: "triosEmailId", label: "Trios Email Id", type: "text", required: false, placeholder: "Enter trios email id", colWidth: 5, maxLength: 200 },
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
  recordId: number;
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
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  const [loading, setLoading] = useState(false);
  const [initialHeaderData, setInitialHeaderData] = useState<Record<string, any>>({});
  const [initialTabData, setInitialTabData] = useState<Record<string, Record<string, any>[]>>({});

  // ── Tab definitions with popup for practice and lab selection ─────────────
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
            component: DSOZonePopup, // Replace with your DentalOfficePopup component
            props: {
              dsoMasterId: externalDsoMasterId,
            },
            mapValue: (selected: any) => ({
              value: selected.id,
              display: selected.officeName || selected.name
            }),
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
          key: "Lab",
          label: "Lab",
          type: "popup",
          required: true,
          placeholder: "Select a lab",
          popupConfig: {
            component: LabMasterPopup,
            props: {
              dsoMasterId: externalDsoMasterId,
            },
            mapValue: (selected: any) => ({
              value: selected.id,
              display: selected.labName || selected.name
            }),
          }
        },
        {
          key: "labDescription",
          label: "Description",
          type: "text",
          required: false,
          placeholder: "Enter lab description",
        },
      ],
    },
  ];

  // ── Fetch existing data ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!show || !recordId) return;

      setLoading(true);
      try {
        console.log("Fetching doctor data for ID:", recordId);
        const response = await DSODoctorService.getById(recordId);
        console.log("Fetched doctor data:", response);

        if (response?.isSucess && response.value) {
          const data = response.value;

          // 1. Build header data
          const headerData = {
            doctorCode: data.doctorCode || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            licenseNo: data.licenseNo || "",
            info: data.info || "",
            address: data.address || "",
            isActive: data.isActive ?? true,
          };
          console.log("Header data:", headerData);
          setInitialHeaderData(headerData);

          // 2. Build practices tab data
          const practices = (data.dsoDentalDoctors || []).map((item: any) => ({
            Practice: item.dsoDentalOfficeId,
            PracticeDisplay: item.dsoDentalOfficeName || `Office #${item.dsoDentalOfficeId}`,
            isPrimary: item.isPrimary || false,
          }));
          console.log("Practices data:", practices);

          // 3. Build lab mappings tab data
          const labs = (data.labMappings || []).map((item: any) => ({
            Lab: item.labMasterId,
            LabDisplay: item.labName || `Lab #${item.labMasterId}`,
            labDescription: item.labDescription || "",
          }));
          console.log("Labs data:", labs);

          // 4. Set tab data
          setInitialTabData({
            practices: practices.length > 0 ? practices : [{ Practice: "", isPrimary: false }],
            lab: labs.length > 0 ? labs : [{ Lab: "", labDescription: "" }],
          });
        } else {
          toast.error("Failed to load doctor data");
          onHide();
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Error loading doctor data");
        onHide();
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [show, recordId]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    const { headerData, tabData } = data;

    console.log("Edit Header Data:", headerData);
    console.log("Edit Tab Data:", tabData);

    // Get practices from tabData
    const practiceRows = tabData.practices ?? [];

    // Filter valid practices (those with Practice value)
    const validPractices = practiceRows.filter(
      (row) => row.Practice && String(row.Practice).trim() !== ""
    );

    console.log("Valid practices for update:", validPractices);

    if (validPractices.length === 0) {
      toast.error("Please add at least one practice");
      throw new Error("No practices added");
    }

    // Get labs from tabData
    const labRows = tabData.lab ?? [];

    // Filter valid labs (those with Lab value)
    const validLabs = labRows.filter(
      (row) => row.Lab && String(row.Lab).trim() !== ""
    );

    console.log("Valid labs for update:", validLabs);

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
      id: 0, // New items will have ID 0, existing ones will be matched by dsoDentalOfficeId
      dsoDentalOfficeId: Number(row.Practice),
      dsoDoctorId: recordId,
      isPrimary: row.isPrimary ?? false,
      isActive: true,
      isDeleted: false,
    }));

    // 3. Build payload - map labs to labMappings array
    const labMappings = validLabs.map((row) => ({
      id: 0, // New items will have ID 0
      labMasterId: Number(row.Lab),
      dsoDoctorId: recordId,
      labName: row.labDescription || "", // You might want to fetch actual lab name
      labDescription: row.labDescription || "",
      isActive: true,
      isDeleted: false,
    }));

    const payload = {
      id: recordId,
      doctorCode: headerData.doctorCode ?? "",
      firstName: headerData.firstName ?? "",
      lastName: headerData.lastName ?? "",
      fullName: `${headerData.firstName ?? ""} ${headerData.lastName ?? ""}`.trim(),
      email: headerData.email ?? "",
      triosDoctorId: headerData.triosDoctorId || "",
      triosEmailId: headerData.triosEmailId || "",
      phoneNumber: headerData.phoneNumber ?? "",
      licenseNo: headerData.licenseNo ?? "",
      info: headerData.info ?? "",
      address: headerData.address ?? "",
      isActive: headerData.isActive ?? true,
      dsoMasterId: dsoMasterId,
      dsoDentalDoctors: practices,
      labMappings: labMappings,
    };

    console.log("Submitting update payload:", payload);

    // 4. Call API
    let result: any;
    try {
      result = await DSODoctorService.update(recordId, payload);
      console.log("API Update Response:", result);
    } catch (err) {
      console.error("Error in API call:", err);
      await handleApiError(err, "network");
      return;
    }

    // 5. Assert success
    if (result && result.isSucess) {
      await assertApiSuccess(result, "Failed to update DSO Doctor.");
    } else {
      console.error("Full error details:", result);
      throw new Error(result?.customMessage || result?.error || "Failed to update doctor");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="ktf-modal-loading">
        <div className="ktf-spinner" /> Loading...
      </div>
    );
  }

  return (
    <KiduTabbedFormEditModal
      show={show}
      onHide={onHide}
      title="Edit Doctor"
      headerFields={headerFields}
      tabs={baseTabs}
      initialHeaderData={initialHeaderData}
      initialTabData={initialTabData}
      onSubmit={handleSubmit}
      submitButtonText="Update Doctor"
      themeColor="#ef0d50"
      successMessage="DSO Doctor updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSODoctorEditModal;