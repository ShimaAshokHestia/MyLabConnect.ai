import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "../Styles/KiduStyles/KiduTabbedFormModal.css";
import KiduValidation, { KiduCharacterCounter } from "./KiduValidation";
import KiduSelectPopup from "./KiduSelectPopup";
import KiduDropdown from "./KiduDropdown";

// ==================== TYPES ====================

export interface TabbedFormField {
  name: string;
  label: string;
  type: "text" | "select" | "number" | "email" | "textarea" | "toggle" | "popup" | "smartdropdown";
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  colWidth?: 3 | 4 | 6 | 8 | 10 | 12;
  maxLength?: number;
  minLength?: number;
  defaultValue?: any;
  // Popup configuration
  popupConfig?: {
    fetchEndpoint?: string;
    data?: any[];
    loading?: boolean;
    columns: { key: string; label: string; filterType?: "text" | "select"; filterOptions?: string[]; render?: (value: any, row: any) => React.ReactNode }[];
    searchKeys?: string[];
    idKey?: string;
    labelKey?: string;
    AddModalComponent?: React.ComponentType<{
      show: boolean;
      handleClose: () => void;
      onAdded: (selected: any) => void;
    }>;
    showAddButton?: boolean;
    addButtonLabel?: string;
  };
}

export interface TabConfig {
  key: string;
  label: string;
  addButtonLabel?: string;
  columns: {
    key: string;
    label: string;
    required?: boolean;
    type: "text" | "select" | "email" | "number" | "toggle" | "popup";
    placeholder?: string;
    options?: { value: string | number; label: string }[];
    defaultValue?: any;
    // Popup configuration for tab columns
    popupConfig?: {
      fetchEndpoint?: string;
      data?: any[];
      loading?: boolean;
      columns: { key: string; label: string; filterType?: "text" | "select"; filterOptions?: string[]; render?: (value: any, row: any) => React.ReactNode }[];
      searchKeys?: string[];
      idKey?: string;
      labelKey?: string;
      AddModalComponent?: React.ComponentType<{
        show: boolean;
        handleClose: () => void;
        onAdded: (selected: any) => void;
      }>;
      showAddButton?: boolean;
      addButtonLabel?: string;
    };
  }[];
}

export interface KiduTabbedFormCreateModalProps {
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
  successMessage?: string;
  onSuccess?: () => void;
}

// ==================== COMPONENT ====================

