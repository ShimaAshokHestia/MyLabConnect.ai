import React, { useState } from "react";
import type { Field } from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { User } from "../../../Types/User Mangement/User.types";
import UserService from "../../../Services/User Management/User.services";
import KiduCreateModal from "../../../../KIDU_COMPONENTS/KiduCreateModal";
import type { Company } from "../../../Types/Company/Company.types";
import type { UserType } from "../../../Types/User Mangement/UserTypes.types";
import CompanyPopup from "../../Company/CompanyPopup";
import UserTypePopup from "../User Type/UserTypePopup";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
}

const fields: Field[] = [
  { name: "userName",           rules: { type: "text",     label: "User Name",           required: true,  maxLength: 100, colWidth: 6 } },
  { name: "userEmail",          rules: { type: "email",    label: "Email",               required: true,  maxLength: 100, colWidth: 6 } },
  { name: "phoneNumber",        rules: { type: "text",     label: "Phone Number",        required: true,  maxLength: 20,  colWidth: 6 } },
  { name: "address",            rules: { type: "text",     label: "Address",             required: false, maxLength: 200, colWidth: 6 } },
  { name: "passwordHash",       rules: { type: "password", label: "Password",            required: true,  maxLength: 100, colWidth: 6 } },
  { name: "userTypeId",         rules: { type: "popup",    label: "User Type",           required: true,  colWidth: 6 } },
  { name: "companyId",          rules: { type: "popup",    label: "Company",             required: true,  colWidth: 6 } },
  { name: "authenticationType", rules: { type: "select",   label: "Authentication Type", required: true,  colWidth: 6 } },
  { name: "rowbreak1",          rules: { type: "rowbreak", label: "" } },
  { name: "isActive",           rules: { type: "toggle",   label: "Active",              colWidth: 4 } },
  { name: "islocked",           rules: { type: "toggle",   label: "Locked",              colWidth: 4 } },
  { name: "isDeleted",          rules: { type: "toggle",   label: "Deleted",             colWidth: 4 } },
];

const authenticationTypeOptions = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO"    },
  { value: 3, label: "Basic"  },
];

const UserCreateModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [showUserTypePopup, setShowUserTypePopup] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleSubmit = async (formData: Record<string, any>) => {
    // Validate selections
    if (!selectedUserType) {
      throw new Error("Please select a User Type");
    }
    if (!selectedCompany) {
      throw new Error("Please select a Company");
    }

    // Make sure we have valid IDs
    const userTypeId = selectedUserType.id;
    const companyId = selectedCompany.companyId;

    if (!userTypeId) {
      throw new Error("Selected User Type has no ID");
    }
    if (!companyId) {
      throw new Error("Selected Company has no ID");
    }

    const payload: Partial<User> = {
      userName:           formData.userName,
      userEmail:          formData.userEmail,
      phoneNumber:        formData.phoneNumber,
      address:            formData.address,
      passwordHash:       formData.passwordHash,
      userTypeId:         userTypeId, // Use id from UserType interface
      companyId:          companyId,
      authenticationType: Number(formData.authenticationType),
      isActive:           formData.isActive  ?? true,
      islocked:           formData.islocked  ?? false,
      isDeleted:          formData.isDeleted ?? false,
    };
    
    await UserService.create(payload);
  };

  const popupHandlers = {
    userTypeId: {
      value: selectedUserType?.userTypeName || "", // Use userTypeName from UserType interface
      actualValue: selectedUserType?.id, // Use id from UserType interface
      onOpen: () => setShowUserTypePopup(true)
    },
    companyId: {
      value: selectedCompany?.comapanyName || "", // Use comapanyName (note the typo from API)
      actualValue: selectedCompany?.companyId,
      onOpen: () => setShowCompanyPopup(true)
    }
  };

  return (
    <>
      <KiduCreateModal
        show={show}
        onHide={onHide}
        title="Add User"
        subtitle="Create a new User"
        fields={fields}
        onSubmit={handleSubmit}
        successMessage="User created successfully!"
        onSuccess={onSuccess}
        options={{ authenticationType: authenticationTypeOptions }}
        popupHandlers={popupHandlers}
      />
      
      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={(company) => {
          setSelectedCompany(company);
          setShowCompanyPopup(false);
        }}
        showAddButton={true}
      />
      
      <UserTypePopup
        show={showUserTypePopup}
        handleClose={() => setShowUserTypePopup(false)}
        onSelect={(userType) => {
          setSelectedUserType(userType);
          setShowCompanyPopup(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default UserCreateModal;