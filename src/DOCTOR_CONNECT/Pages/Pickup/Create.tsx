// src/DOCTOR_CONNECT/Pages/CasePickup/Create.tsx

import React, { useEffect, useState } from "react";
import type { LabLookupItem } from "../../../Types/Auth/Lookup.types";
import LookupService from "../../../Services/Common/Lookup.services";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import type { CaseLookupItem, DoctorPracticeItem } from "../../Service/Pickup/Pickup.services";
import PickupScheduleModal from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import type { PickupCreateFormData } from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const CasePickupCreate: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { dsoDoctorId } = useCurrentUser();

  const [labs, setLabs] = useState<LabLookupItem[]>([]);
  const [cases, setCases] = useState<CaseLookupItem[]>([]);
  const [practices, setPractices] = useState<DoctorPracticeItem[]>([]);
  const [loadingPractices, setLoadingPractices] = useState(false);

  useEffect(() => {
    if (!show || !dsoDoctorId) return;

    const loadData = async () => {
      setLoadingPractices(true);
      try {
        const [labList, practiceList, caseList] = await Promise.all([
          LookupService.getLabs(),
          CasePickupService.getPracticesByDoctor(dsoDoctorId),
          CasePickupService.getCasesByDoctor(dsoDoctorId),
        ]);
        setLabs(labList);
        setPractices(practiceList);
        setCases(caseList);
      } finally {
        setLoadingPractices(false);
      }
    };

    loadData();
  }, [show, dsoDoctorId]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (data: PickupCreateFormData) => {
    const combineDateTime = (date: string, time: string): string => {
      if (!date) return "";
      if (time?.includes("T")) return time;
      const t = time?.includes(":") ? time : "00:00:00";
      return `${date}T${t.length === 5 ? t + ":00" : t}`;
    };

    const pickUpDate = typeof data.pickUpDate === "string"
      ? data.pickUpDate.split("T")[0]
      : data.pickUpDate;

    await CasePickupService.create({
      id: 0,
      labMasterId: Number(data.labMasterId),
      pickUpDate: combineDateTime(pickUpDate, pickUpDate),
      pickUpEarliestTime: combineDateTime(pickUpDate, data.pickUpEarliestTime),
      pickUpLateTime: combineDateTime(pickUpDate, data.pickUpLateTime),
      pickUpAddress: data.pickUpAddressText || String(data.pickUpAddress ?? ""),
      trackingNum: data.trackingNum || "",
      isActive: true,
      isDeleted: false,
      casePickUpDetails: data.caseRegistrationMasterIds.map((caseId) => ({
        id: 0,
        casePickUpId: 0,
        caseRegistrationMasterId: Number(caseId),
        isActive: true,
        isDeleted: false,
      })),
    });
    onSuccess();
    onHide();
  };

  // ── Column definitions ─────────────────────────────────────────────────────
  const labColumns = [
    { key: "labName", label: "Lab Name", filterType: "text" as const },
    { key: "labCode", label: "Code", filterType: "text" as const },
    { key: "displayName", label: "Display Name", filterType: "text" as const },
    { key: "lmsSystem", label: "LMS", filterType: "text" as const },
  ];

  const practiceColumns = [
    { key: "officeName", label: "Office Name", filterType: "text" as const },
    { key: "officeCode", label: "Code", filterType: "text" as const },
    { key: "address", label: "Address", filterType: "text" as const },
    { key: "city", label: "City", filterType: "text" as const },
    { key: "postCode", label: "Post Code", filterType: "text" as const },
  ];

  const caseColumns = [
    { key: "caseId", label: "Case ID", filterType: "text" as const },
    { key: "patientName", label: "Patient Name", filterType: "text" as const },
    { key: "doctorName", label: "Doctor", filterType: "text" as const },
    { key: "status", label: "Status", filterType: "text" as const },
  ];

  return (
    <PickupScheduleModal
      show={show}
      onHide={onHide}
      onSuccess={onSuccess}
      // Labs — all labs (pre-loaded)
      labSelectData={labs}
      labColumns={labColumns}
      labIdKey="id"
      labLabelKey="labName"
      labSearchKeys={["labName", "labCode", "displayName"]}
      // Pickup address — doctor's linked practices (pre-loaded)
      practicesData={practices}
      practicesLoading={loadingPractices}
      practiceColumns={practiceColumns}
      practiceIdKey="id"
      practiceLabelKey="officeName"
      practiceSearchKeys={["officeName", "officeCode", "address", "city", "postCode"]}
      // Cases — doctor's cases (pre-loaded)
      casesSelectData={cases}
      caseColumns={caseColumns}
      caseIdKey="id"
      caseLabelKey="patientNameWithCase"   // ✅ shows "Teena Rejin (CASE-20260313-00006)"
      caseSearchKeys={["caseId", "patientName", "doctorName", "status"]}
      onSubmit={handleSubmit}
      title="Schedule Pickup"
      submitLabel="Schedule Pickup"
    />
  );
};

export default CasePickupCreate;