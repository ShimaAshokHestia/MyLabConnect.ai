import React, { useState, useEffect } from "react";
import { Form, Row, Col, Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import "../Styles/KiduStyles/ViewModal.css";

// ==================== TYPES ====================
export interface ViewField {
  name: string;
  label: string;
  colWidth?: 2 | 3 | 4 | 6 | 12;
  isBoolean?: boolean;
  isDate?: boolean;
  isToggle?: boolean;
  isSelect?: boolean;
  isTextarea?: boolean;
  formatter?: (value: any) => string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ViewModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  subtitle?: string;
  fields: ViewField[];
  recordId: string | number;
  onFetch: (id: string | number) => Promise<any>;
  options?: Record<string, SelectOption[] | string[]>;
  themeColor?: string;
  size?: "sm" | "lg" | "xl";
  centered?: boolean;
  modalWidth?: string | number;
  showBadge?: boolean;
  badgeText?: string;
}

// ==================== COMPONENT ====================
const KiduViewModal: React.FC<ViewModalProps> = ({
  show,
  onHide,
  title,
  subtitle,
  fields,
  recordId,
  onFetch,
  options = {},
  themeColor = "#ef0d50",
  size = "lg",
  centered = true,
  showBadge = true,
  badgeText = "Read Only",
  modalWidth
}) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Fetch data when modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (!show || !recordId) return;

      try {
        setLoading(true);
        const response = await onFetch(recordId);

        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load data");
        }

        const fetchedData = response.value;
        console.log("View modal fetched data:", fetchedData); // Debug log

        // Format data for display
        const formattedData: Record<string, any> = {};
        fields.forEach(f => {
          if (f.isBoolean || f.isToggle) {
            const rawValue = fetchedData[f.name];
            if (typeof rawValue === 'boolean') {
              formattedData[f.name] = rawValue;
            } else if (typeof rawValue === 'string') {
              formattedData[f.name] = rawValue.toLowerCase() === 'true' || rawValue === '1';
            } else if (typeof rawValue === 'number') {
              formattedData[f.name] = rawValue !== 0;
            } else {
              formattedData[f.name] = false;
            }
          } else if (f.isDate) {
            const dateValue = fetchedData[f.name];
            if (dateValue) {
              const date = new Date(dateValue);
              formattedData[f.name] = date.toISOString().split('T')[0];
            } else {
              formattedData[f.name] = "";
            }
          } else {
            formattedData[f.name] = fetchedData[f.name] !== undefined && fetchedData[f.name] !== null ? fetchedData[f.name] : "";
          }
        });

        // Explicitly set isActive from the data
        if (fetchedData.isActive !== undefined) {
          formattedData.isActive = fetchedData.isActive;
        } else if (fetchedData.IsActive !== undefined) {
          formattedData.isActive = fetchedData.IsActive;
        } else if (fetchedData.active !== undefined) {
          formattedData.isActive = fetchedData.active;
        } else if (fetchedData.Active !== undefined) {
          formattedData.isActive = fetchedData.Active;
        }

        console.log("Formatted data with isActive:", formattedData.isActive); // Debug log
        setData(formattedData);

      } catch (error: any) {
        console.error("Failed to load data:", error);
        toast.error(`Error loading data: ${error.message}`);
        onHide();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show, recordId]);

  // Reset data when modal closes
  useEffect(() => {
    if (!show) {
      setData({});
    }
  }, [show]);

  // ==================== FORMAT VALUE ====================
  const formatValue = (field: ViewField, value: any): string => {
    if (value === null || value === undefined || value === "") return "";

    // Custom formatter
    if (field.formatter) {
      return field.formatter(value);
    }

    // Boolean
    if (field.isBoolean) {
      return value ? "Yes" : "No";
    }

    // Date
    if (field.isDate) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      } catch (e) {
        return String(value);
      }
    }

    return String(value);
  };

  // ==================== GET SELECT LABEL ====================
  const getSelectLabel = (fieldName: string, value: any): string => {
    const fieldOptions = options[fieldName] || [];
    const option = fieldOptions.find((opt: any) => {
      const optValue = typeof opt === "object" ? opt.value : opt;
      return optValue === value;
    });

    if (option) {
      return typeof option === "object" ? option.label : option;
    }

    return String(value);
  };

  // ==================== RENDER FIELD ====================
  const renderField = (field: ViewField, _index: number) => {
    const { name, label, colWidth = 6 } = field;
    const value = data[name];

    // Skip isActive field since it's already shown in header
    if (name === "isActive" || name === "IsActive" || name === "active") {
      return null;
    }

    return (
      <Col md={colWidth} className="mb-3" key={name}>
        <Form.Label className="kidu-form-label">
          {label}
        </Form.Label>

        {/* Toggle/Switch Field */}
        {field.isToggle ? (
          <div className="kidu-view-toggle-wrapper">
            <div
              className={`kidu-toggle kidu-toggle--readonly ${value ? "kidu-toggle--on" : ""}`}
              style={{
                backgroundColor: value ? themeColor : "#e0e0e0"
              }}
            >
              <div className="kidu-toggle-thumb" />
            </div>
            <span className="kidu-view-toggle-label">
              {value ? "Active" : "Inactive"}
            </span>
          </div>
        ) : field.isSelect ? (
          /* Select Field */
          <Form.Control
            type="text"
            value={getSelectLabel(name, value)}
            readOnly
            disabled
            className="kidu-input kidu-view-readonly"
          />
        ) : field.isTextarea ? (
          /* Textarea Field */
          <Form.Control
            as="textarea"
            rows={3}
            value={formatValue(field, value)}
            readOnly
            disabled
            className="kidu-textarea kidu-view-readonly"
          />
        ) : (
          /* Default Input Field */
          <Form.Control
            type="text"
            value={formatValue(field, value)}
            readOnly
            disabled
            className="kidu-input kidu-view-readonly"
          />
        )}
      </Col>
    );
  };

  // ==================== RENDER ====================
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size={size}
        centered={centered}
        backdrop="static"
        keyboard={true}
        contentClassName="kidu-modal-content"
        dialogClassName="kidu-modal-dialog"
        style={modalWidth ? { "--kidu-modal-max-width": typeof modalWidth === "number" ? `${modalWidth}px` : modalWidth } as React.CSSProperties : undefined}

      >
        {/* ── Floating close button ── */}
        <button
          type="button"
          className="kidu-modal-close-btn"
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

        <Modal.Header className="kidu-modal-header">
          <div className="kidu-modal-header-left">
            <Modal.Title className="kidu-modal-title">
              {title}
            </Modal.Title>
            {subtitle && (
              <p className="kidu-modal-subtitle">
                {subtitle}
              </p>
            )}
          </div>

          {/* Header Right Section with Badge and Active Toggle - Now in a single line */}
          <div className="kidu-modal-header-right" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {showBadge && (
              <span
                className="kidu-view-badge"
                style={{ backgroundColor: themeColor }}
              >
                {badgeText}
              </span>
            )}
            {/* Active Toggle - Read Only Visual - Now on the same line */}
            <div className="kidu-active-toggle-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="kidu-active-label">Active</span>
              <div
                className={`kidu-toggle kidu-toggle--readonly ${data.isActive ? "kidu-toggle--on" : ""}`}
                style={{
                  backgroundColor: data.isActive ? themeColor : "#e0e0e0"
                }}
              >
                <div className="kidu-toggle-thumb" />
              </div>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="kidu-modal-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading data...</p>
            </div>
          ) : (
            <Form>
              <Row>
                {fields.map((field, index) => renderField(field, index))}
              </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Toaster position="top-right" />
    </>
  );
};

export default KiduViewModal;