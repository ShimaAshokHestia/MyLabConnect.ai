import React from "react";
import KiduCreateModal, {
  type Field,
  type DropdownHandlers,
} from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { DSOZone } from "../../../Types/Setup/DsoZone.types";
import type { DSODentalOffice } from "../../../Types/Masters/DsoDentalOffice.types";
import DSODentalOfficeService from "../../../Services/Masters/DsoDentalOffice.services";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";
import { useCurrentUser } from "../../../../Services/AuthServices/CurrentUser.services";
import { useApiErrorHandler } from "../../../../Services/AuthServices/APIErrorHandler.services";
import COUNTRIES from "../../../../Configs/Country";
import CITIES from "../../../../Configs/City";

// ── Field definitions ─────────────────────────────────────────────────────────
//
// country, city, dsoZoneId use type:"smartdropdown" — KiduCreateModal will
// render a KiduDropdown for each, driven by the dropdownHandlers map.
// Their selected values are automatically merged into formData via
// the internal dropdownValues state before onSubmit is called.
//

const fields: Field[] = [
  { name: "officeCode", rules: { type: "text", label: "Office Code", required: true, maxLength: 50, colWidth: 6 } },
  { name: "officeName", rules: { type: "text", label: "Office Name", required: true, maxLength: 100, colWidth: 6 } },
  { name: "email", rules: { type: "email", label: "Email", required: true, maxLength: 150, colWidth: 6 } },
  { name: "mobileNum", rules: { type: "number", label: "Mobile Number", required: true, maxLength: 20, colWidth: 6 } },
  { name: "postCode", rules: { type: "number", label: "Post Code", required: true, maxLength: 20, colWidth: 6 } },
  { name: "country", rules: { type: "smartdropdown", label: "Country", required: true, colWidth: 6 } },
  { name: "city", rules: { type: "smartdropdown", label: "City", required: true, colWidth: 6 } },
  { name: "dsoZoneId", rules: { type: "smartdropdown", label: "Zone", required: true, colWidth: 6 } },
  { name: "address", rules: { type: "textarea", label: "Address", required: true, maxLength: 255, colWidth: 6 } },
  { name: "info", rules: { type: "textarea", label: "Additional Info", required: false, maxLength: 500, colWidth: 6 } },
  { name: "isActive", rules: { type: "toggle", label: "Active", colWidth: 6 } },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DSODentalOfficeCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const { requireDSOMasterId } = useCurrentUser();
  const { handleApiError, assertApiSuccess } = useApiErrorHandler();

  // ── dropdownHandlers — each key matches a "smartdropdown" field name ──────
  const dropdownHandlers: DropdownHandlers = {
    // Country — static JSON list
    country: {
      staticOptions: COUNTRIES,
      placeholder: "Select Country...",
    },

    // City — static JSON list
    city: {
      staticOptions: CITIES,
      placeholder: "Select City...",
    },

    // Zone — paginated API call
    dsoZoneId: {
      paginatedFetch: async (params) => {
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

  // ── Submit handler ────────────────────────────────────────────────────────
  //
  // KiduCreateModal merges dropdownValues into formData automatically before
  // calling onSubmit, so formData.country, formData.city, formData.dsoZoneId
  // are all available here without any extra extraValues needed.
  //
  const handleSubmit = async (formData: Record<string, any>) => {
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
      result = await DSODentalOfficeService.create(payload);
    } catch (err) {
      await handleApiError(err, "network");
      return;
    }

    // 4. Assert success
    await assertApiSuccess(result, "Failed to create DSO Dental Office.");
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Dental Office"
      subtitle="Add a new DSO Dental Office"
      fields={fields}
      onSubmit={handleSubmit}
      dropdownHandlers={dropdownHandlers}
      successMessage="Dental Office created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default DSODentalOfficeCreateModal;