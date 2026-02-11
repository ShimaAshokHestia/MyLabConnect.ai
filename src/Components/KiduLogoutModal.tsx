import React from "react";
import { Modal, Button } from "react-bootstrap";
import { LogOut } from "lucide-react";
import "../PUBLIC-PORTAL/Style/Auth.css";

interface KiduLogoutModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const KiduLogoutModal: React.FC<KiduLogoutModalProps> = ({
  show,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop="static"
      dialogClassName="auth-modal"
    >
      <Modal.Body>
        {/* HEADER (same style as login) */}
        <div className="auth-div">
          <div className="auth-icon">
            <LogOut size={30} className="auth-icon-red" />
          </div>
          <div className="auth-title">Confirm Logout</div>
          <div className="auth-sub">
            You are about to sign out of your account
          </div>
        </div>

        {/* BODY */}
        <div className="auth-body text-center">
          <p className="mb-4 text-muted">
            Are you sure you want to logout?
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="secondary"
              onClick={onCancel}
              style={{ minWidth: "120px" }}
            >
              Cancel
            </Button>

            <Button
              className="auth-logoutbtn"
              onClick={onConfirm}
              style={{ minWidth: "120px" }}
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default KiduLogoutModal;
