import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaMoneyBillWave, FaHandHoldingUsd, FaUsers } from "react-icons/fa";

// Color Palette
const PRIMARY_COLOR = "#0f2a55";
const SUCCESS_COLOR = "#28a745";
const WARNING_COLOR = "#ff9800";
const INFO_COLOR = "#17a2b8";
const DANGER_COLOR = "#dc3545";

const ProgressBar: React.FC = () => {
  return (
    <Row>
      {/* Top Performing States */}
      <Col xs={12} md={6} className="mb-4">
        <Card className="shadow-sm border-0 h-100">
          <Card.Body className="p-4">
            <Card.Title className="fw-bold fs-6 mb-4 head-font" style={{ color: PRIMARY_COLOR }}>
              Top Performing States
            </Card.Title>

            {/* Karnataka */}
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #1a4080)`,
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "white", fontWeight: "600" }}>KA</span>
                  </div>
                  <span className="fw-semibold head-font" style={{ fontSize: "14px", color: "#333" }}>
                    Karnataka
                  </span>
                </div>
                <span className="fw-bold" style={{ fontSize: "14px", color: PRIMARY_COLOR }}>85%</span>
              </div>
              <div
                className="rounded"
                style={{
                  height: "8px",
                  background: "#e9ecef",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "85%",
                    height: "100%",
                    borderRadius: "8px",
                    background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #1a4080)`,
                  }}
                ></div>
              </div>
            </div>

            {/* Maharashtra */}
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: `linear-gradient(135deg, ${SUCCESS_COLOR}, #20c997)`,
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "white", fontWeight: "600" }}>MH</span>
                  </div>
                  <span className="fw-semibold head-font" style={{ fontSize: "14px", color: "#333" }}>
                    Maharashtra
                  </span>
                </div>
                <span className="fw-bold" style={{ fontSize: "14px", color: SUCCESS_COLOR }}>72%</span>
              </div>
              <div
                className="rounded"
                style={{
                  height: "8px",
                  background: "#e9ecef",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "72%",
                    height: "100%",
                    borderRadius: "8px",
                    background: `linear-gradient(90deg, ${SUCCESS_COLOR}, #20c997)`,
                  }}
                ></div>
              </div>
            </div>

            {/* Tamil Nadu */}
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: `linear-gradient(135deg, ${WARNING_COLOR}, #ffa726)`,
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "white", fontWeight: "600" }}>TN</span>
                  </div>
                  <span className="fw-semibold head-font" style={{ fontSize: "14px", color: "#333" }}>
                    Tamil Nadu
                  </span>
                </div>
                <span className="fw-bold" style={{ fontSize: "14px", color: WARNING_COLOR }}>68%</span>
              </div>
              <div
                className="rounded"
                style={{
                  height: "8px",
                  background: "#e9ecef",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "68%",
                    height: "100%",
                    borderRadius: "8px",
                    background: `linear-gradient(90deg, ${WARNING_COLOR}, #ffa726)`,
                  }}
                ></div>
              </div>
            </div>

            {/* Kerala */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: `linear-gradient(135deg, ${INFO_COLOR}, #138496)`,
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "white", fontWeight: "600" }}>KL</span>
                  </div>
                  <span className="fw-semibold head-font" style={{ fontSize: "14px", color: "#333" }}>
                    Kerala
                  </span>
                </div>
                <span className="fw-bold" style={{ fontSize: "14px", color: INFO_COLOR }}>54%</span>
              </div>
              <div
                className="rounded"
                style={{
                  height: "8px",
                  background: "#e9ecef",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "54%",
                    height: "100%",
                    borderRadius: "8px",
                    background: `linear-gradient(90deg, ${INFO_COLOR}, #138496)`,
                  }}
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Recent Activities */}
      <Col xs={12} md={6} className="mb-4">
        <Card className="shadow-sm border-0 h-100">
          <Card.Body className="p-4">
            <Card.Title className="fw-bold fs-6 mb-4 head-font" style={{ color: PRIMARY_COLOR }}>
              Recent Activities
            </Card.Title>
            
            <div className="d-flex flex-column gap-3">
              {/* Activity 1 */}
              <div className="d-flex align-items-start gap-3 pb-3 border-bottom">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: SUCCESS_COLOR + "15",
                    color: SUCCESS_COLOR,
                  }}
                >
                  <FaMoneyBillWave size={18} />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 fw-semibold sub-font" style={{ fontSize: "14px", color: "#333" }}>
                    New contribution received
                  </p>
                  <small className="text-muted" style={{ fontSize: "12px" }}>
                    Member #12345 - ₹5,000
                  </small>
                  <br />
                  <small className="text-muted" style={{ fontSize: "11px" }}>
                    2 hours ago
                  </small>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="d-flex align-items-start gap-3 pb-3 border-bottom">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: DANGER_COLOR + "15",
                    color: DANGER_COLOR,
                  }}
                >
                  <FaHandHoldingUsd size={18} />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 fw-semibold sub-font" style={{ fontSize: "14px", color: "#333" }}>
                    Death claim processed
                  </p>
                  <small className="text-muted" style={{ fontSize: "12px" }}>
                    Claim #DC2026-045 - ₹1,50,000
                  </small>
                  <br />
                  <small className="text-muted" style={{ fontSize: "11px" }}>
                    5 hours ago
                  </small>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="d-flex align-items-start gap-3 pb-2">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: INFO_COLOR + "15",
                    color: INFO_COLOR,
                  }}
                >
                  <FaUsers size={18} />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 fw-semibold sub-font" style={{ fontSize: "14px", color: "#333" }}>
                    New member registered
                  </p>
                  <small className="text-muted" style={{ fontSize: "12px" }}>
                    Karnataka Branch
                  </small>
                  <br />
                  <small className="text-muted" style={{ fontSize: "11px" }}>
                    1 day ago
                  </small>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProgressBar;