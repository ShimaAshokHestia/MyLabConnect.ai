import React from "react";
import { Dropdown } from "react-bootstrap";
import { BsPerson, BsKeyFill, BsBoxArrowRight } from "react-icons/bs";

interface KiduNavbarDropdownProps {
  show: boolean;
  name: string;
  email: string;
  onToggle: (show: boolean) => void;
  onProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const KiduNavbarDropdown: React.FC<KiduNavbarDropdownProps> = ({
  show,
  name,
  email,
  onToggle,
  onProfile,
  onChangePassword,
  onLogout,
}) => {
  return (
    <Dropdown show={show} onToggle={onToggle} align="end">
      <Dropdown.Toggle
        as="span"
        style={{ display: "none" }}
        id="profile-dropdown-toggle"
      />

      <Dropdown.Menu className="shadow-sm" style={{ minWidth: "200px", borderRadius: "8px" }}>
        
        {/* User Info Header */}
        <Dropdown.Header>
          <div className="fw-semibold">{name}</div>
          <small className="text-muted">{email}</small>
        </Dropdown.Header>

        <Dropdown.Divider />

        {/* Profile */}
        <Dropdown.Item onClick={onProfile} className="d-flex align-items-center gap-2">
          <BsPerson size={16} />
          Profile
        </Dropdown.Item>

        {/* Change Password */}
        <Dropdown.Item onClick={onChangePassword} className="d-flex align-items-center gap-2">
          <BsKeyFill size={16} />
          Change Password
        </Dropdown.Item>

        <Dropdown.Divider />

        {/* Sign Out */}
        <Dropdown.Item onClick={onLogout} className="d-flex align-items-center gap-2 text-danger">
          <BsBoxArrowRight size={16} />
          Sign Out
        </Dropdown.Item>

      </Dropdown.Menu>
    </Dropdown>
  );
};

export default KiduNavbarDropdown;