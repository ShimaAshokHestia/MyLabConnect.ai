import React from "react";
import type { ViewField } from "../../../KIDU_COMPONENTS/KiduViewModal";
import DSOmasterService from "../../Services/Master/Master.services";
import KiduViewModal from "../../../KIDU_COMPONENTS/KiduViewModal";

interface Props {
  show:     boolean;
  onHide:   () => void;
  recordId: string | number;
}

const fields: ViewField[] = [
  { name: "name",        label: "Name",        colWidth: 6  },
  { name: "description", label: "Description", colWidth: 12, isTextarea: true },
  { name: "isActive",    label: "Status",      colWidth: 6,  isToggle: true   },
  { name: "createdAt",   label: "Created At",  colWidth: 6,  isDate: true     },
  { name: "updatedAt",   label: "Updated At",  colWidth: 6,  isDate: true     },
];

const DSOmasterViewModal: React.FC<Props> = ({ show, onHide, recordId }) => {

  const handleFetch = async (id: string | number) => {
    const response = await DSOmasterService.getById(Number(id));
    return response;
  };

  return (
    <KiduViewModal
      show={show}
      onHide={onHide}
      title="View DSO Master"
      subtitle="DSO Master details"
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

export default DSOmasterViewModal;