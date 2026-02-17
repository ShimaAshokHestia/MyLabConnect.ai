import React from "react";
import KiduViewModal, { type ViewField } from "../../../../KIDU_COMPONENTS/KiduViewModal";
import DSOZoneService from "../../../Services/Setup/DsoZone.services";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  // Core Information
  { name: "name",         label: "Zone Name",      colWidth: 12 },
  
  // DSO Master Information
  { name: "dsoName",      label: "DSO Master",     colWidth: 6 },
  { name: "dsoMasterId",  label: "DSO Master ID",  colWidth: 6 },
  
  // Status and Audit
  { name: "isActive",     label: "Status",         colWidth: 6, isToggle: true },
  { name: "createdAt",    label: "Created At",     colWidth: 6, isDate: true },
  { name: "updatedAt",    label: "Updated At",     colWidth: 6, isDate: true },
];

const DSOZoneViewModal: React.FC<Props> = ({
  show,
  onHide,
  recordId,
}) => {

  const handleFetch = async (id: string | number) => {
    const response = await DSOZoneService.getById(Number(id));
    return response;
  };

  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View Zone"
      subtitle="DSO Zone details"
      size="lg"
      centered={true}
      recordId={recordId}
      fields={fields}
      onFetch={handleFetch}
      showBadge={true}
      badgeText="Read Only"
    />
  );
};

export default DSOZoneViewModal;