// src/Pages/CasePickup/View.tsx

import React, { useEffect, useState } from "react";
import type { PracticeLookupItem } from "../../../Types/Auth/Lookup.types";
import LookupService from "../../../Services/Common/Lookup.services";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import type { PickupViewRecord } from "../../../KIDU_COMPONENTS/PickUp/PickupViewModal";
import type { PickupAddressDetails } from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import PickupViewModal from "../../../KIDU_COMPONENTS/PickUp/PickupViewModal";


// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: number | string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CasePickupView: React.FC<Props> = ({ show, onHide, recordId }) => {
  const [practices, setPractices] = useState<PracticeLookupItem[]>([]);

  useEffect(() => {
    if (!show) return;
    LookupService.getPractices().then(setPractices);
  }, [show]);

  // ── Fetch record → PickupViewRecord shape ─────────────────────────────────
  const fetchRecord = async (id: number | string): Promise<PickupViewRecord> => {
    const res  = await CasePickupService.getById(Number(id));
    const data = res;

    // Normalise cases array
    const caseIds: (string | number)[] = data.caseRegistrationMasterIds ?? [];
    const caseLabels: string[]          = data.caseLabels                ?? [];
    const cases = caseIds.map((cid, i) => ({
      id:    cid,
      label: caseLabels[i] ?? String(cid),
    }));

    return {
      id:                  data.id ?? 0,
      labName:             data.labMasterName, 
      pickUpDate:          data.pickUpDate,
      pickUpEarliestTime:  data.pickUpEarliestTime,
      pickUpLateTime:      data.pickUpLateTime,
      pickUpAddress:       data.pickUpAddress,
      pickUpAddressId:     data.pickUpAddressId,
      cases,
      trackingNum:         data.trackingNum,
      isActive:            data.isActive,
      createdAt:           data.createdAt,
      updatedAt:           data.updatedAt,
      // Embedded address details (if API sends them)
      practiceName:        data.practiceName,
      addressLine:         data.addressLine,
      email:               data.email,
      mobileNo:            data.mobileNo,
    };
  };

  // ── Fetch address details (fall back to lookup list) ──────────────────────
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