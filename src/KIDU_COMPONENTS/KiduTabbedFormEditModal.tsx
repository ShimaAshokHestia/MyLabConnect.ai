import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import "../Styles/KiduStyles/KiduTabbedFormModal.css";

// ==================== TYPES ====================

export interface TabbedFormField {
  name: string;
  label: string;
  type: "text" | "select" | "number" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  colWidth?: 3 | 4 | 6 | 8 | 10 | 12;
}

export interface TabConfig {
  key: string;
  label: string;
  columns: {
    key: string;
    label: string;
    required?: boolean;
    type: "text" | "select" | "email" | "number";
    placeholder?: string;
    options?: { value: string | number; label: string }[];
  }[];
}

export interface KiduTabbedFormEditModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  headerFields: TabbedFormField[];
  tabs: TabConfig[];
  onSubmit: (data: {
    headerData: Record<string, any>;
    tabData: Record<string, Record<string, any>[]>;
  }) => Promise<void> | void;
  submitButtonText?: string;
  themeColor?: string;
  // ── Required for Edit mode ────────────────────────────────────────────────
  initialHeaderData: Record<string, any>;
  initialTabData: Record<string, Record<string, any>[]>;
}

// ==================== COMPONENT ====================

const KiduTabbedFormEditModal: React.FC<KiduTabbedFormEditModalProps> = ({
  show,
  onHide,
  title,
  headerFields,
  tabs,
  onSubmit,
  submitButtonText = "Update",
  themeColor = "#ef0d50",
  initialHeaderData,
  initialTabData,
}) => {

  // ── Helpers ───────────────────────────────────────────────────────────────
  const buildEmptyRow = (tab: TabConfig): Record<string, any> => {
    const row: Record<string, any> = {};
    tab.columns.forEach((col) => { row[col.key] = ""; });
    return row;
  };

  const buildHeaderFromInitial = (): Record<string, any> => {
    const v: Record<string, any> = {};
    headerFields.forEach((f) => {
      v[f.name] = initialHeaderData?.[f.name] ?? "";
    });
    return v;
  };

  const buildTabFromInitial = (): Record<string, Record<string, any>[]> => {
    const initial: Record<string, Record<string, any>[]> = {};
    tabs.forEach((tab) => {
      initial[tab.key] = initialTabData?.[tab.key] ?? [buildEmptyRow(tab)];
    });
    return initial;
  };

  // ── State — initialised from props ────────────────────────────────────────
  const [headerData, setHeaderData] = useState<Record<string, any>>(buildHeaderFromInitial);
  const [isActive, setIsActive] = useState<boolean>(initialHeaderData?.isActive ?? true);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tabData, setTabData] = useState<Record<string, Record<string, any>[]>>(buildTabFromInitial);

  // ── Sync state when initialHeaderData changes (new record opened) ─────────
  useEffect(() => {
    setHeaderData(buildHeaderFromInitial());
    setIsActive(initialHeaderData?.isActive ?? true);
  }, [initialHeaderData]);

  useEffect(() => {
    setTabData(buildTabFromInitial());
  }, [initialTabData]);

  // ── Reset when modal closes ───────────────────────────────────────────────
  useEffect(() => {
    if (!show) {
      setActiveTab(tabs[0]?.key ?? "");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [show]);

  if (!show) return null;

  // ── Header handlers ───────────────────────────────────────────────────────
  const handleHeaderChange = (name: string, value: any) => {
    setHeaderData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Tab row handlers ──────────────────────────────────────────────────────
  const handleRowChange = (tabKey: string, rowIdx: number, colKey: string, value: any) => {
    setTabData((prev) => {
      const rows = [...prev[tabKey]];
      rows[rowIdx] = { ...rows[rowIdx], [colKey]: value };
      return { ...prev, [tabKey]: rows };
    });
  };

  const addRow = (tabKey: string) => {
    const tab = tabs.find((t) => t.key === tabKey)!;
    setTabData((prev) => ({
      ...prev,
      [tabKey]: [...prev[tabKey], buildEmptyRow(tab)],
    }));
  };

  const removeRow = (tabKey: string, rowIdx: number) => {
    setTabData((prev) => {
      const rows = prev[tabKey].filter((_, i) => i !== rowIdx);
      const tab = tabs.find((t) => t.key === tabKey)!;
      return { ...prev, [tabKey]: rows.length > 0 ? rows : [buildEmptyRow(tab)] };
    });
  };

  // ── Reset to initial data ─────────────────────────────────────────────────
  const handleReset = () => {
    setHeaderData(buildHeaderFromInitial());
    setIsActive(initialHeaderData?.isActive ?? true);
    setTabData(buildTabFromInitial());
    setErrors({});
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;
    headerFields.forEach((f) => {
      if (f.required && !headerData[f.name]) {
        newErrors[f.name] = `${f.label} is required`;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ headerData: { ...headerData, isActive }, tabData });
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Close ─────────────────────────────────────────────────────────────────
  const handleClose = () => {
    setActiveTab(tabs[0]?.key ?? "");
    setErrors({});
    onHide();
  };

  const currentTab = tabs.find((t) => t.key === activeTab)!;
  const currentRows = tabData[activeTab] ?? [];

  // ==================== RENDER ====================

  return (
    <div className="ktf-overlay" onClick={handleClose}>
      <div className="ktf-modal-wrapper">
        <div className="ktf-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── Floating close button (matches KiduCreateModal) ── */}
          <button
            type="button"
            className="ktf-floating-close-btn"
            onClick={handleClose}
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
            </div>
            <div className="ktf-header-right">
              <span className="ktf-active-label">Active</span>
              <div
                className={`ktf-toggle ${isActive ? "ktf-toggle--on" : ""}`}
                onClick={() => setIsActive((p) => !p)}
                role="switch"
                aria-checked={isActive}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setIsActive((p) => !p); }}
              >
                <div className="ktf-toggle-thumb" />
              </div>
            </div>
          </div>

          {/* ── Top Fields ── */}
          <div className="ktf-top-fields">
            {headerFields.map((field) => (
              <div
                key={field.name}
                className="ktf-field-group"
                style={{
                  flex: field.colWidth === 3 ? "0 0 25%" :
                    field.colWidth === 4 ? "0 0 33.33%" :
                      field.colWidth === 12 ? "0 0 100%" : "1 1 0",
                }}
              >
                <label className="ktf-label">
                  {field.label}
                  {field.required && <span className="ktf-required">*</span>}
                </label>

                {field.type === "select" ? (
                  <div className="ktf-select-wrap">
                    <select
                      className={`ktf-select ${errors[field.name] ? "ktf-input--error" : ""}`}
                      value={headerData[field.name]}
                      onChange={(e) => handleHeaderChange(field.name, e.target.value)}
                    >
                      <option value="">{field.placeholder ?? `Choose a ${field.label.toLowerCase()}...`}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className="ktf-select-arrow">▾</span>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    className={`ktf-input ${errors[field.name] ? "ktf-input--error" : ""}`}
                    placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                    value={headerData[field.name]}
                    onChange={(e) => handleHeaderChange(field.name, e.target.value)}
                  />
                )}

                {errors[field.name] && (
                  <span className="ktf-error-msg">{errors[field.name]}</span>
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

          {/* ── Tab Content ── */}
          <div className="ktf-tab-content">
            <div className="ktf-tab-toolbar">
              <button type="button" className="ktf-add-btn" onClick={() => addRow(activeTab)}>
                <FaPlus size={10} /> Add
              </button>
            </div>

            <div className="ktf-table-wrap">
              <table className="ktf-table">
                <thead>
                  <tr>
                    {currentTab.columns.map((col) => (
                      <th key={col.key} className="ktf-th">
                        {col.label}{col.required && <span className="ktf-required"> *</span>}
                      </th>
                    ))}
                    <th className="ktf-th ktf-th-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="ktf-tr">
                      {currentTab.columns.map((col) => (
                        <td key={col.key} className="ktf-td">
                          {col.type === "select" ? (
                            <div className="ktf-select-wrap ktf-select-wrap--sm">
                              <select
                                className="ktf-select ktf-select--sm"
                                value={row[col.key]}
                                onChange={(e) => handleRowChange(activeTab, rowIdx, col.key, e.target.value)}
                              >
                                <option value="">{col.placeholder ?? `Select a ${col.label.toLowerCase()}`}</option>
                                {col.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                              <span className="ktf-select-arrow">▾</span>
                            </div>
                          ) : (
                            <input
                              type={col.type}
                              className="ktf-input ktf-input--sm"
                              placeholder={col.placeholder ?? `Enter ${col.label.toLowerCase()}`}
                              value={row[col.key]}
                              onChange={(e) => handleRowChange(activeTab, rowIdx, col.key, e.target.value)}
                            />
                          )}
                        </td>
                      ))}
                      <td className="ktf-td ktf-td-action">
                        <button
                          type="button"
                          className="ktf-delete-btn"
                          onClick={() => removeRow(activeTab, rowIdx)}
                          title="Remove row"
                        >
                          <FaTrash size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="ktf-footer">
            <button
              type="button"
              className="ktf-reset-btn"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              type="button"
              className="ktf-save-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ backgroundColor: themeColor }}
            >
              {isSubmitting ? (<><span className="ktf-spinner" />Updating...</>) : submitButtonText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KiduTabbedFormEditModal;
