import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  Shield,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import AuthService from "../Services/AuthServices/Auth.services";
import type { AuthUser } from "../Types/Auth/Auth.types";

interface KiduProfileModalProps {
  show: boolean;
  onHide: () => void;
  onChangePassword?: () => void;
}

const KiduProfileModal: React.FC<KiduProfileModalProps> = ({
  show,
  onHide,
  onChangePassword,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!show) return;
    const u = AuthService.getUser();
    setUser(u);
  }, [show]);

  const getUserInitials = (name: string): string =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header
        closeButton
        style={{
          background: "var(--theme-bg-paper)",
          borderBottom: "1px solid var(--theme-border)",
          padding: "1rem 1.5rem",
        }}
      >
        <Modal.Title
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--theme-text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <User size={18} style={{ color: "var(--theme-primary)" }} />
          My Profile
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          background: "var(--theme-bg-paper)",
          padding: "0",
        }}
      >
        {!user ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" size="sm" style={{ color: "var(--theme-primary)" }} />
          </div>
        ) : (
          <>
            {/* ── Hero Banner ─────────────────────────────── */}
            <div
              style={{
                background: "linear-gradient(135deg, var(--theme-primary) 0%, #c0082a 100%)",
                padding: "2rem 1.5rem 3.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  right: "80px",
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                }}
              />

              <div className="d-flex align-items-center gap-3">
                {/* Avatar */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {getUserInitials(user.userName)}
                </div>

                {/* Name + role */}
                <div>
                  <h5
                    style={{
                      color: "white",
                      fontWeight: 700,
                      margin: 0,
                      fontSize: "1.1rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {user.userName}
                  </h5>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "2px 10px",
                        borderRadius: "20px",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {user.userTypeName}
                    </span>
                    <span
                      style={{
                        background: user.isActive
                          ? "rgba(34,197,94,0.25)"
                          : "rgba(239,68,68,0.25)",
                        color: user.isActive ? "#bbf7d0" : "#fecaca",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "2px 10px",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {user.isActive ? (
                        <CheckCircle size={10} />
                      ) : (
                        <XCircle size={10} />
                      )}
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Info Cards ───────────────────────────────── */}
            <div
              style={{
                padding: "0 1.5rem 1.5rem",
                marginTop: "-1.75rem",
                background: "var(--theme-bg-paper)",
              }}
            >
              {/* Company card - elevated */}
              <div
                style={{
                  background: "var(--theme-bg-elevated, #fff)",
                  border: "1px solid var(--theme-border)",
                  borderRadius: "10px",
                  padding: "0.9rem 1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    background: "rgba(239,13,80,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <Building2 size={17} style={{ color: "var(--theme-primary)" }} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--theme-text-secondary)",
                      marginBottom: "1px",
                    }}
                  >
                    Company
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--theme-text-primary)",
                    }}
                  >
                    {user.companyName || "—"}
                  </div>
                </div>
              </div>

              {/* Grid of detail fields */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.625rem",
                }}
              >
                {[
                  {
                    icon: <Mail size={15} />,
                    label: "Email",
                    value: user.userEmail,
                  },
                  {
                    icon: <Phone size={15} />,
                    label: "Phone",
                    value: user.phoneNumber || "—",
                  },
                  {
                    icon: <MapPin size={15} />,
                    label: "Address",
                    value: user.address || "—",
                  },
                  {
                    icon: <Shield size={15} />,
                    label: "Account Status",
                    value: user.islocked ? "🔒 Locked" : "✓ Unlocked",
                  },
                  {
                    icon: <Calendar size={15} />,
                    label: "Created At",
                    value: user.createAtString || formatDate(user.createdAt),
                  },
                  {
                    icon: <Clock size={15} />,
                    label: "Last Login",
                    value: user.lastloginString || formatDate(user.lastlogin),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--theme-bg-hover)",
                      border: "1px solid var(--theme-border)",
                      borderRadius: "8px",
                      padding: "0.7rem 0.875rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.625rem",
                    }}
                  >
                    <div
                      style={{
                        color: "var(--theme-primary)",
                        marginTop: "1px",
                        flexShrink: 0,
                        opacity: 0.8,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--theme-text-secondary)",
                          marginBottom: "2px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          fontWeight: 500,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: "var(--theme-text-primary)",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer
        style={{
          background: "var(--theme-bg-paper)",
          borderTop: "1px solid var(--theme-border)",
          padding: "0.75rem 1.5rem",
          gap: "0.5rem",
        }}
      >
        {onChangePassword && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onChangePassword}
            style={{
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text-secondary)",
            }}
          >
            <Lock size={13} />
            Change Password
          </Button>
        )}
        <Button
          size="sm"
          onClick={onHide}
          style={{
            fontSize: "0.8rem",
            background: "var(--theme-primary)",
            border: "none",
            marginLeft: "auto",
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KiduProfileModal;