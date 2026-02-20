import React from "react";
import KiduCreateModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { FinancialYear } from "../../../Types/Settings/FinancialYear.types";
import FinancialYearService from "../../../Services/Settings/FinancialYear.services";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "finacialYearCode", rules: { type: "text",   label: "Financial Year Code", required: true,  maxLength: 20, colWidth: 6 } },
  { name: "startDate",        rules: { type: "date",   label: "Start Date",          required: true,                 colWidth: 6 } },
  { name: "endDate",          rules: { type: "date",   label: "End Date",            required: true,                 colWidth: 6 } },
  { name: "isCurrent",        rules: { type: "toggle", label: "Current Year",                                        colWidth: 6 } },
  { name: "isClosed",         rules: { type: "toggle", label: "Closed",                                              colWidth: 6 } },
];

const FinancialYearCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<FinancialYear> = {
      finacialYearCode: formData.finacialYearCode,
      startDate:        formData.startDate,
      endDate:          formData.endDate,
      isCurrent:        formData.isCurrent ?? false,
      isClosed:         formData.isClosed  ?? false,
    };
    await FinancialYearService.create(payload);
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={onHide}
      title="Create Financial Year"
      subtitle="Add new Financial Year"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Financial Year created successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default FinancialYearCreateModal;
