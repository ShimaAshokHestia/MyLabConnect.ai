import React from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduEditModal";
import CompanyService from "../../Services/Company/Company.services";
import type { Company } from "../../Types/Company/Company.types";
import KiduEditModal from "../../../KIDU_COMPONENTS/KiduEditModal";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

const fields: Field[] = [
  { name: "comapanyName",  rules: { type: "text",   label: "Company Name",   required: true,  maxLength: 100, colWidth: 6 } },
  { name: "email",         rules: { type: "email",  label: "Email",          required: true,  maxLength: 100, colWidth: 6 } },
  { name: "contactNumber", rules: { type: "text",   label: "Contact Number", required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "website",       rules: { type: "text",   label: "Website",        required: false, maxLength: 100, colWidth: 6 } },
  { name: "taxNumber",     rules: { type: "text",   label: "Tax Number",     required: false, maxLength: 50,  colWidth: 6 } },
  { name: "invoicePrefix", rules: { type: "text",   label: "Invoice Prefix", required: false, maxLength: 20,  colWidth: 6 } },
  { name: "addressLine1",  rules: { type: "text",   label: "Address Line 1", required: false, maxLength: 200, colWidth: 6 } },
  { name: "addressLine2",  rules: { type: "text",   label: "Address Line 2", required: false, maxLength: 200, colWidth: 6 } },
  { name: "city",          rules: { type: "text",   label: "City",           required: false, maxLength: 100, colWidth: 6 } },
  { name: "state",         rules: { type: "text",   label: "State",          required: false, maxLength: 100, colWidth: 6 } },
  { name: "country",       rules: { type: "text",   label: "Country",        required: false, maxLength: 100, colWidth: 6 } },
  { name: "zipCode",       rules: { type: "text",   label: "Zip Code",       required: false, maxLength: 20,  colWidth: 6 } },
  { name: "isActive",      rules: { type: "toggle", label: "Active",                                          colWidth: 6 } },
];

const CompanyEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {

  const handleFetch = async (id: string | number) => {
    return await CompanyService.getById(Number(id));
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    const payload: Partial<Company> = {
      companyId:     Number(id),
      comapanyName:  formData.comapanyName,
      email:         formData.email,
      contactNumber: formData.contactNumber,
      website:       formData.website,
      taxNumber:     formData.taxNumber,
      invoicePrefix: formData.invoicePrefix,
      addressLine1:  formData.addressLine1,
      addressLine2:  formData.addressLine2,
      city:          formData.city,
      state:         formData.state,
      country:       formData.country,
      zipCode:       formData.zipCode,
      isActive:      formData.isActive ?? true,
    };
    await CompanyService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  return (
    <KiduEditModal
      show={show}
      onHide={onHide}
      title="Edit Company"
      subtitle="Update Company details"
      fields={fields}
      recordId={recordId}
      onFetch={handleFetch}
      onUpdate={handleUpdate}
      successMessage="Company updated successfully!"
      onSuccess={onSuccess}
    />
  );
};

export default CompanyEditModal;
