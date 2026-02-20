import React from "react";
import KiduEditModal, { type Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import FinancialYearService from "../../../Services/Settings/FinancialYear.services";
import type { FinancialYear } from "../../../Types/Settings/FinancialYear.types";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

const fields: Field[] = [
  { name: "finacialYearCode", rules: { type: "text",   label: "Financial Year Code", required: true,  maxLength: 20, colWidth: 6 } },
  { name: "startDate",        rules: { type: "date",   label: "Start Date",          required: true,                 colWidth: 6 } },
  { name: "endDate",          rules: { type: "date",   label: "End Date",            required: true,                 colWidth: 6 } },
  { name: "isCurrent",        rules: { type: "toggle", label: "Current Year",                                        colWidth: 6 } },
  { name: "isClosed",         rules: { type: "toggle", label: "Closed",                                              colWidth: 6 } },
];

const FinancialYearEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const handleFetch = async (id: string | number) => {
    return await FinancialYearService.getById(Number(id));
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<FinancialYear> = {
      financialYearId:  Number(id),
      finacialYearCode: formData.finacialYearCode,
      startDate:        formData.startDate,
      endDate:          formData.endDate,
      isCurrent:        formData.isCurrent ?? false,
      isClosed:         formData.isClosed  ?? false,
    };
    await FinancialYearService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Financial Year"
      subtitle="Update Financial Year details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Financial Year updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default FinancialYearEditModal;
