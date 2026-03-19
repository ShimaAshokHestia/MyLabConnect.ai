import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import LabMasterService from "../../../Services/Masters/Lab.services";

interface Props {
  show: boolean;
  onHide: () => void;
  recordId: string | number;
}

const AUTHENTICATION_TYPE_MAP: Record<number, string> = {
  1: "Normal",
  2: "SSO",
  3: "Basic",
};

// Note: isActive is intentionally excluded from fields — KiduViewModal
// automatically renders it in the modal header as a read-only toggle.
const fields: ViewField[] = [
  { name: "labCode", label: "Lab Code", colWidth: 6 },
  { name: "labName", label: "Lab Name", colWidth: 6 },
  { name: "displayName", label: "Display Name", colWidth: 6 },
  { name: "email", label: "Email", colWidth: 6 },
  { name: "authenticationType", label: "Authentication Type", colWidth: 6 },
  { name: "labGroupId", label: "Lab Group", colWidth: 6 },
  { name: "logoforRX", label: "Logo for RX", colWidth: 6 },
  { name: "lmsSystem", label: "LMS System", colWidth: 6 },
];

const LabMasterViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Lab"
      subtitle="Lab Master details"
      fields={fields}
      recordId={recordId}
      onFetch={async (id) => {
        const response = await LabMasterService.getById(Number(id));

        // Map authenticationType number → label (Normal / SSO / Basic)
        if (response?.value?.authenticationType) {
          response.value.authenticationType =
            AUTHENTICATION_TYPE_MAP[response.value.authenticationType] ??
            String(response.value.authenticationType);
        }

        // Return raw API response — KiduViewModal checks isSucess + reads value
        return response;
      }}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default LabMasterViewModal;