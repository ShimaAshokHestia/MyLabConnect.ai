// src/Pages/CasePickup/Create.tsx

import React, { useEffect, useState } from "react";
import type { LabLookupItem, PracticeLookupItem } from "../../../Types/Auth/Lookup.types";
import LookupService from "../../../Services/Common/Lookup.services";
import type { PickupAddressDetails, PickupCreateFormData } from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import CasePickupService from "../../Service/Pickup/Pickup.services";
import PickupScheduleModal from "../../../KIDU_COMPONENTS/PickUp/PickupScheduleModal";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";


// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CasePickupCreate: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [labs,      setLabs]      = useState<LabLookupItem[]>([]);
  const [practices, setPractices] = useState<PracticeLookupItem[]>([]);
  const [loadingLookup, setLoadingLookup] = useState(false);

  // Fetch labs + practices once on mount (or when modal opens)
  useEffect(() => {
    if (!show) return;
    setLoadingLookup(true);
    Promise.all([LookupService.getLabs(), LookupService.getPractices()])
      .then(([labList, practiceList]) => {
        setLabs(labList);
        setPractices(practiceList);
      })
      .finally(() => setLoadingLookup(false));
  }, [show]);

  // ── Paginated address fetch (wraps the pre-loaded practices list) ──────────
  const fetchPickupAddresses = async (p: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    const term = p.searchTerm.toLowerCase();
    const filtered = term
      ? practices.filter(
          (pr) =>
            pr.officeName?.toLowerCase().includes(term) ||
            pr.officeCode?.toLowerCase().includes(term) ||
            pr.city?.toLowerCase().includes(term)
        )
      : practices;

    const start = (p.pageNumber - 1) * p.pageSize;
    return {
      data: filtered.slice(start, start + p.pageSize),
      total: filtered.length,
    };
  };

  // ── Map practice row → dropdown option ───────────────────────────────────
  const mapPickupAddress = (row: PracticeLookupItem) => ({
    value: row.id,
    label: `${row.officeName}${row.city ? ` — ${row.city}` : ""}`,
  });

  // ── Fetch address details for right panel ─────────────────────────────────
  const fetchAddressDetails = async (
    addressId: string | number
  ): Promise<PickupAddressDetails> => {
    const practice = practices.find((p) => String(p.id) === String(addressId));
    if (!practice) return {};
    return {
      practiceName: practice.officeName,
      address:      `${practice.address ?? ""}${practice.city ? `, ${practice.city}` : ""}${practice.postCode ? ` ${practice.postCode}` : ""}`,
      email:        undefined,   // PracticeLookupItem has no email field; extend if available
      mobileNo:     undefined,
    };
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (data: PickupCreateFormData) => {
    await CasePickupService.create({
      labMasterId:               Number(data.labMasterId),
      pickUpDate:                data.pickUpDate,
      pickUpEarliestTime:        data.pickUpEarliestTime,
      pickUpLateTime:            data.pickUpLateTime,
      pickUpAddress:             data.pickUpAddress!,
      caseRegistrationMasterIds: data.caseRegistrationMasterIds,
      trackingNum:               data.trackingNum || undefined,
    });
  };

  // ── Lab columns for KiduSelectPopup ──────────────────────────────────────
  const labColumns = [
    { key: "labName",     label: "Lab Name",    filterType: "text"   as const },
    { key: "labCode",     label: "Code",        filterType: "text"   as const },
    { key: "displayName", label: "Display Name",filterType: "text"   as const },
    { key: "lmsSystem",   label: "LMS",         filterType: "text"   as const },
    {
      key: "isActive",
      label: "Status",
      filterType: "select" as const,
      filterOptions: ["true", "false"],
      render: (value: boolean) => (
        <span className={`kidu-badge kidu-badge--${value ? "active" : "inactive"}`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  // ── Case columns for KiduMultiSelectPopup ─────────────────────────────────
  const caseColumns = [
    { key: "caseId",      label: "Case ID",      filterType: "text" as const },
    { key: "patientName", label: "Patient Name", filterType: "text" as const },
    { key: "doctorName",  label: "Doctor",       filterType: "text" as const },
    { key: "status",      label: "Status",       filterType: "text" as const },
  ];

  return (
    <PickupScheduleModal
      show={show}
      onHide={onHide}
      onSuccess={onSuccess}
      // Lab (uses pre-loaded lookup data)
      labSelectData={labs}
      labColumns={labColumns}
      labIdKey="id"
      labLabelKey="labName"
      labSearchKeys={["labName", "labCode", "displayName"]}
      // Pickup address (doctor's practices via lookup)
      fetchPickupAddresses={fetchPickupAddresses}
      mapPickupAddress={mapPickupAddress}
      fetchAddressDetails={fetchAddressDetails}
      // Cases (fetched via endpoint)
      casesSelectEndpoint={API_ENDPOINTS.LOOKUP.GET("cases")}  // replace with actual cases endpoint
      caseColumns={caseColumns}
      caseIdKey="id"
      caseLabelKey="patientName"
      caseSearchKeys={["caseId", "patientName"]}
      // Submit
      onSubmit={handleSubmit}
      title="Schedule Pickup"
      submitLabel="Schedule Pickup"
    />
  );
};

export default CasePickupCreate;