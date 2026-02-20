import React, { useRef } from "react";
import type { Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { UserType } from "../../../Types/User Mangement/UserTypes.types";
import UserTypeService from "../../../Services/User Management/UserType.services";
import KiduCreateModal from "../../../../KIDU_COMPONENTS/KiduCreateModal";

interface Props {
  show: boolean;
  handleClose: () => void;
  onAdded: (newUserType: UserType) => void;
}

const fields: Field[] = [
  { name: "userTypeName",   rules: { type: "text",   label: "User Type Name", required: true, maxLength: 100, colWidth: 12 } },
  { name: "rowbreak1",      rules: { type: "rowbreak", label: "" } },
  { name: "isActive",       rules: { type: "toggle", label: "Active",        colWidth: 6 } },
  { name: "isDeleted",      rules: { type: "toggle", label: "Deleted",       colWidth: 6 } },
  { name: "rowbreak2",      rules: { type: "rowbreak", label: "" } },
  { name: "isAdminAdable",  rules: { type: "toggle", label: "Admin Addable",  colWidth: 4 } },
  { name: "isDSOAddable",   rules: { type: "toggle", label: "DSO Addable",    colWidth: 4 } },
  { name: "isLabAddable",   rules: { type: "toggle", label: "Lab Addable",    colWidth: 4 } },
  { name: "isDoctorAddable",rules: { type: "toggle", label: "Doctor Addable", colWidth: 4 } },
  { name: "isPMAddable",    rules: { type: "toggle", label: "PM Addable",     colWidth: 4 } },
];

const UserTypeCreateModal: React.FC<Props> = ({ show, handleClose, onAdded }) => {
  // Store the created data to use in onSuccess
  const createdDataRef = useRef<any>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    const payload: Partial<UserType> = {
      userTypeName:    formData.userTypeName,
      isAdminAdable:   formData.isAdminAdable   ?? false,
      isDSOAddable:    formData.isDSOAddable    ?? false,
      isLabAddable:    formData.isLabAddable    ?? false,
      isDoctorAddable: formData.isDoctorAddable ?? false,
      isPMAddable:     formData.isPMAddable     ?? false,
      isActive:        formData.isActive         ?? true,
      isDeleted:       formData.isDeleted        ?? false,
    };
    
    const response = await UserTypeService.create(payload);
    
    // Store the response for onSuccess to use
    createdDataRef.current = response;
    
    // Return the created user type with its ID
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
    
    // Extract the user type from the response
    const newUserType = response?.value || response?.data || response;
    
    // If we have the user type data, pass it back
    if (newUserType && (newUserType.id || newUserType.userTypeId)) {
      onAdded(newUserType);
    } else {
      // If we don't have the full data, we might need to fetch it
      // But since we don't have an ID, we can't fetch
      console.warn("Could not get created user type data", response);
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
      title="Add User Type"
      subtitle="Create a new User Type"
      fields={fields}
      onSubmit={handleSubmit}
      successMessage="User Type created successfully!"
      onSuccess={handleSuccess} // Now this is a function with no parameters
    />
  );
};

export default UserTypeCreateModal;