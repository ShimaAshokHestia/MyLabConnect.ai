import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal, InputGroup } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import Swal from 'sweetalert2';
import "../Styles/KiduStyles/CreateModal.css";
import KiduValidation from "./KiduValidation";

// ==================== TYPES ====================
export interface FieldRule {
  type: "text" | "number" | "email" | "password" | "select" | "textarea" | "popup" | "date" | "radio" | "url" | "checkbox" | "toggle" | "rowbreak" | "dropdown" | "file";
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
}

export interface KiduCreateModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  subtitle?: string;
  fields: Field[];
  onSubmit: (formData: Record<string, any>) => Promise<void> | void;
  submitButtonText?: string;
  cancelButtonText?: string;
  options?: Record<string, SelectOption[] | string[]>;
  popupHandlers?: Record<string, PopupHandler>;
  loadingState?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  themeColor?: string;
  size?: "sm" | "lg" | "xl";
  centered?: boolean;
}

// ==================== COMPONENT ====================
const KiduCreateModal: React.FC<KiduCreateModalProps> = ({
  show,
  onHide,
  title,
  subtitle,
  fields,
  onSubmit,
  submitButtonText = "Create",
  cancelButtonText = "Cancel",
  options = {},
  popupHandlers = {},
  loadingState = false,
  successMessage = "Created successfully!",
  errorMessage,
  onSuccess,
  themeColor = "#ef0d50",
  size = "lg",
  centered = true,
}) => {
  // Initialize form data and errors using fields
  const initialValues: Record<string, any> = {};
  const initialErrors: Record<string, string> = {};

  fields.forEach(f => {
    if (f.rules.type === "rowbreak") return; // Skip rowbreak fields

    if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
      initialValues[f.name] = f.name === "isActive" ? false : false;
    } else if (f.rules.type === "radio" && options[f.name]?.length) {
      const firstOption = options[f.name][0];
      initialValues[f.name] = typeof firstOption === "object" ? firstOption.value : firstOption;
    } else {
      initialValues[f.name] = "";
    }
    initialErrors[f.name] = "";
  });

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setFormData(initialValues);
      setErrors(initialErrors);
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

    // Special handling for popup fields
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
      if (f.rules.type === "rowbreak") return; // Skip rowbreak

      const rule = f.rules;
      const value = formData[f.name];

      // Special handling for popup fields
      if (rule.type === "popup") {
        if (rule.required) {
          const popupValue = popupHandlers[f.name]?.value;
          if (!popupValue || popupValue.trim() === "") {
            newErrors[f.name] = `${rule.label} is required`;
            isValid = false;
          }
        }
        return; // Skip other validations for popup fields
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

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      await onSubmit(submitData);

      // Show success alert with SweetAlert2
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: themeColor,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: "OK"
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onHide();
    } catch (err: any) {
      const errorMsg = err.message || errorMessage || "An error occurred";

      // Show error toast
      toast.error(errorMsg);

      // Also show SweetAlert for better visibility
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
      /* ---------- POPUP ---------- */
      case "popup": {
        const popup = popupHandlers[name];
        return (
          <InputGroup className="kidu-input-group">
            <Form.Control
              type="text"
              value={popup?.value || ""}
              placeholder={`Select ${rules.label}`}
              readOnly
              isInvalid={!!errors[name]}
              disabled={rules.disabled}
              className={`kidu-input-grouped ${rules.disabled ? 'kidu-input-disabled' : ''}`}
            />
            <Button 
              variant="outline-secondary" 
              onClick={popup?.onOpen}
              className="kidu-input-btn"
            >
              <BsSearch />
            </Button>
          </InputGroup>
        );
      }

      /* ---------- PASSWORD ---------- */
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

      /* ---------- SELECT ---------- */
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

      /* ---------- TEXTAREA ---------- */
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
            className={`kidu-textarea ${rules.disabled ? 'kidu-input-disabled' : ''}`}
          />
        );

      /* ---------- RADIO ---------- */
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

      /* ---------- CHECKBOX ---------- */
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

      /* ---------- TOGGLE ---------- */
      case "toggle":
        return (
          <Form.Check
            type="switch"
            id={name}
            name={name}
            label={rules.label}
            checked={!!formData[name]}
            onChange={handleChange}
          />
        );

      /* ---------- DATE ---------- */
      case "date":
        return (
          <Form.Control
            type="date"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            className="kidu-input"
          />
        );

      /* ---------- FILE ---------- */
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

      /* ---------- DEFAULT ---------- */
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

    // Handle row break
    if (rules.type === "rowbreak") {
      return <div key={`rowbreak-${index}`} className="w-100"></div>;
    }

    const colWidth = rules.colWidth || 6;

    return (
      <Col md={colWidth} className="mb-3" key={name}>
        <Form.Label className="kidu-form-label">
          {rules.label}
          {rules.required && <span className="kidu-required-star">*</span>}
        </Form.Label>

        {renderFormControl(field)}
        {errors[name] && (
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
      >
        <Modal.Header closeButton className="kidu-modal-header">
          <div>
            <Modal.Title className="kidu-modal-title">
              {title}
            </Modal.Title>
            {subtitle && (
              <p className="kidu-modal-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </Modal.Header>

        <Modal.Body className="kidu-modal-body">
          <Form onSubmit={handleSubmit}>
            <Row>
              {fields.map((field, index) => renderField(field, index))}
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer className="kidu-modal-footer">
          <Button
            variant="light"
            onClick={onHide}
            disabled={isSubmitting}
            className="kidu-btn-cancel"
          >
            {cancelButtonText}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || loadingState}
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

export default KiduCreateModal;
