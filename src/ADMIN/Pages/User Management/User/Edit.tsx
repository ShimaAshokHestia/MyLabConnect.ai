import React, { useState } from "react";
import type { Field } from "../../../../KIDU_COMPONENTS/KiduEditModal";
import UserService from "../../../Services/User Management/User.services";
import type { User } from "../../../Types/User Mangement/User.types";
import KiduEditModal from "../../../../KIDU_COMPONENTS/KiduEditModal";
import type { Company } from "../../../Types/Company/Company.types";
import type { UserType } from "../../../Types/User Mangement/UserTypes.types";
import CompanyPopup from "../../Company/CompanyPopup";
import UserTypePopup from "../User Type/UserTypePopup";

interface Props {
  show:      boolean;
  onHide:    () => void;
  onSuccess: () => void;
  recordId:  string | number;
}

const fields: Field[] = [
  { name: "userName",           rules: { type: "text",     label: "User Name",           required: true,  minLength: 3,  maxLength: 200, colWidth: 6 } },
  { name: "userEmail",          rules: { type: "email",    label: "Email",               required: true,  minLength: 4,              maxLength: 100, colWidth: 6 } },
  { name: "phoneNumber",        rules: { type: "text",     label: "Phone Number",        required: true,  minLength: 10,  maxLength: 20,  colWidth: 6 } },
  { name: "address",            rules: { type: "text",     label: "Address",             required: false, minLength: 5,           maxLength: 500, colWidth: 6 } },
  { name: "userTypeId",         rules: { type: "popup",    label: "User Type",           required: true,                               colWidth: 6 } },
  { name: "companyId",          rules: { type: "popup",    label: "Company",             required: true,                               colWidth: 6 } },
  { name: "authenticationType", rules: { type: "select",   label: "Authentication Type", required: true,                               colWidth: 6 } },
  { name: "rowbreak1",          rules: { type: "rowbreak", label: "" } },
  { name: "isActive",           rules: { type: "toggle",   label: "Active",                                                            colWidth: 4 } },
  { name: "islocked",           rules: { type: "toggle",   label: "Locked",                                                            colWidth: 4 } },
];

const authenticationTypeOptions = [
  { value: 1, label: "Normal" },
  { value: 2, label: "SSO"    },
  { value: 3, label: "Basic"  },
];

const UserEditModal: React.FC<Props> = ({ show, onHide, onSuccess, recordId }) => {
  const [showCompanyPopup,  setShowCompanyPopup]  = useState(false);
  const [showUserTypePopup, setShowUserTypePopup] = useState(false);

  const [selectedCompany,  setSelectedCompany]  = useState<Company | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleFetch = async (id: string | number) => {
    const response = await UserService.getById(Number(id));

    // Pre-populate popup display labels from fetched data
    const data = response?.value ?? response;
    if (data) {
      if (data.userTypeName && data.userTypeId) {
        setSelectedUserType({ id: data.userTypeId, userTypeName: data.userTypeName } as UserType);
      }
      if (data.companyName && data.companyId) {
        setSelectedCompany({ companyId: data.companyId, comapanyName: data.companyName } as Company);
      }
    }

    return response;
  };

  const handleUpdate = async (id: string | number, formData: Record<string, any>) => {
    if (!selectedUserType) throw new Error("Please select a User Type");
    if (!selectedCompany)  throw new Error("Please select a Company");

    const payload: Partial<User> = {
      id:                 Number(id),
      userName:           formData.userName,
      userEmail:          formData.userEmail,
      phoneNumber:        formData.phoneNumber,
      address:            formData.address,
      userTypeId:         selectedUserType.id,
      companyId:          selectedCompany.companyId,
      authenticationType: Number(formData.authenticationType),
      isActive:           formData.isActive  ?? true,
      islocked:           formData.islocked  ?? false,
      isDeleted:          formData.isDeleted ?? false,
    };

    await UserService.update(Number(id), payload);
    return { isSucess: true, value: payload };
  };

  // Reset popup selections when modal closes
  const handleHide = () => {
    setSelectedCompany(null);
    setSelectedUserType(null);
    onHide();
  };

  const popupHandlers = {
    userTypeId: {
      value:        selectedUserType?.userTypeName ?? "",
      actualValue:  selectedUserType?.id,
      onOpen:       () => setShowUserTypePopup(true),
      onClear:      () => setSelectedUserType(null),
    },
    companyId: {
      value:        selectedCompany?.comapanyName ?? "",
      actualValue:  selectedCompany?.companyId,
      onOpen:       () => setShowCompanyPopup(true),
      onClear:      () => setSelectedCompany(null),
    },
  };

  return (
    <>
      <KiduEditModal
        show={show}
        onHide={handleHide}
        title="Edit User"
        subtitle="Update User details"
        fields={fields}
        recordId={recordId}
        onFetch={handleFetch}
        onUpdate={handleUpdate}
        successMessage="User updated successfully!"
        onSuccess={onSuccess}
        options={{ authenticationType: authenticationTypeOptions }}
        popupHandlers={popupHandlers}
      />

      <CompanyPopup
        show={showCompanyPopup}
        handleClose={() => setShowCompanyPopup(false)}
        onSelect={(company: Company) => {
          setSelectedCompany(company);
          setShowCompanyPopup(false);
        }}
        showAddButton={true}
      />

      <UserTypePopup
        show={showUserTypePopup}
        handleClose={() => setShowUserTypePopup(false)}
        onSelect={(userType: UserType) => {
          setSelectedUserType(userType);
          setShowUserTypePopup(false);
        }}
        showAddButton={true}
      />
    </>
  );
};

export default UserEditModal;