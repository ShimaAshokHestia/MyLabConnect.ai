import React from "react";
import { Offcanvas, ListGroup, Image } from "react-bootstrap";
import { BsBug, BsPersonPlus, BsCheckCircle } from "react-icons/bs";

interface NotificationDrawerProps {
  show: boolean;
  handleClose: () => void;
}

const ActivityPanel: React.FC<NotificationDrawerProps> = ({
  show,
  handleClose,
}) => {
  const contacts = [
    "Natali Craig",
    "Drew Cano",
    "Andi Lane",
    "Koray Okumus",
    "Kate Morrison",
    "Melody Macy",
  ];

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "300px" }}>
      <Offcanvas.Header closeButton className="shadow-sm">
        <Offcanvas.Title className="head-font">Activity Panel</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ fontSize: "14px" }}>
        {/* Notifications */}
        <h6 className="fw-bold mb-2 head-font">Notifications</h6>
        <ListGroup variant="flush" className="mb-3">
          <ListGroup.Item className="border-0 d-flex align-items-start gap-2">
            <BsBug className="text-primary mt-1" />
            <div>
              <div className="head-font">You fixed a bug.</div>
              <small className="text-muted head-font">Just now</small>
            </div>
          </ListGroup.Item>

          <ListGroup.Item className="border-0 d-flex align-items-start gap-2">
            <BsPersonPlus className="text-success mt-1" />
            <div>
              <div className="head-font">New user registered.</div>
              <small className="text-muted head-font">59 minutes ago</small>
            </div>
          </ListGroup.Item>

          <ListGroup.Item className="border-0 d-flex align-items-start gap-2">
            <BsCheckCircle className="text-info mt-1" />
            <div>
              <div className="head-font">Andi Lane subscribed to you.</div>
              <small className="text-muted head-font">Today, 11:59 AM</small>
            </div>
          </ListGroup.Item>
        </ListGroup>

        {/* Activities */}
        <h6 className="fw-bold mb-2 head-font">Activities</h6>
        <ListGroup variant="flush" className="mb-3">
          {["C", "R", "S", "M", "D"].map((badge, i) => (
            <ListGroup.Item
              key={i}
              className="border-0 d-flex align-items-start gap-2"
            >
              <span className={`badge bg-${["secondary","primary","danger","warning","dark"][i]} rounded-circle`}>
                {badge}
              </span>
              <div>
                <div className="head-font">
                  {["Changed the style.", "Released a new version.", "Submitted a bug.", "Modified data in Page X.", "Deleted a page in Project X."][i]}
                </div>
                <small className="text-muted head-font">
                  {["Just now", "59 minutes ago", "12 hours ago", "Today, 11:59 AM", "Feb 2, 2025"][i]}
                </small>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Contacts */}
        <h6 className="fw-bold mb-2 head-font">Contacts</h6>
        <ListGroup variant="flush">
          {contacts.map((name, idx) => (
            <ListGroup.Item key={idx} className="border-0 d-flex align-items-center gap-2">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=random`}
                roundedCircle
                width={30}
                height={30}
              />
              <span className="head-font">{name}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ActivityPanel;
