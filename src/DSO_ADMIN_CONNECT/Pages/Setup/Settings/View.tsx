import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOSettingService from "../../../Services/Setup/DSOSetting.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "settingType", label: "Setting Type", colWidth: 6 },
  { name: "key",         label: "Key",          colWidth: 6 },
  { name: "value",       label: "Value",        colWidth: 12 },
  { name: "dsoName",     label: "DSO Master",   colWidth: 6 },
  { name: "dsoMasterId", label: "DSO Master ID",colWidth: 6 },
  { name: "isActive",    label: "Status",       colWidth: 6,  isToggle: true },
  { name: "createdAt",   label: "Created At",   colWidth: 6,  isDate: true },
  { name: "updatedAt",   label: "Updated At",   colWidth: 6,  isDate: true },
];

const DSOSettingViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Setting"
      subtitle="DSO Setting details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOSettingService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOSettingViewModal;