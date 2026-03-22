import React, { useState, useEffect, useRef } from "react"; // Added useRef
import { Form, Button, Row, Col, Modal, InputGroup } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';
import "../Styles/KiduStyles/EditModal.css";
import KiduValidation, { KiduCharacterCounter } from "./KiduValidation";
import { KiduSelectInputPill } from "./KiduSelectPopup";
import type { KiduDropdownOption, KiduDropdownPaginatedParams, KiduDropdownPaginatedResult } from "./KiduDropdown";
import type { DropdownHandlers } from "./KiduCreateModal";
import KiduDropdown from "./KiduDropdown";
import KiduReset from "./KiduReset"; // Import KiduReset

// ==================== TYPES ====================
export interface FieldRule {
  type: "text" | "number" | "email" | "password" | "select" | "textarea" | "popup" | "date" | "radio" | "url" | "checkbox" | "toggle" | "rowbreak" | "dropdown" | "smartdropdown" | "file";
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  placeholder?: string;
  colWidth?: 2 | 3 | 4 | 6 | 12;
  disabled?: boolean;
}

export interface Field {
  name: string;
  rules: FieldRule;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface PopupHandler {
  value: string;
  onOpen: () => void;
  onClear: () => void;
  actualValue?: any;
}
export interface PopupFieldHandler {
  value: string;
  onOpen: () => void;
  onClear: () => void;
}

export interface KiduDropdownHandler {
  staticOptions?: KiduDropdownOption[];
  paginatedFetch?: (params: KiduDropdownPaginatedParams) => Promise<KiduDropdownPaginatedResult>;
  mapOption?: (row: any) => KiduDropdownOption;
  pageSize?: number;
  placeholder?: string;
}

export interface KiduEditModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  subtitle?: string;
  fields: Field[];
  recordId: string | number;
  onFetch: (id: string | number) => Promise<any>;
  onUpdate: (id: string | number, formData: Record<string, any>) => Promise<void | any>;
  submitButtonText?: string;
  cancelButtonText?: string; // Kept for backward compatibility
  options?: Record<string, SelectOption[] | string[]>;
  popupHandlers?: Record<string, PopupHandler>;
  dropdownHandlers?: DropdownHandlers;
  loadingState?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  themeColor?: string;
  size?: "sm" | "lg" | "xl";
  centered?: boolean;
  modalWidth?: string | number;
}