const KiduTabbedFormCreateModal: React.FC<KiduTabbedFormCreateModalProps> = ({
  show,
  onHide,
  title,
  headerFields,
  tabs,
  onSubmit,
  submitButtonText = "Save",
  themeColor = "#ef0d50",
  successMessage = "Created successfully!",
  onSuccess,
}) => {

  // ── Popup state management ────────────────────────────────────────────────
  const [popupState, setPopupState] = useState<{
    show: boolean;
    field: { tabKey?: string; rowIndex?: number; colKey: string; isHeader?: boolean } | null;
    config: any;
  }>({
    show: false,
    field: null,
    config: null
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const buildEmptyRow = (tab: TabConfig): Record<string, any> => {
    const row: Record<string, any> = {};
    tab.columns.forEach((col) => { 
      if (col.type === "toggle") {
        row[col.key] = col.defaultValue ?? false;
      } else {
        row[col.key] = col.defaultValue ?? ""; 
      }
    });
    return row;
  };

  const buildHeaderInitial = (): Record<string, any> => {
    const v: Record<string, any> = {};
    headerFields.forEach((f) => { 
      if (f.type === "toggle") {
        v[f.name] = f.defaultValue ?? true;
      } else {
        v[f.name] = f.defaultValue ?? ""; 
      }
    });
    // Ensure isActive exists (default to true)
    if (!v.hasOwnProperty("isActive")) {
      v.isActive = true;
    }
    return v;
  };

  const buildTabInitial = (): Record<string, Record<string, any>[]> => {
    const initial: Record<string, Record<string, any>[]> = {};
    tabs.forEach((tab) => { 
      initial[tab.key] = [buildEmptyRow(tab)]; 
    });
    return initial;
  };

  // ── State ─────────────────────────────────────────────────────────────────
  const [headerData, setHeaderData] = useState<Record<string, any>>(buildHeaderInitial);
  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0]?.key ?? "" : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tabData, setTabData] = useState<Record<string, Record<string, any>[]>>(buildTabInitial);

  // ── Reset when modal closes ───────────────────────────────────────────────
  useEffect(() => {
    if (!show) {
      setHeaderData(buildHeaderInitial());
      setActiveTab(tabs.length > 0 ? tabs[0]?.key ?? "" : "");
      setErrors({});
      setTabData(buildTabInitial());
      setIsSubmitting(false);
      setPopupState({ show: false, field: null, config: null });
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
    const tab = tabs.find((t) => t.key === tabKey);
    if (!tab) return;
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

  // ── Popup handlers ────────────────────────────────────────────────────────
  const openPopup = (field: { tabKey?: string; rowIndex?: number; colKey: string; isHeader?: boolean }, config: any) => {
    setPopupState({
      show: true,
      field,
      config
    });
  };

  const handlePopupSelect = (selected: any) => {
    if (!popupState.field || !popupState.config) return;

    const { field, config } = popupState;
    
    // Use the selected item
    const value = selected.id;
    const display = selected.name || selected.serviceName || selected[config.labelKey || "name"] || String(selected.id);

    if (field.isHeader) {
      // Handle header field popup
      handleHeaderChange(field.colKey, value);
      if (field.colKey + "Display") {
        handleHeaderChange(field.colKey + "Display", display);
      }
    } else if (field.tabKey && field.rowIndex !== undefined) {
      // Handle tab row popup
      handleRowChange(field.tabKey, field.rowIndex, field.colKey, value);
      if (field.colKey + "Display") {
        handleRowChange(field.tabKey, field.rowIndex, field.colKey + "Display", display);
      }
    }

    closePopup();
  };

  const closePopup = () => {
    setPopupState({ show: false, field: null, config: null });
  };

  // ── Reset form ────────────────────────────────────────────────────────────
  const handleReset = () => {
    setHeaderData(buildHeaderInitial());
    setActiveTab(tabs.length > 0 ? tabs[0]?.key ?? "" : "");
    setErrors({});
    setTabData(buildTabInitial());
  };

  // ── Validation using KiduValidation ──────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    headerFields.forEach((f) => {
      // Skip validation for toggle fields
      if (f.type === "toggle") return;
      
      const result = KiduValidation.validate(headerData[f.name], {
        type: f.type as any,
        required: f.required,
        label: f.label,
        minLength: f.minLength,
        maxLength: f.maxLength,
      });
      if (!result.isValid) {
        newErrors[f.name] = result.message ?? `${f.label} is invalid`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ headerData, tabData });
      
      // Close modal first
      onHide();
      
      // Small delay to ensure modal is closed
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Show SweetAlert success message
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: themeColor,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      
      // Call onSuccess callback (usually refreshes the list)
      if (onSuccess) onSuccess();
      
    } catch (err: any) {                                                    
      const msg = err?.message ?? "An unexpected error occurred.";
      toast.error(msg, { duration: 5000 });
      
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: msg,
        confirmButtonColor: themeColor,
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Close ─────────────────────────────────────────────────────────────────
  const handleClose = () => {
    setHeaderData(buildHeaderInitial());
    setActiveTab(tabs.length > 0 ? tabs[0]?.key ?? "" : "");
    setErrors({});
    setTabData(buildTabInitial());
    setPopupState({ show: false, field: null, config: null });
    onHide();
  };

  const currentTab = tabs.find((t) => t.key === activeTab);
  const currentRows = activeTab ? tabData[activeTab] ?? [] : [];

  // ── Render popup if open ─────────────────────────────────────────────────
  const renderPopup = () => {
    if (!popupState.show || !popupState.field || !popupState.config) return null;

    const { field, config } = popupState;
    
    return (
      <KiduSelectPopup<any>
        show={popupState.show}
        onClose={closePopup}
        title={`Select ${field.colKey.replace(/([A-Z])/g, ' $1').trim()}`}
        subtitle="Search and select an item"
        fetchEndpoint={config.fetchEndpoint}
        data={config.data}
        loading={config.loading}
        columns={config.columns || [
          { key: "id", label: "ID" },
          { key: "name", label: "Name" }
        ]}
        onSelect={handlePopupSelect}
        idKey={config.idKey || "id"}
        labelKey={config.labelKey || "name"}
        searchKeys={config.searchKeys}
        rowsPerPage={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        themeColor={themeColor}
        multiSelect={false}
        showAddButton={!!config.AddModalComponent}
        AddModalComponent={config.AddModalComponent}
        addButtonLabel={config.addButtonLabel || "Add New"}
      />
    );
  };

  // ==================== RENDER ====================

  return (
    <>
      <div className="ktf-overlay" onClick={handleClose}>
        <div className="ktf-modal-wrapper">
          <div className="ktf-modal" onClick={(e) => e.stopPropagation()}>

            {/* ── Floating close button ── */}
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

            {/* ── Header with Active Toggle ── */}
            <div className="ktf-header">
              <div className="ktf-header-left">
                <h2 className="ktf-title">{title}</h2>
              </div>
              <div className="ktf-header-right">
                <span className="ktf-active-label">Active</span>
                <div
                  className={`ktf-toggle ${headerData.isActive ? "ktf-toggle--on" : ""}`}
                  onClick={() => handleHeaderChange("isActive", !headerData.isActive)}
                  role="switch"
                  aria-checked={headerData.isActive}
                  tabIndex={0}
                  onKeyDown={(e) => { 
                    if (e.key === " " || e.key === "Enter") 
                      handleHeaderChange("isActive", !headerData.isActive); 
                  }}
                >
                  <div className="ktf-toggle-thumb" />
                </div>
              </div>
            </div>

            {/* ── Scrollable Content Area ── */}
            <div className="ktf-scrollable-content">
              {/* ── Top Fields ── */}
              <div className="ktf-top-fields">
                {headerFields.map((field) => (
                  <div
                    key={field.name}
                    className="ktf-field-group"
                    style={{
                      flex: field.colWidth === 3 ? "0 0 25%" :
                        field.colWidth === 4 ? "0 0 33.33%" :
                        field.colWidth === 6 ? "0 0 50%" :
                        field.colWidth === 8 ? "0 0 66.67%" :
                        field.colWidth === 10 ? "0 0 83.33%" :
                        field.colWidth === 12 ? "0 0 100%" : "1 1 0",
                    }}
                  >
                    {/* Label row with character counter */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label className="ktf-label" style={{ marginBottom: 0 }}>
                        {field.label}
                        {field.required && <span className="ktf-required">*</span>}
                      </label>
                      {field.type !== "toggle" && field.type !== "popup" && (
                        <KiduCharacterCounter
                          value={headerData[field.name] ?? ""}
                          maxLength={field.maxLength}
                          type={field.type}
                        />
                      )}
                    </div>

                    {field.type === "toggle" ? (
                      <div className="ktf-toggle-container">
                        <div
                          className={`ktf-toggle ${headerData[field.name] ? "ktf-toggle--on" : ""}`}
                          onClick={() => handleHeaderChange(field.name, !headerData[field.name])}
                          role="switch"
                          aria-checked={headerData[field.name]}
                          tabIndex={0}
                          onKeyDown={(e) => { 
                            if (e.key === " " || e.key === "Enter") 
                              handleHeaderChange(field.name, !headerData[field.name]); 
                          }}
                        >
                          <div className="ktf-toggle-thumb" />
                        </div>
                      </div>
                    ) : field.type === "select" ? (
                      <div className="ktf-dropdown-field">
                        <KiduDropdown
                          value={headerData[field.name] ?? null}
                          onChange={(value) => handleHeaderChange(field.name, value)}
                          placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`}
                          required={field.required}
                          error={errors[field.name]}
                          inputWidth="100%"
                          staticOptions={field.options}
                        />
                      </div>
                    ) : field.type === "popup" ? (
                      <div className="ktf-popup-field" style={{ position: "relative" }}>
                        <input
                          type="text"
                          className={`ktf-input ${errors[field.name] ? "ktf-input--error" : ""}`}
                          placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`}
                          value={headerData[field.name + "Display"] || headerData[field.name] || ""}
                          onClick={() => openPopup({ colKey: field.name, isHeader: true }, field.popupConfig)}
                          readOnly
                          style={{ 
                            cursor: "pointer",
                            paddingRight: "35px"
                          }}
                        />
                        {/* Search icon with line design */}
                        <svg
                          className="ktf-search-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                            pointerEvents: "none",
                            zIndex: 1
                          }}
                        >
                          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        className={`ktf-input ktf-textarea ${errors[field.name] ? "ktf-input--error" : ""}`}
                        placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                        value={headerData[field.name] ?? ""}
                        maxLength={field.maxLength}
                        rows={3}
                        onChange={(e) => handleHeaderChange(field.name, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className={`ktf-input ${errors[field.name] ? "ktf-input--error" : ""}`}
                        placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                        value={headerData[field.name] ?? ""}
                        maxLength={field.maxLength}
                        onChange={(e) => handleHeaderChange(field.name, e.target.value)}
                      />
                    )}

                    {errors[field.name] && (
                      <span className="ktf-error-msg">{errors[field.name]}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Tab Bar (only show if tabs exist) ── */}
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

              {/* ── Tab Content (only show if tabs exist) ── */}
              {tabs.length > 0 && currentTab ? (
                <div className="ktf-tab-content">
                  <div className="ktf-tab-toolbar">
                    <button 
                      type="button" 
                      className="ktf-add-btn" 
                      onClick={() => addRow(activeTab)}
                    >
                      <FaPlus size={10} /> {currentTab.addButtonLabel || "Add"}
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
                                {col.type === "toggle" ? (
                                  <div className="ktf-toggle-container ktf-toggle-container--sm">
                                    <div
                                      className={`ktf-toggle ktf-toggle--sm ${row[col.key] ? "ktf-toggle--on" : ""}`}
                                      onClick={() => handleRowChange(activeTab, rowIdx, col.key, !row[col.key])}
                                      role="switch"
                                      aria-checked={row[col.key]}
                                      tabIndex={0}
                                      onKeyDown={(e) => { 
                                        if (e.key === " " || e.key === "Enter") 
                                          handleRowChange(activeTab, rowIdx, col.key, !row[col.key]); 
                                      }}
                                    >
                                      <div className="ktf-toggle-thumb" />
                                    </div>
                                  </div>
                                ) : col.type === "select" ? (
                                  <div className="ktf-dropdown-field ktf-dropdown-field--sm">
                                    <KiduDropdown
                                      value={row[col.key] ?? null}
                                      onChange={(value) => handleRowChange(activeTab, rowIdx, col.key, value)}
                                      placeholder={col.placeholder ?? `Select ${col.label.toLowerCase()}`}
                                      required={col.required}
                                      inputWidth="100%"
                                      staticOptions={col.options}
                                    />
                                  </div>
                                ) : col.type === "popup" ? (
                                  <div className="ktf-popup-field ktf-popup-field--sm" style={{ position: "relative" }}>
                                    <input
                                      type="text"
                                      className="ktf-input ktf-input--sm"
                                      placeholder={col.placeholder ?? `Select ${col.label.toLowerCase()}`}
                                      value={row[col.key + "Display"] || row[col.key] || ""}
                                      onClick={() => openPopup(
                                        { tabKey: activeTab, rowIndex: rowIdx, colKey: col.key },
                                        col.popupConfig
                                      )}
                                      readOnly
                                      style={{ 
                                        cursor: "pointer",
                                        paddingRight: "30px"
                                      }}
                                    />
                                    {/* Search icon with line design - small version */}
                                    <svg
                                      className="ktf-search-icon ktf-search-icon--sm"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 14 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#999",
                                        pointerEvents: "none",
                                        zIndex: 1
                                      }}
                                    >
                                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                      <line x1="9.5" y1="9.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                    </svg>
                                  </div>
                                ) : (
                                  <input
                                    type={col.type}
                                    className="ktf-input ktf-input--sm"
                                    placeholder={col.placeholder ?? `Enter ${col.label.toLowerCase()}`}
                                    value={row[col.key] ?? ""}
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
              ) : null}
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
                {isSubmitting ? (
                  <><span className="ktf-spinner" /> Saving...</>
                ) : (
                  submitButtonText
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Render popup using KiduSelectPopup */}
      {renderPopup()}

      {/* Toaster for toast notifications - placed at the very end */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            icon: '✅',
            style: {
              borderLeft: `4px solid #10b981`,
            },
          },
          error: {
            icon: '❌',
            style: {
              borderLeft: `4px solid #ef4444`,
            },
          },
          loading: {
            icon: '⏳',
            style: {
              borderLeft: `4px solid ${themeColor}`,
            },
          },
        }}
      />
    </>
  );
};

export default KiduTabbedFormCreateModal;