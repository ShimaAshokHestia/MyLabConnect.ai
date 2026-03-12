// src/DOCTOR_CONNECT/Pages/CasePickup/Edit.tsx

import React, { useEffect, useState } from "react";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import type { CaseLookupItem } from "../../Service/Pickup/Pickup.services";

import type { PickupAddressDetails } from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import { useCurrentUser } from "../../../Services/AuthServices/CurrentUser.services";
import type { PickupEditFormData, PickupRecord } from "../../../KIDU_COMPONENTS/PickUp/PickupeditModal";
import PickupEditModal from "../../../KIDU_COMPONENTS/PickUp/PickupeditModal";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: number | string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CasePickupEdit: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  recordId,
}) => {
  const { dsoDoctorId } = useCurrentUser();
  const [cases, setCases] = useState<CaseLookupItem[]>([]);

  // Load doctor's cases on open
  useEffect(() => {
    if (!show || !dsoDoctorId) return;
    CasePickupService.getCasesByDoctor(dsoDoctorId).then(setCases);
  }, [show, dsoDoctorId]);

  // ── Fetch existing record ─────────────────────────────────────────────────
  const fetchRecord = async (id: number | string): Promise<PickupRecord> => {
    const data = await CasePickupService.getById(Number(id));

    return {
      id: data.id ?? id,
      labName: data.labMasterName ?? "",
      pickUpDate: data.pickUpDate,
      pickUpEarliestTime: data.pickUpEarliestTime,
      pickUpLateTime: data.pickUpLateTime,
      pickUpAddress: data.pickUpAddress,
      pickUpAddressId: data.pickUpAddressId,
      caseRegistrationMasterIds: data.caseRegistrationMasterIds ?? [],
      caseLabels: data.caseLabels ?? [],
      trackingNum: data.trackingNum ?? "",
      isActive: data.isActive,
    };
  };

  // ── Fetch address details for right panel ─────────────────────────────────
  // For edit, the address string comes from the record itself.
  // We build a PickupAddressDetails from it so the map renders.
  const fetchAddressDetails = async (
    _addressId: string | number
  ): Promise<PickupAddressDetails> => {
    // Address details are embedded in the record (pickUpAddress string).
    // This will be populated by the modal itself from the record.
    return {};
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (
    id: number | string,
    data: PickupEditFormData
  ) => {
    const result = await CasePickupService.update(Number(id), {
      id: Number(id),
      caseRegistrationMasterIds: data.caseRegistrationMasterIds,
      trackingNum: data.trackingNum,
    });
    if (result && !result.isSucess) {
      throw new Error(result?.customMessage ?? "Failed to update pickup.");
    }
  };

  const caseColumns = [
    { key: "caseId",      label: "Case ID",      filterType: "text" as const },
    { key: "patientName", label: "Patient Name", filterType: "text" as const },
    { key: "doctorName",  label: "Doctor",       filterType: "text" as const },
    { key: "status",      label: "Status",       filterType: "text" as const },
  ];

  return (
    <PickupEditModal
      show={show}
      onHide={onHide}
      onSuccess={onSuccess}
      recordId={recordId}
      fetchRecord={fetchRecord}
      fetchAddressDetails={fetchAddressDetails}
      casesSelectData={cases}
      caseColumns={caseColumns}
      caseIdKey="id"
      caseLabelKey="patientName"
      caseSearchKeys={["caseId", "patientName", "doctorName", "status"]}
      onSubmit={handleSubmit}
      title="Edit Pickup"
      submitLabel="Update Pickup"
    />
  );
};

export default CasePickupEdit;