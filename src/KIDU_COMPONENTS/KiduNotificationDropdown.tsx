import React from "react";
import { Dropdown, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Clock,
  AlertCircle,
  Users,
  CreditCard,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "member" | "payment";
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New Member Registration",
    message: "John Doe has registered as a new member",
    time: "5 min ago",
    type: "member",
    read: false,
  },
  {
    id: "2",
    title: "Contribution Received",
    message: "₹5,000 contribution from Staff #12345",
    time: "1 hour ago",
    type: "payment",
    read: false,
  },
  {
    id: "3",
    title: "Claim Approved",
    message: "Claim #CLM-2024-001 has been approved",
    time: "2 hours ago",
    type: "success",
    read: false,
  },
  {
    id: "4",
    title: "System Update",
    message: "System maintenance scheduled for tonight",
    time: "5 hours ago",
    type: "warning",
    read: true,
  },
  {
    id: "5",
    title: "Monthly Report Ready",
    message: "January 2024 report is now available",
    time: "1 day ago",
    type: "info",
    read: true,
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <Check size={16} className="text-success" />;
    case "warning":
      return <AlertCircle size={16} style={{ color: "#f5c542" }} />;
    case "member":
      return <Users size={16} style={{ color: "#0f2a55" }} />;
    case "payment":
      return <CreditCard size={16} className="text-success" />;
    default:
      return <Clock size={16} className="text-muted" />;
  }
};

const NAVY = "#0f2a55";
const GOLD = "#f5c542";

const AdminNotificationDropdown: React.FC = () => {
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recent = notifications.filter((n) => !n.read);
  const earlier = notifications.filter((n) => n.read);

  return (
    <Dropdown align="end">
      {/* Trigger */}
      <Dropdown.Toggle
        as="span"
        className="position-relative cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge
            pill
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle"
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      {/* Menu */}
      <Dropdown.Menu
        className="shadow"
        style={{ width: "320px", padding: 0 }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
          <span style={{ fontWeight: 600, color: NAVY }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              className="px-2 py-1 rounded-pill"
              style={{
                backgroundColor: "rgba(245,197,66,0.2)",
                color: "#a36a00",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Scroll Area */}
        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
          {/* Recent */}
          {recent.length > 0 && (
            <>
              <div className="px-3 pt-2 text-uppercase text-muted small fw-semibold">
                Recent
              </div>
              {recent.map((n) => (
                <Dropdown.Item
                  key={n.id}
                  className="d-flex gap-3 align-items-start px-3 py-3"
                >
                  <div className="p-2 bg-light rounded-circle">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-grow-1">
                    <div className="fw-medium text-truncate">
                      {n.title}
                    </div>
                    <div className="text-muted small">
                      {n.message}
                    </div>
                    <div
                      className="small mt-1"
                      style={{ color: "#a36a00" }}
                    >
                      {n.time}
                    </div>
                  </div>

                  <div
                    className="rounded-circle mt-2"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: GOLD,
                    }}
                  />
                </Dropdown.Item>
              ))}
            </>
          )}

          {/* Earlier */}
          {earlier.length > 0 && (
            <>
              <div className="px-3 pt-3 text-uppercase text-muted small fw-semibold">
                Earlier
              </div>
              {earlier.map((n) => (
                <Dropdown.Item
                  key={n.id}
                  className="d-flex gap-3 align-items-start px-3 py-3 opacity-75"
                >
                  <div className="p-2 bg-light rounded-circle">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="flex-grow-1">
                    <div className="fw-medium text-truncate">
                      {n.title}
                    </div>
                    <div className="text-muted small">
                      {n.message}
                    </div>
                    <div className="text-muted small mt-1">
                      {n.time}
                    </div>
                  </div>
                </Dropdown.Item>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-top p-2">
          <Button
            variant="light"
            className="w-100 fw-medium"
            style={{ color: NAVY }}
            onClick={() => navigate("/dashboard/notifications")}
          >
            View All Notifications
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AdminNotificationDropdown;