// ==================== COMPONENT ====================
const KiduEditModal: React.FC<KiduEditModalProps> = ({
  show,
  onHide,
  title,
  subtitle,
  fields,
  recordId,
  onFetch,
  onUpdate,
  submitButtonText = "Update",
  options = {},
  popupHandlers = {},
  dropdownHandlers = {},
  loadingState = false,
  successMessage = "Updated successfully!",
  errorMessage,
  onSuccess,
  themeColor = "#ef0d50",
  size = "lg",
  centered = true,
  modalWidth
}) => {
  // Refs for dropdown and popup reset functions
  const dropdownResetRefs = useRef<{ [key: string]: () => void }>({});
  const popupResetRefs = useRef<{ [key: string]: () => void }>({});

  // Find the active toggle field if it exists
  const activeField = fields.find(
    (f) => (f.name.toLowerCase() === "isactive" || f.name.toLowerCase() === "active") && f.rules.type === "toggle"
  );

  const initialValues: Record<string, any> = {};
  const initialErrors: Record<string, string> = {};

  fields.forEach(f => {
    if (f.rules.type === "rowbreak") return;
    if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
      initialValues[f.name] = false;
    } else if (f.rules.type === "radio" && options[f.name]?.length) {
      const firstOption = options[f.name][0];
      initialValues[f.name] = typeof firstOption === "object" ? firstOption.value : firstOption;
    } else {
      initialValues[f.name] = "";
    }
    initialErrors[f.name] = "";
  });

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [initialData, setInitialData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [dropdownValues, setDropdownValues] = useState<Record<string, any>>({});
  const [initialDropdownValues, setInitialDropdownValues] = useState<Record<string, any>>({});

  const hasChanges = () => {
    const formDataChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
    let popupChanged = false;
    fields.forEach(f => {
      if (f.rules.type === "popup" && popupHandlers[f.name]) {
        const currentValue = popupHandlers[f.name].actualValue;
        const initialValue = initialData[f.name];
        if (currentValue !== undefined && currentValue !== initialValue) {
          popupChanged = true;
        }
      }
    });
    const dropdownChanged = JSON.stringify(dropdownValues) !== JSON.stringify(initialDropdownValues);
    return formDataChanged || popupChanged || dropdownChanged;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!show || !recordId) return;
      try {
        setLoading(true);
        const response = await onFetch(recordId);
        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load data");
        }
        const data = response.value;
        const formattedData: Record<string, any> = {};
        const preloadedDropdowns: Record<string, any> = {};

        fields.forEach(f => {
          if (f.rules.type === "rowbreak") return;
          if (f.rules.type === "smartdropdown") {
            const savedId = data[f.name];
            if (savedId !== undefined && savedId !== null) {
              preloadedDropdowns[f.name] = savedId;
            }
            return;
          }
          if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
            const rawValue = data[f.name];
            if (typeof rawValue === 'boolean') {
              formattedData[f.name] = rawValue;
            } else if (typeof rawValue === 'string') {
              formattedData[f.name] = rawValue.toLowerCase() === 'true' || rawValue === '1';
            } else if (typeof rawValue === 'number') {
              formattedData[f.name] = rawValue !== 0;
            } else {
              formattedData[f.name] = false;
            }
          } else if (f.rules.type === "date") {
            const dateValue = data[f.name];
            if (dateValue) {
              const date = new Date(dateValue);
              formattedData[f.name] = date.toISOString().split('T')[0];
            } else {
              formattedData[f.name] = "";
            }
          } else {
            if (f.rules.type === "select" || f.rules.type === "number") {
              formattedData[f.name] = data[f.name] !== undefined && data[f.name] !== null ? data[f.name] : "";
            } else {
              formattedData[f.name] = data[f.name] || "";
            }
          }
        });

        Object.keys(data).forEach(key => {
          if (!(key in formattedData)) {
            formattedData[key] = data[key];
          }
        });

        setFormData(formattedData);
        setInitialData(formattedData);
        setDropdownValues(preloadedDropdowns);
        setInitialDropdownValues(preloadedDropdowns);
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

  useEffect(() => {
    if (!show) {
      setFormData(initialValues);
      setInitialData(initialValues);
      setErrors(initialErrors);
      setDropdownValues({});
      setInitialDropdownValues({});
      setTouchedFields({});
      setIsSubmitting(false);
    }
  }, [show]);

  // ==================== HANDLERS ====================
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    let updatedValue;
    if (type === "checkbox" || type === "switch") {
      updatedValue = checked;
    } else if (type === "tel") {
      updatedValue = value.replace(/[^0-9]/g, "");
    } else {
      updatedValue = value;
    }
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (touchedFields[name]) {
      validateField(name, updatedValue);
    }
  };

  const handleBlur = (name: string) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name: string, value: any): boolean => {
    const rule = fields.find(f => f.name === name)?.rules;
    if (!rule) return true;
    if (rule.type === "popup") {
      if (rule.required) {
        const popupValue = popupHandlers[name]?.value;
        if (!popupValue || popupValue.trim() === "") {
          setErrors(prev => ({ ...prev, [name]: `${rule.label} is required` }));
          return false;
        }
      }
      setErrors(prev => ({ ...prev, [name]: "" }));
      return true;
    }
    if (rule.type === "smartdropdown") {
      if (rule.required && (dropdownValues[name] === null || dropdownValues[name] === undefined || dropdownValues[name] === "")) {
        setErrors((prev) => ({ ...prev, [name]: `${rule.label} is required` }));
        return false;
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    }
    if ((rule.type === "toggle" || rule.type === "checkbox") && rule.required && !value) {
      setErrors(prev => ({ ...prev, [name]: `${rule.label} is required` }));
      return false;
    }
    const result = KiduValidation.validate(value, rule as any);
    const errorMessage = result.isValid ? "" : (result.message || "");
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
    return result.isValid;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.rules.type === "rowbreak") return;
      const rule = f.rules;
      const value = formData[f.name];
      if (rule.type === "popup") {
        if (rule.required) {
          const popupValue = popupHandlers[f.name]?.value;
          if (!popupValue || popupValue.trim() === "") {
            newErrors[f.name] = `${rule.label} is required`;
            isValid = false;
          }
        }
        return;
      }
      if (rule.required) {
        if ((rule.type === "toggle" || rule.type === "checkbox") && !value) {
          newErrors[f.name] = `${rule.label} is required`;
          isValid = false;
        } else if ((value === "" || value === null || value === undefined) &&
          rule.type !== "toggle" && rule.type !== "checkbox") {
          newErrors[f.name] = `${rule.label} is required`;
          isValid = false;
        }
      }
      if (value !== "" && value !== null && value !== undefined && value !== false) {
        const result = KiduValidation.validate(value, rule as any);
        if (!result.isValid) {
          newErrors[f.name] = result.message || "Invalid value";
          isValid = false;
        }
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!hasChanges()) {
      toast("No changes to update", { icon: "ℹ️" });
      return;
    }
    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      fields.forEach(f => {
        if (f.rules.type === "popup" && popupHandlers[f.name]?.actualValue !== undefined) {
          submitData[f.name] = popupHandlers[f.name].actualValue;
        }
        if (f.rules.type === "smartdropdown" && dropdownValues[f.name] !== undefined) {
          submitData[f.name] = dropdownValues[f.name];
        }
      });

      const updateResult = await onUpdate(recordId, submitData);
      let updatedData = (updateResult && typeof updateResult === 'object') ? updateResult : submitData;

      setInitialData(updatedData);
      setFormData(updatedData);
      setInitialDropdownValues({ ...dropdownValues });

      onHide();
      await new Promise((resolve) => setTimeout(resolve, 300));
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: themeColor,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMsg = err.message || errorMessage || "An error occurred";
      toast.error(errorMsg);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
        confirmButtonColor: themeColor,
        confirmButtonText: "OK"
      });
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  // ==================== RENDER FORM CONTROLS ====================
  const renderFormControl = (field: Field) => {
    const { name, rules } = field;
    const { type, placeholder } = rules;
    const fieldPlaceholder = placeholder || `Enter ${rules.label.toLowerCase()}`;

    switch (type) {
      case "smartdropdown": {
        const handler = dropdownHandlers[name];
        return (
          <KiduDropdown
            ref={(ref: any) => {
              if (ref?.reset) {
                dropdownResetRefs.current[name] = ref.reset;
              }
            }}
            value={dropdownValues[name] ?? null}
            onChange={(val) => {
              setDropdownValues((prev) => ({ ...prev, [name]: val }));
              if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
            }}
            staticOptions={handler?.staticOptions}
            paginatedFetch={handler?.paginatedFetch}
            mapOption={handler?.mapOption}
            pageSize={handler?.pageSize}
            placeholder={handler?.placeholder ?? `Select ${rules.label}...`}
            required={rules.required}
            disabled={rules.disabled}
            error={errors[name]}
            inputWidth="100%"
          />
        );
      }

      // case "popup": {
      //   const handler = popupHandlers[name];
      //   return (
      //     <KiduSelectInputPill
      //       ref={(ref: any) => {
      //         if (ref?.reset) {
      //           popupResetRefs.current[name] = ref.reset;
      //         }
      //       }}
      //       value={handler?.value ?? ""}
      //       onOpen={handler?.onOpen ?? (() => {})}
      //       onClear={handler?.onClear ?? (() => {})}
      //       placeholder={`Select ${rules.label}...`}
      //       required={rules.required}
      //       disabled={rules.disabled}
      //       error={errors[name]}
      //       inputWidth="100%"
      //     />
      //   );
      // }
      // In KiduEditModal, remove the ref and handle reset through props
case "popup": {
  const handler = popupHandlers[name];
  return (
    <KiduSelectInputPill
      value={handler?.value ?? ""}
      onOpen={handler?.onOpen ?? (() => {})}
      onClear={handler?.onClear ?? (() => {})}
      placeholder={`Select ${rules.label}...`}
      required={rules.required}
      disabled={rules.disabled}
      error={errors[name]}
      inputWidth="100%"
    />
  );
}

      case "password":
        return (
          <InputGroup className="kidu-input-group">
            <Form.Control
              type={showPasswords[name] ? "text" : "password"}
              name={name}
              autoComplete="new-password"
              placeholder={fieldPlaceholder}
              value={formData[name]}
              onChange={handleChange}
              onBlur={() => handleBlur(name)}
              isInvalid={!!errors[name]}
              disabled={rules.disabled}
              className={`kidu-input-grouped ${rules.disabled ? 'kidu-input-disabled' : ''}`}
            />
            <Button
              variant="outline-secondary"
              onClick={() => togglePasswordVisibility(name)}
              className="kidu-input-btn"
            >
              {showPasswords[name] ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        );

      case "select":
      case "dropdown": {
        const fieldOptions = options[name] || [];
        return (
          <Form.Select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            disabled={rules.disabled}
            className={`kidu-select ${rules.disabled ? 'kidu-input-disabled' : ''}`}
          >
            <option value="">Select {rules.label}</option>
            {fieldOptions.map((opt: any, idx: number) => {
              const optValue = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;
              return (
                <option key={idx} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </Form.Select>
        );
      }

      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            name={name}
            placeholder={fieldPlaceholder}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            disabled={rules.disabled}
            maxLength={rules.maxLength}
            className={`kidu-textarea ${rules.disabled ? 'kidu-input-disabled' : ''}`}
          />
        );

      case "radio": {
        const fieldOptions = options[name] || [];
        return (
          <div className="d-flex flex-wrap gap-3">
            {fieldOptions.map((opt: any, idx: number) => {
              const optValue = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;
              return (
                <Form.Check
                  key={idx}
                  type="radio"
                  id={`${name}-${idx}`}
                  name={name}
                  label={optLabel}
                  value={optValue}
                  checked={formData[name] === optValue}
                  onChange={handleChange}
                />
              );
            })}
          </div>
        );
      }

      case "checkbox":
        return (
          <Form.Check
            type="checkbox"
            id={name}
            name={name}
            label={rules.label}
            checked={!!formData[name]}
            onChange={handleChange}
          />
        );

      case "toggle":
        // Skip rendering toggle fields here - they're handled in the header
        return null;

      case "date":
        return (
          <Form.Control
            type="date"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            disabled={rules.disabled}
            className={`kidu-input ${rules.disabled ? 'kidu-input-disabled' : ''}`}
          />
        );

      case "file":
        return (
          <Form.Control
            type="file"
            name={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] || null;
              setFormData(prev => ({ ...prev, [name]: file }));
            }}
            isInvalid={!!errors[name]}
            className="kidu-input"
          />
        );

      default:
        return (
          <Form.Control
            type={type === "number" ? "tel" : type}
            name={name}
            autoComplete={type === "email" ? "email" : "off"}
            placeholder={fieldPlaceholder}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            maxLength={rules.maxLength}
            disabled={rules.disabled}
            className={`kidu-input ${rules.disabled ? 'kidu-input-disabled' : ''}`}
          />
        );
    }
  };

  // ==================== RENDER FIELD ====================
  const renderField = (field: Field, index: number) => {
    const { name, rules } = field;
    if (rules.type === "rowbreak") {
      return <div key={`rowbreak-${index}`} className="w-100"></div>;
    }

    // Skip rendering toggle fields in the body - they're shown in header
    if (rules.type === "toggle") {
      return null;
    }

    const colWidth = rules.colWidth || 6;

    return (
      <Col md={colWidth} className="mb-3" key={name}>
        {/* Label row — KiduCharacterCounter renders itself only when applicable */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <Form.Label className="kidu-form-label" style={{ marginBottom: 0 }}>
            {rules.label}
            {rules.required && <span className="kidu-required-star">*</span>}
          </Form.Label>
          <KiduCharacterCounter
            value={formData[name] ?? ""}
            maxLength={rules.maxLength}
            type={rules.type}
          />
        </div>

        {renderFormControl(field)}

        {rules.type !== "popup" && rules.type !== "smartdropdown" && errors[name] && (
          <div className="kidu-error-message">{errors[name]}</div>
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
        keyboard={false}
        contentClassName="kidu-modal-content"
        dialogClassName="kidu-modal-dialog"
        style={modalWidth ? { "--kidu-modal-max-width": typeof modalWidth === "number" ? `${modalWidth}px` : modalWidth } as React.CSSProperties : undefined}
      >
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
            <Modal.Title className="kidu-modal-title">{title}</Modal.Title>
            {subtitle && <p className="kidu-modal-subtitle">{subtitle}</p>}
          </div>

          {/* Active Toggle in Header - Matching KiduCreateModal style */}
          <div className="kidu-modal-header-right">
            <span className="kidu-active-label">Active</span>
            <div
              className={`kidu-toggle ${(formData.isActive || formData.active) ? "kidu-toggle--on" : ""}`}
              onClick={() => {
                const activeFieldName = activeField?.name || "isActive";
                handleChange({
                  target: {
                    name: activeFieldName,
                    value: !(formData[activeFieldName] || formData.isActive || formData.active),
                    type: "switch",
                    checked: !(formData[activeFieldName] || formData.isActive || formData.active)
                  }
                } as any);
              }}
              role="switch"
              aria-checked={formData.isActive || formData.active || false}
              tabIndex={0}
              onKeyDown={(e) => { 
                if (e.key === " " || e.key === "Enter") {
                  const activeFieldName = activeField?.name || "isActive";
                  handleChange({
                    target: {
                      name: activeFieldName,
                      value: !(formData[activeFieldName] || formData.isActive || formData.active),
                      type: "switch",
                      checked: !(formData[activeFieldName] || formData.isActive || formData.active)
                    }
                  } as any);
                }
              }}
            >
              <div className="kidu-toggle-thumb" />
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
            <Form onSubmit={handleSubmit}>
              <Row>
                {fields.map((field, index) => renderField(field, index))}
              </Row>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer className="kidu-modal-footer">
          {/* Reset button replaces the cancel button */}
          <KiduReset
            initialValues={initialData} // Use initialData (the fetched data) as the reset target
            setFormData={setFormData}
            setErrors={setErrors}
            dropdownRefs={dropdownResetRefs}
            popupRefs={popupResetRefs}
          />
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || loadingState || !hasChanges() || loading}
            className="kidu-btn-submit"
            style={{ backgroundColor: themeColor }}
          >
            {isSubmitting || loadingState ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </>
  );
};

export default KiduEditModal;