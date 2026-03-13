import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
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
  displayName?: string;
}

export interface ViewTabConfig {
  key: string;
  label: string;
  columns: {
    key: string;
    label: string;
    displayKey?: string;
    formatter?: (value: any, row: any) => string;
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
  const [activeTab,  setActiveTab]  = useState(tabs.length > 0 ? tabs[0]?.key ?? "" : "");
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (!show || !recordId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await onFetch(recordId);

        if (!response || !response.isSucess) {
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
        console.log("View modal data:", data);

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
            if (f.displayName && data[f.displayName]) {
              formattedHeader[f.name] = data[f.displayName];
            } else {
              formattedHeader[f.name] =
                data[f.name] !== undefined && data[f.name] !== null ? data[f.name] : "";
            }
          }
        });

        if (data.isActive !== undefined) {
          formattedHeader.isActive = data.isActive;
        } else if (data.IsActive !== undefined) {
          formattedHeader.isActive = data.IsActive;
        } else if (data.active !== undefined) {
          formattedHeader.isActive = data.active;
        } else if (data.Active !== undefined) {
          formattedHeader.isActive = data.Active;
        } else {
          formattedHeader.isActive = false;
        }

        setHeaderData(formattedHeader);

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

  useEffect(() => {
    if (!show) {
      setHeaderData({});
      setTabData({});
      setActiveTab(tabs.length > 0 ? tabs[0]?.key ?? "" : "");
    }
  }, [show]);

  if (!show) return null;

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

  const currentTab = tabs.length > 0 ? tabs.find((t) => t.key === activeTab) : null;
  const currentRows = activeTab && tabData[activeTab] ? tabData[activeTab] : [];

  return (
    <div className="ktf-overlay" onClick={onHide}>
      <div className="ktf-modal-wrapper">
        <div className="ktf-modal" onClick={(e) => e.stopPropagation()}>

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

          <div className="ktf-header">
            <div className="ktf-header-left">
              <h2 className="ktf-title">{title}</h2>
              {subtitle && <span className="ktf-subtitle">{subtitle}</span>}
            </div>
            <div className="ktf-header-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {showBadge && (
                <span
                  className="ktf-view-badge"
                  style={{ backgroundColor: themeColor }}
                >
                  {badgeText}
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="ktf-active-label">Active</span>
                <div
                  style={{
                    width: "40px",
                    height: "20px",
                    backgroundColor: headerData.isActive ? themeColor : "#e0e0e0",
                    borderRadius: "20px",
                    position: "relative",
                    transition: "background-color 0.2s",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: headerData.isActive ? "22px" : "2px",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="ktf-loading">
              <span className="ktf-spinner ktf-spinner--dark" />
              Loading...
            </div>
          ) : (
            <div className="ktf-scrollable-content">
              <div className="ktf-top-fields">
                {headerFields.map((field) => {
                  if (field.name === "isActive" || field.name === "IsActive" || field.name === "active") return null;
                  
                  return (
                    <div
                      key={field.name}
                      className="ktf-field-group"
                      style={{
                        flex: field.colWidth === 3  ? "0 0 25%"    :
                              field.colWidth === 4  ? "0 0 33.33%" :
                              field.colWidth === 6  ? "0 0 50%"    :
                              field.colWidth === 8  ? "0 0 66.67%" :
                              field.colWidth === 10 ? "0 0 83.33%" :
                              field.colWidth === 12 ? "0 0 100%"   : "1 1 0",
                      }}
                    >
                      <label className="ktf-label">{field.label}</label>

                      {field.isToggle ? (
                        <div className="ktf-view-toggle-wrapper">
                          <div
                            style={{
                              width: "40px",
                              height: "20px",
                              backgroundColor: headerData[field.name] ? themeColor : "#e0e0e0",
                              borderRadius: "20px",
                              position: "relative",
                              display: "inline-block",
                              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
                            }}
                          >
                            <div
                              style={{
                                width: "16px",
                                height: "16px",
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                                position: "absolute",
                                top: "2px",
                                left: headerData[field.name] ? "22px" : "2px",
                                transition: "left 0.2s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                              }}
                            />
                          </div>
                          <span className="ktf-view-toggle-label" style={{ marginLeft: "8px" }}>
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
                  );
                })}
              </div>

              {tabs.length > 0 && (
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
              )}

              {tabs.length > 0 && currentTab && (
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
                              {currentTab.columns.map((col) => {
                                let displayValue = "—";
                                
                                if (col.displayKey && row[col.displayKey]) {
                                  displayValue = String(row[col.displayKey]);
                                } else if (row[col.key] !== undefined && row[col.key] !== null && row[col.key] !== "") {
                                  displayValue = String(row[col.key]);
                                }
                                
                                if (col.formatter) {
                                  displayValue = col.formatter(row[col.key], row);
                                }
                                
                                return (
                                  <td key={col.key} className="ktf-td">
                                    <input
                                      type="text"
                                      className="ktf-input ktf-input--sm ktf-view-readonly"
                                      value={displayValue}
                                      readOnly
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default KiduTabbedFormViewModal;