// KiduAuditLogs.tsx
import React, { useEffect, useState } from "react";
import { Modal, Table, Spinner, Alert, Collapse } from "react-bootstrap";
import "./KiduAuditLogs.css";
import type { AuditTrails } from "../Types/Auditlog.types";
import AuditLogService from "../Services/KiduServices/Auditlog.services";

interface AuditTrailsProps {
  tableName: string;
  recordId: string | number;
}

const KiduAuditLogs: React.FC<AuditTrailsProps> = ({ tableName, recordId }) => {
  const [history, setHistory] = useState<AuditTrails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI state only
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (tableName && recordId) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName, recordId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AuditLogService.getByTableAndId(tableName, recordId);
      console.log("Fetched audit logs:", data);

      if (data.isSucess && Array.isArray(data.value)) {
        setHistory(data.value);
        console.log("History updated:", data.value);
      } else {
        console.warn("Unexpected data format:", data);
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to fetch edit history:", err);
      setError("Failed to load edit history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated history:", history);
  }, [history]);

  const formatDateSafe = (isoOrAny?: string) => {
    if (!isoOrAny) return "—";
    const d = new Date(isoOrAny);
    if (isNaN(d.getTime())) return isoOrAny;
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleOpen = () => {
    setExpandedIdx(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setExpandedIdx(null);
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <div className="al-trigger-wrap mt-4 mb-2">
        <button className="al-trigger-btn" onClick={handleOpen}>
          <span className="al-trigger-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="9" y1="16" x2="13" y2="16" />
            </svg>
          </span>
          Audit Logs
          {!loading && history.length > 0 && (
            <span className="al-count-badge">{history.length}</span>
          )}
        </button>
      </div>

      {/* ── Modal ── */}
      <Modal
        show={modalOpen}
        onHide={handleClose}
        centered
        size="lg"
        scrollable
        className="al-modal"
      >
        {/* Header */}
        <Modal.Header className="al-modal-header" closeButton>
          <div className="al-modal-title-wrap">
            <span className="al-modal-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
            </span>
            <span className="al-modal-title">Audit Logs</span>
            {!loading && history.length > 0 && (
              <span className="al-modal-count">{history.length} entries</span>
            )}
          </div>
        </Modal.Header>

        {/* Body */}
        <Modal.Body className="al-modal-body">
          {loading ? (
            <div className="al-state-center">
              <Spinner animation="border" size="sm" className="al-spinner" />
              <span className="al-state-text">Loading audit logs…</span>
            </div>
          ) : error ? (
            <Alert variant="danger" className="al-alert">
              {error}
            </Alert>
          ) : history.length === 0 ? (
            <div className="al-state-center">
              <span className="al-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              <span className="al-state-text">No audit history available.</span>
            </div>
          ) : (
            <div className="al-list">
              {history.map((item, idx) => {
                const isOpen = expandedIdx === idx;
                return (
                  <div key={item.logID} className={`al-entry ${isOpen ? "is-open" : ""}`}>

                    {/* Entry row */}
                    <button
                      className="al-entry-row"
                      onClick={() => setExpandedIdx(isOpen ? null : idx)}
                    >
                      <span className={`al-pill al-pill--${item.action?.toLowerCase()}`}>
                        {item.action}
                      </span>

                      <span className="al-meta-user">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {item.changedBy}
                      </span>

                      <span className="al-meta-date">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {formatDateSafe(item.changedAt)}
                      </span>

                      {item.changes?.length > 0 && (
                        <span className="al-fields-tag">
                          {item.changes.length} field{item.changes.length > 1 ? "s" : ""}
                        </span>
                      )}

                      <span
                        className="al-chevron"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    {/* Expandable detail */}
                    <Collapse in={isOpen}>
                      <div>
                        <div className="al-entry-detail">
                          <div className="table-responsive">
                            <Table bordered size="sm" className="al-table mb-0">
                              <thead>
                                <tr>
                                  <th style={{ width: "5%" }}>#</th>
                                  <th style={{ width: "25%" }}>Field</th>
                                  <th style={{ width: "35%" }}>Previous</th>
                                  <th style={{ width: "35%" }}>New</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.changes?.length > 0 ? (
                                  item.changes.map((change, i) => (
                                    <tr key={i}>
                                      <td className="text-center al-td-muted">{i + 1}</td>
                                      <td className="al-td-field">{change.item || ""}</td>
                                      <td className="al-td-from">{change.from || "—"}</td>
                                      <td className="al-td-to">{change.to || "—"}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="text-center al-td-muted py-3">
                                      No field-level changes recorded.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                );
              })}
            </div>
          )}
        </Modal.Body>

        {/* Footer */}
        <Modal.Footer className="al-modal-footer">
          <button className="al-close-btn" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default KiduAuditLogs;