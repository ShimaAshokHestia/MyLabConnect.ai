import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "name",        label: "Zone Name",    colWidth: 12 },
  { name: "isActive",    label: "Status",       colWidth: 6, isToggle: true },

];

const DSOZoneViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {
  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Zone"
      subtitle="DSO Zone details"
      fields={fields}
      recordId={recordId}
      onFetch={(id) => DSOZoneService.getById(Number(id))}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOZoneViewModal;
