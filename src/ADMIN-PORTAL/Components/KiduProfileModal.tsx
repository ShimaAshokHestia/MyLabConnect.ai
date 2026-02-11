import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Mail, Phone, Calendar, Shield, MapPin, Building, } from "lucide-react";
import type { Member } from "../Types/Contributions/Member.types";
import MemberService from "../Services/Contributions/Member.services";
import { getFullImageUrl } from "../../CONSTANTS/API_ENDPOINTS";

interface KiduProfileModalProps {
  show: boolean;
  onHide: () => void;
}

const NAVY = "#0f2a55";
const GOLD = "#f5c542";

const KiduProfileModal: React.FC<KiduProfileModalProps> = ({
  show,
  onHide,
}) => {
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set profile image if available
        if (parsedUser.profileImageSrc) {
          setProfileImage(getFullImageUrl(parsedUser.profileImageSrc));
        }
        const memberId = parsedUser.memberId;
        if (!memberId) return;
        // Call Member API
        const response = await MemberService.getMemberById(memberId);
        if (response?.isSucess) {
          setMember(response.value);
        }
      } catch (err) {
        console.error("Failed to fetch member profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
    //   dialogClassName="admin-profile-modal"
    >
      {/* Header */}
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title style={{ color: NAVY, fontWeight: 600, fontSize: "20px" }}>
          Admin Profile
        </Modal.Title>
      </Modal.Header>
      {/* Body */}
      <Modal.Body className="py-4">
        {loading || !member || !user ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="d-flex flex-column align-items-center mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 90,
                  height: 90,
                  backgroundColor: NAVY,
                  color: "white",
                  fontSize: "30px",
                  fontWeight: 700,
                  border: `4px solid ${GOLD}`,
                  overflow: "hidden",
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  member.name?.charAt(0)
                )}
              </div>
              <h6 className="mt-2 mb-1 fw-semibold">{member.name}</h6>
              <span
                className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                style={{
                  backgroundColor: "rgba(245,197,66,0.25)",
                  color: "#a36a00",
                  fontSize: "10px",
                  fontWeight: 500,
                }}
              >
                <Shield size={11} />
                {user.role} - <span className="text-danger">Staff Number : {user.staffNo}</span>
              </span>
            </div>

            {/* Profile Details */}
            <div className="row g-3">
              {[
                { icon: <Mail size={16} color={NAVY} />, label: "Email", value: user.userEmail },
                { icon: <Phone size={16} color={NAVY} />, label: "Phone", value: user.phoneNumber },
                { icon: <Building size={16} color={NAVY} />, label: "Designation", value: member.designationName },
                { icon: <Building size={16} color={NAVY} />, label: "Category", value: member.categoryname },
                { icon: <MapPin size={16} color={NAVY} />, label: "Branch", value: member.branchName },
                { icon: <Shield size={16} color={NAVY} />, label: "Status", value: member.status },
                { icon: <Calendar size={16} color={NAVY} />, label: "Date of Joining", value: member.dojString?.split(' ').slice(0, 3).join(' ') },
                { icon: <Calendar size={16} color={NAVY} />, label: "DOB", value: member.dobString?.split(' ').slice(0, 3).join(' ') },
                { icon: <Shield size={16} color={NAVY} />, label: "Gender", value: member.gender },
                // { icon: <Building size={16} color={NAVY} />, label: "Staff No", value: member.staffNo },
              ].map((item, index) => (
                <div key={index} className="col-12 col-md-4">
                  <div
                    className="d-flex align-items-center gap-3 p-3 rounded h-100"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: 34,
                        height: 34,
                        backgroundColor: "rgba(15,42,85,0.08)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: "12px" }}>
                        {item.label}
                      </div>
                      <div className="fw-medium" style={{ fontSize: "14px" }}>
                        {item.value || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Last Login */}
            <div className="mt-4 pt-3 border-top text-center">
              <small className="text-muted">
                Last login: {new Date(user.lastlogin).toLocaleString()}
              </small>
            </div>
          </>
        )}
      </Modal.Body>
      {/* Footer */}
      <Modal.Footer className="border-top">
        <Button variant="warning" className="fs-6">
          Show Contribution
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KiduProfileModal;
