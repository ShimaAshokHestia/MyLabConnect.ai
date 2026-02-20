import React from "react";
import KiduPopup from "../../../KIDU_COMPONENTS/KiduPopup";
import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import type { Company } from "../../Types/Company/Company.types";
import CompanyCreateModal from "./CompanyCreateModal";

interface CompanyPopupProps {
  show: boolean;
  handleClose: () => void;
  onSelect: (company: Company) => void;
  showAddButton?: boolean;
  title?: string;
}

const CompanyPopup: React.FC<CompanyPopupProps> = ({
  show,
  handleClose,
  onSelect,
  showAddButton = true,
  title = "Select Company"
}) => {
  const columns = [
    { key: "companyId" as keyof Company, label: "ID" },
    { key: "comapanyName" as keyof Company, label: "Company Name" },
    { key: "email" as keyof Company, label: "Email" },
    { key: "contactNumber" as keyof Company, label: "Contact" },
    { 
      key: "isActive" as keyof Company, 
      label: "Status",
      render: (value: boolean) => (
        <span style={{ 
          color: value ? '#28a745' : '#dc3545',
          fontWeight: 500
        }}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <KiduPopup<Company>
      show={show}
      handleClose={handleClose}
      title={title}
      fetchEndpoint={API_ENDPOINTS.COMPANY.GET_ALL}
      columns={columns}
      onSelect={onSelect}
      AddModalComponent={CompanyCreateModal}
      idKey="companyId"
      showAddButton={showAddButton}
      rowsPerPage={10}
      searchKeys={["comapanyName", "email", "contactNumber", "city", "country"]}
    />
  );
};

export default CompanyPopup;