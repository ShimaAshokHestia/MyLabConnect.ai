import React, { useState, useEffect } from "react";
import KiduTabbedFormEditModal, {
  type TabbedFormField,
  type TabConfig,
} from "../../../../KIDU_COMPONENTS/KiduTabbedFormEditModal";
import LabSupportTypeService from "../../../Services/Masters/SupportTypes.services";
import LabSupportSubTypeService from "../../../Services/Masters/SupportSubTypes.services";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: number;
}

// ── Lab Master options ────────────────────────────────────────────────────────
const labMasterOptions = [
  { value: 0, label: "Lab 1" },
  { value: 1, label: "Lab 2" },
];

// ── Header Fields ─────────────────────────────────────────────────────────────
const headerFields: TabbedFormField[] = [
  { name: "labMasterId", label: "Lab", type: "select", required: true, placeholder: "Choose a lab...", colWidth: 4, options: labMasterOptions },
  { name: "labSupportTypeName", label: "Support Type", type: "text", required: true, placeholder: "Enter support type", colWidth: 4 },
  { name: "escalationDays", label: "Escalation in Days", type: "number", required: false, placeholder: "Enter escalation in days", colWidth: 4 },
];

// ── Sub Types Tab Configuration ───────────────────────────────────────────────
const tabs: TabConfig[] = [
  {
    key: "subTypes",
    label: "Sub Types",
    columns: [
      { key: "labSupportSubTypeName", label: "Sub Type", type: "text", required: true, placeholder: "Enter Sub Type" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const LabSupportTypeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<{
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  } | null>(null);

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setFetchedData(null);
      setLoading(false);
    }
  }, [show]);

  // Fetch when recordId changes
  useEffect(() => {
    if (!recordId || recordId <= 0) return;

    const fetchData = async () => {
      setLoading(true);
      setFetchedData(null);
      try {
        // ✅ Fetch both — but subTypes failure won't block the modal
        const [mainResponse, subTypes] = await Promise.all([
          LabSupportTypeService.getById(recordId),
          LabSupportSubTypeService.getBySupportTypeId(recordId), // always returns [] on error
        ]);

        console.log("Edit - Main Response:", mainResponse);
        console.log("Edit - SubTypes:", subTypes);

        const mainData = mainResponse?.value || mainResponse;

        setFetchedData({
          headerData: {
            labMasterId: mainData.labMasterId,
            labSupportTypeName: mainData.labSupportTypeName,
            escalationDays: mainData.escalationDays,
            isActive: mainData.isActive,
          },
          tabData: {
            subTypes: Array.isArray(subTypes) && subTypes.length > 0 ? subTypes : [{}],
          },
        });
      } catch (error) {
        console.error("Error fetching support type:", error);
        // ✅ Even if main fetch fails, close gracefully
        setFetchedData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recordId]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => {
    try {
      const { headerData, tabData } = data;

      await LabSupportTypeService.update(recordId, {
        id: recordId,
        labSupportTypeName: headerData.labSupportTypeName,
        escalationDays: headerData.escalationDays ? Number(headerData.escalationDays) : 0,
        labMasterId: Number(headerData.labMasterId),
        isActive: headerData.isActive ?? true,
      });

      const validSubTypes = (tabData.subTypes || []).filter(
        (row) => row.labSupportSubTypeName?.trim()
      );

      if (validSubTypes.length > 0) {
        await Promise.all(
          validSubTypes.map((subType) =>
            LabSupportSubTypeService.create({
              labSupportSubTypeName: subType.labSupportSubTypeName,
              labSupportTypeId: recordId,
              isActive: true,
            })
          )
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Error updating Lab Support Type:", error);
    }
  };

  // ── Loading overlay ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.4)",
          zIndex: 1055,
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-white">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!fetchedData) return null;

  return (
    <KiduTabbedFormEditModal
      show={show}
      onHide={onHide}
      title="Edit Support Type"
      headerFields={headerFields}
      tabs={tabs}
      onSubmit={handleSubmit}
      submitButtonText="Update"
      themeColor="#ef0d50"
      initialHeaderData={fetchedData.headerData}
      initialTabData={fetchedData.tabData}
    />
  );
};

export default LabSupportTypeEditModal;
