import React, { useRef } from "react";
import type { Field } from "../../../KIDU_COMPONENTS/KiduCreateModal";
import type { Company } from "../../Types/Company/Company.types";
import CompanyService from "../../Services/Company/Company.services";
import KiduCreateModal from "../../../KIDU_COMPONENTS/KiduCreateModal";

interface Props {
  show: boolean;
  handleClose: () => void;
  onAdded: (newCompany: Company) => void;
}

const fields: Field[] = [
  { name: "comapanyName",  rules: { type: "text",  label: "Company Name",   required: true,  maxLength: 100, colWidth: 6 } },
  { name: "email",         rules: { type: "email", label: "Email",          required: true,  maxLength: 100, colWidth: 6 } },
  { name: "contactNumber", rules: { type: "text",  label: "Contact Number", required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "website",       rules: { type: "text",  label: "Website",        required: false, maxLength: 100, colWidth: 6 } },
  { name: "taxNumber",     rules: { type: "text",  label: "Tax Number",     required: false, maxLength: 50,  colWidth: 6 } },
  { name: "invoicePrefix", rules: { type: "text",  label: "Invoice Prefix", required: false, maxLength: 20,  colWidth: 6 } },
  { name: "addressLine1",  rules: { type: "text",  label: "Address Line 1", required: false, maxLength: 200, colWidth: 6 } },
  { name: "addressLine2",  rules: { type: "text",  label: "Address Line 2", required: false, maxLength: 200, colWidth: 6 } },
  { name: "city",          rules: { type: "text",  label: "City",           required: false, maxLength: 100, colWidth: 6 } },
  { name: "state",         rules: { type: "text",  label: "State",          required: false, maxLength: 100, colWidth: 6 } },
  { name: "country",       rules: { type: "text",  label: "Country",        required: false, maxLength: 100, colWidth: 6 } },
  { name: "zipCode",       rules: { type: "text",  label: "Zip Code",       required: false, maxLength: 20,  colWidth: 6 } },
  { name: "rowbreak1",     rules: { type: "rowbreak", label: "" } },
  { name: "isActive",      rules: { type: "toggle", label: "Active",        colWidth: 6 } },
];

const CompanyCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
  // Store the created data to use in onSuccess
  const createdDataRef = useRef<any>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<Company> = {
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
    
    const response = await CompanyService.create(payload);
    
    // Store the response for onSuccess to use
    createdDataRef.current = response;
    
    // Return the created company with its ID
    // Handle different response structures
    if (response?.value) {
      return response.value;
    } else if (response?.data) {
      return response.data;
    } else {
      return response;
    }
  };

  const handleSuccess = () => {
    // Get the stored response
    const response = createdDataRef.current;
    
    // Extract the company from the response
    const newCompany = response?.value || response?.data || response;
    
    // If we have the company data, pass it back
    if (newCompany && (newCompany.companyId || newCompany.id)) {
      onAdded(newCompany);
    } else {
      // If we don't have the full data, we might need to fetch it
      // But since we don't have an ID, we can't fetch
      console.warn("Could not get created company data", response);
    }
    
    // Clear the ref
    createdDataRef.current = null;
    
    // Close the modal
    handleClose();
  };

  return (
    <KiduCreateModal
      show={show}
      onHide={handleClose}
      title="Create Company"
      subtitle="Add new Company"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="Company created successfully!"
      onSuccess={handleSuccess} // Now this is a function with no parameters
    />
  );
};

export default CompanyCreateModal;