// src/DOCTOR_CONNECT/Pages/CasePickup/View.tsx

import React from "react";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import type { PickupViewRecord } from "../../../KIDU_COMPONENTS/PickUp/PickupViewModal";
import type { PickupAddressDetails } from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import PickupViewModal from "../../../KIDU_COMPONENTS/PickUp/PickupViewModal";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: number | string;
}

const CasePickupView: React.FC<Props> = ({ show, onHide, recordId }) => {

  // ── Fetch record ──────────────────────────────────────────────────────────
  const fetchRecord = async (id: number | string): Promise<PickupViewRecord> => {
    const data = await CasePickupService.getById(Number(id));

    const cases = (data.casePickUpDetails ?? [])
      .filter((d: { isDeleted: any; }) => !d.isDeleted)
      .map((d: { caseRegistrationMasterId: any; patientName: any; caseNo: any; }) => ({
        id: d.caseRegistrationMasterId,
        label: d.patientName
          ? d.caseNo
            ? `${d.patientName} (${d.caseNo})`
            : d.patientName
          : String(d.caseRegistrationMasterId),
      }));

    return {
      id:                 data.id ?? 0,
      labName:            data.labMasterName ?? "",
      pickUpDate:         data.pickUpDate,
      pickUpEarliestTime: data.pickUpEarliestTime,
      pickUpLateTime:     data.pickUpLateTime,
      pickUpAddress:      data.pickUpAddress,
      pickUpAddressId:    undefined, // ✅ not returned by backend
      cases,
      trackingNum:        data.trackingNum,
      isActive:           data.isActive,
    };
  };

  // ── Fetch address details ─────────────────────────────────────────────────
  // ✅ FIX: pickUpAddressId is not stored on case_pickup — address is free text
  // Right panel will only show the address string from the record itself
  const fetchAddressDetails = async (
    _addressId: string | number
  ): Promise<PickupAddressDetails> => {
    return {};
  };

  return (
    <PickupViewModal
      show={show}
      onHide={onHide}
      recordId={recordId}
      fetchRecord={fetchRecord}
      fetchAddressDetails={fetchAddressDetails}
      title="Pickup Details"
    />
  );
};

export default CasePickupView;