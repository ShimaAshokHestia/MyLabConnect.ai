// src/Pages/CasePickup/Edit.tsx

import React, { useEffect, useState } from "react";
import type { PracticeLookupItem } from "../../../Types/Auth/Lookup.types";
import LookupService from "../../../Services/Common/Lookup.services";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import type { PickupEditFormData, PickupRecord } from "../../../KIDU_COMPONENTS/PickUp/PickupeditModal";
import type { PickupAddressDetails } from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import PickupEditModal from "../../../KIDU_COMPONENTS/PickUp/PickupeditModal";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";


// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  number | string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CasePickupEdit: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [practices, setPractices] = useState<PracticeLookupItem[]>([]);

  // Fetch practices once when modal opens (needed for address details panel)
  useEffect(() => {
    if (!show) return;
    LookupService.getPractices().then(setPractices);
  }, [show]);

  // ── Fetch existing record → PickupRecord shape ────────────────────────────
  const fetchRecord = async (id: number | string): Promise<PickupRecord> => {
    const res   = await CasePickupService.getById(Number(id));
    const data  = res;

    return {
      id:                        data.id ?? id,
    //   labName:                   data.labName ?? "",
      pickUpDate:                data.pickUpDate,
      pickUpEarliestTime:        data.pickUpEarliestTime,
      pickUpLateTime:            data.pickUpLateTime,
      pickUpAddress:             data.pickUpAddress,
      pickUpAddressId:           data.pickUpAddressId,
      caseRegistrationMasterIds: data.caseRegistrationMasterIds ?? [],
      caseLabels:                data.caseLabels                ?? [],
      trackingNum:               data.trackingNum               ?? "",
      isActive:                  data.isActive,
    };
  };

  // ── Fetch address details for right panel ─────────────────────────────────
  const fetchAddressDetails = async (
    addressId: string | number
  ): Promise<PickupAddressDetails> => {
    const practice = practices.find((p) => String(p.id) === String(addressId));
    if (!practice) return {};
    return {
      practiceName: practice.officeName,
      address:      [practice.address, practice.city, practice.postCode]
                      .filter(Boolean)
                      .join(", "),
      email:    undefined,
      mobileNo: undefined,
    };
  };

  // ── Case columns for KiduMultiSelectPopup ─────────────────────────────────
  const caseColumns = [
    { key: "caseId",      label: "Case ID",      filterType: "text" as const },
    { key: "patientName", label: "Patient Name", filterType: "text" as const },
    { key: "doctorName",  label: "Doctor",       filterType: "text" as const },
    { key: "status",      label: "Status",       filterType: "text" as const },
  ];

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (id: number | string, data: PickupEditFormData) => {
    const result = await CasePickupService.update(Number(id), {
      id:                        Number(id),
      caseRegistrationMasterIds: data.caseRegistrationMasterIds,
      trackingNum:               data.trackingNum,
    });
    if (result && !result.isSucess) {
      throw new Error(result?.customMessage ?? "Failed to update pickup.");
    }
  };

  return (
    <PickupEditModal
      show={show}
      onHide={onHide}
      onSuccess={onSuccess}
      recordId={recordId}
      fetchRecord={fetchRecord}
      fetchAddressDetails={fetchAddressDetails}
      // Cases (fetched via endpoint — replace with actual cases endpoint)
      casesSelectEndpoint={API_ENDPOINTS.LOOKUP.GET("practice")}
      caseColumns={caseColumns}
      caseIdKey="id"
      caseLabelKey="patientName"
      caseSearchKeys={["caseId", "patientName"]}
      onSubmit={handleSubmit}
      title="Edit Pickup"
      submitLabel="Update Pickup"
    />
  );
};

export default CasePickupEdit;