import React, { useState } from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { DropdownHandlers } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { KiduDropdownOption } from "../../../../KIDU_COMPONENTS/KiduDropdown";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import COUNTRIES from "../../../../Configs/Country";
import CITIES from "../../../../Configs/City";

// ── Field definitions ─────────────────────────────────────────────────────────

const fields: Field[] = [
  { name: "officeCode", rules: { type: "text", label: "Office Code", required: true, maxLength: 50, colWidth: 6 } },
  { name: "officeName", rules: { type: "text", label: "Office Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "email", rules: { type: "email", label: "Email", required: true, maxLength: 150, colWidth: 6 } },
  { name: "mobileNum", rules: { type: "number", label: "Mobile Number", required: true, maxLength: 20, colWidth: 6 } },
  { name: "postCode", rules: { type: "number", label: "Post Code", required: true, maxLength: 20, colWidth: 6 } },
  { name: "country", rules: { type: "smartdropdown", label: "Country", required: true, colWidth: 6 } },
  { name: "city", rules: { type: "smartdropdown", label: "City", required: true, colWidth: 6 } },
  { name: "dsoZoneId", rules: { type: "smartdropdown", label: "Zone", required: true, colWidth: 6 } },
  { name: "address", rules: { type: "text", label: "Address", required: true, maxLength: 255, colWidth: 12 } },
  { name: "info", rules: { type: "text", label: "Additional Info", required: false, maxLength: 500, colWidth: 12 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  recordId: string | number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSODentalOfficeEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── Zone static options built from fetched record ─────────────────────────
  //
  // KiduDropdown resolves its display label by matching the stored value
  // against the loaded options list. For paginated dropdowns this only happens
  // when the dropdown opens — so the pill stays blank on initial render.
  //
  // Fix: when the record is fetched we already have dsoZoneId + dsoZoneName.
  // We seed zoneStaticSeed with that single option so KiduDropdown can resolve
  // the label immediately without waiting for the user to open the dropdown.
  // When the user opens the dropdown, paginatedFetch takes over and loads the
  // full list — the pre-seeded option is replaced seamlessly.
  //
  const [zoneStaticSeed, setZoneStaticSeed] = useState<KiduDropdownOption[]>([]);

  // ── dropdownHandlers ──────────────────────────────────────────────────────
  const dropdownHandlers: DropdownHandlers = {
    country: {
      staticOptions: COUNTRIES,
      placeholder: "Select Country...",
    },
    city: {
      staticOptions: CITIES,
      placeholder: "Select City...",
    },
    dsoZoneId: {
      // Provide the seeded option so the label resolves before dropdown opens.
      // Once opened, paginatedFetch loads the real list and replaces the seed.
      staticOptions: zoneStaticSeed.length > 0 ? zoneStaticSeed : undefined,
      paginatedFetch: zoneStaticSeed.length > 0 ? undefined : async (params) => {
        const response = await DSOZoneService.getPaginatedList({
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
          sortBy: "zoneName",
          sortDescending: false,
        } as any);
        return { data: response.data, total: response.total };
      },
      mapOption: (row: DSOZone) => ({
        value: row.id!,
        label: row.name ?? String(row.id),
      }),
      pageSize: 10,
      placeholder: "Select Zone...",
    },
  };

  // ── Fetch handler ─────────────────────────────────────────────────────────
  const handleFetch = async (id: string | number) => {
    const response = await DSODentalOfficeService.getById(Number(id));
    const data = response?.value ?? response?.data ?? response;

    // Seed the zone dropdown with the current zone so its label shows
    // immediately — before the user opens the dropdown.
    if (data?.dsoZoneId && data?.dsoZoneName) {
      setZoneStaticSeed([{ value: data.dsoZoneId, label: data.dsoZoneName }]);
    }

    return response;
  };

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    // 1. Get DSOMasterId from token
    let dsOMasterId: number;
    try {
      dsOMasterId = requireDSOMasterId();
    } catch (err) {
      await handleApiError(err, "session");
      return;
    }

    // 2. Build payload
    const payload: Partial<DSODentalOffice> = {
      id: Number(id),
      officeCode: formData.officeCode,
      officeName: formData.officeName,
      email: formData.email ?? "",
      mobileNum: formData.mobileNum ?? "",
      postCode: formData.postCode ?? "",
      country: formData.country ?? "",
      city: formData.city ?? "",
      dsoZoneId: formData.dsoZoneId ? Number(formData.dsoZoneId) : undefined,
      address: formData.address ?? "",
      info: formData.info ?? "",
      dsoMasterId: dsOMasterId,
      isActive: formData.isActive ?? true,
    };

    // 3. Call API
    let result: any;
    try {
      result = await DSODentalOfficeService.update(Number(id), payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to update DSO Dental Office.");

    return result;
  };

  // ── Reset seed on close ───────────────────────────────────────────────────
  const handleHide = () => {
    setZoneStaticSeed([]);
    onHide();
  };

  return (
    <KiduEditModal
      show={show}
      onHide={handleHide}
      title="Edit Dental Office"
      subtitle="Update DSO Dental Office details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      dropdownHandlers={dropdownHandlers}
      successMessage="Dental Office updated successfully!"
      onSuccess={onSuccess}
      submitButtonText="Update Dental Office"
    />
  );
};

export default DSODentalOfficeEditModal;