import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";                          // ← ADDED
import Swal from "sweetalert2";                               // ← ADDED
import "../Styles/KiduStyles/KiduTabbedFormModal.css";

// ==================== TYPES ====================

export interface ViewHeaderField {
  name: string;
  label: string;
  colWidth?: 3 | 4 | 6 | 8 | 10 | 12;
  isBoolean?: boolean;
  isDate?: boolean;
  isToggle?: boolean;
  isTextarea?: boolean;
  formatter?: (value: any) => string;
}

export interface ViewTabConfig {
  key: string;
  label: string;
  columns: {
    key: string;
    label: string;
  }[];
}

export interface KiduTabbedFormViewModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  subtitle?: string;
  headerFields: ViewHeaderField[];
  tabs: ViewTabConfig[];
  recordId: string | number;
  onFetch: (id: string | number) => Promise<any>;
  mapTabData?: (data: any) => Record<string, Record<string, any>[]>;
  themeColor?: string;
  showBadge?: boolean;
  badgeText?: string;
}

// ==================== COMPONENT ====================

const KiduTabbedFormViewModal: React.FC<KiduTabbedFormViewModalProps> = ({
  show,
  onHide,
  title,
  subtitle,
  headerFields,
  tabs,
  recordId,
  onFetch,
  mapTabData,
  themeColor = "#ef0d50",
  showBadge = true,
  badgeText = "Read Only",
}) => {
  const [headerData, setHeaderData] = useState<Record<string, any>>({});
  const [tabData,    setTabData]    = useState<Record<string, Record<string, any>[]>>({});
  const [activeTab,  setActiveTab]  = useState(tabs[0]?.key ?? "");
  const [loading,    setLoading]    = useState(false);

  // ── Fetch data when modal opens ───────────────────────────────────────────
  useEffect(() => {
    if (!show || !recordId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await onFetch(recordId);

        if (!response || !response.isSucess) {
          // ── CHANGED: was just console.error + onHide() ──────────────────
          const msg = response?.customMessage || response?.error || "Failed to load record.";
          toast.error(msg, { duration: 5000 });
          await Swal.fire({
            icon: "error",
            title: "Load Failed",
            text: msg,
            confirmButtonColor: themeColor,
            confirmButtonText: "OK",
          });
          onHide();
          return;
        }

        const data = response.value;

        // ── Map header fields ──────────────────────────────────────────────
        const formattedHeader: Record<string, any> = {};
        headerFields.forEach((f) => {
          if (f.isToggle || f.isBoolean) {
            const raw = data[f.name];
            if (typeof raw === "boolean")      formattedHeader[f.name] = raw;
            else if (typeof raw === "string")  formattedHeader[f.name] = raw.toLowerCase() === "true" || raw === "1";
            else if (typeof raw === "number")  formattedHeader[f.name] = raw !== 0;
            else                               formattedHeader[f.name] = false;
          } else if (f.isDate) {
            const dateVal = data[f.name];
            formattedHeader[f.name] = dateVal
              ? new Date(dateVal).toISOString().split("T")[0]
              : "";
          } else {
            formattedHeader[f.name] =
              data[f.name] !== undefined && data[f.name] !== null ? data[f.name] : "";
          }
        });
        setHeaderData(formattedHeader);

        // ── Map tab data ───────────────────────────────────────────────────
        if (mapTabData) {
          setTabData(mapTabData(data));
        } else {
          const mapped: Record<string, Record<string, any>[]> = {};
          tabs.forEach((tab) => {
            const rows = data[tab.key];
            mapped[tab.key] = Array.isArray(rows) && rows.length > 0 ? rows : [];
          });
          setTabData(mapped);
        }
      } catch (error: any) {
        // ── CHANGED: was just console.error + onHide() ──────────────────
        const msg = error?.message ?? "An unexpected error occurred.";
        toast.error(msg, { duration: 5000 });
        await Swal.fire({
          icon: "error",
          title: "Load Failed",
          text: msg,
          confirmButtonColor: themeColor,
          confirmButtonText: "OK",
        });
        onHide();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show, recordId]);

  // ── Reset when modal closes ───────────────────────────────────────────────
  useEffect(() => {
    if (!show) {
      setHeaderData({});
      setTabData({});
      setActiveTab(tabs[0]?.key ?? "");
    }
  }, [show]);

  if (!show) return null;

  // ── Format value for display ──────────────────────────────────────────────
  const formatValue = (field: ViewHeaderField, value: any): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (field.formatter) return field.formatter(value);
    if (field.isBoolean)  return value ? "Yes" : "No";
    if (field.isDate) {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime()))
          return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      } catch { /* fall through */ }
    }
    return String(value);
  };

  const currentTab  = tabs.find((t) => t.key === activeTab)!;
  const currentRows = tabData[activeTab] ?? [];

  // ==================== RENDER ====================

  return (
    <div className="ktf-overlay" onClick={onHide}>
      <div className="ktf-modal-wrapper">
        <div className="ktf-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── Floating close button ── */}
          <button
            type="button"
            className="ktf-floating-close-btn"
            onClick={onHide}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </button>

          {/* ── Header ── */}
          <div className="ktf-header">
            <div className="ktf-header-left">
              <h2 className="ktf-title">{title}</h2>
              {subtitle && <span className="ktf-subtitle">{subtitle}</span>}
            </div>
            {showBadge && (
              <div className="ktf-header-right">
                <span
                  className="ktf-view-badge"
                  style={{ backgroundColor: themeColor }}
                >
                  {badgeText}
                </span>
              </div>
            )}
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div className="ktf-loading">
              <span className="ktf-spinner ktf-spinner--dark" />
              Loading...
            </div>
          ) : (
            <>
              {/* ── Header fields (read-only) ── */}
              <div className="ktf-top-fields">
                {headerFields.map((field) => (
                  <div
                    key={field.name}
                    className="ktf-field-group"
                    style={{
                      flex: field.colWidth === 3  ? "0 0 25%"    :
                            field.colWidth === 4  ? "0 0 33.33%" :
                            field.colWidth === 12 ? "0 0 100%"   : "1 1 0",
                    }}
                  >
                    <label className="ktf-label">{field.label}</label>

                    {field.isToggle ? (
                      <div className="ktf-view-toggle-wrapper">
                        <div
                          className={`ktf-toggle ktf-toggle--readonly ${
                            headerData[field.name] ? "ktf-toggle--on" : ""
                          }`}
                        >
                          <div className="ktf-toggle-thumb" />
                        </div>
                        <span className="ktf-view-toggle-label">
                          {headerData[field.name] ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ) : field.isTextarea ? (
                      <textarea
                        className="ktf-input ktf-textarea ktf-view-readonly"
                        value={formatValue(field, headerData[field.name])}
                        readOnly
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        className="ktf-input ktf-view-readonly"
                        value={formatValue(field, headerData[field.name])}
                        readOnly
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* ── Tab Bar ── */}
              <div className="ktf-tab-bar">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={`ktf-tab-btn ${activeTab === tab.key ? "ktf-tab-btn--active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Tab Content (read-only table) ── */}
              <div className="ktf-tab-content">
                {currentRows.length === 0 ? (
                  <div className="ktf-empty">No records found.</div>
                ) : (
                  <div className="ktf-table-wrap">
                    <table className="ktf-table">
                      <thead>
                        <tr>
                          {currentTab.columns.map((col) => (
                            <th key={col.key} className="ktf-th">{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="ktf-tr">
                            {currentTab.columns.map((col) => (
                              <td key={col.key} className="ktf-td">
                                <input
                                  type="text"
                                  className="ktf-input ktf-input--sm ktf-view-readonly"
                                  value={row[col.key] ?? "—"}
                                  readOnly
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default KiduTabbedFormViewModal;