import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Modal, InputGroup } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "../Styles/KiduStyles/CreateModal.css";
import KiduValidation from "./KiduValidation";
import { KiduSelectInputPill } from "./KiduSelectPopup";

// ==================== TYPES ====================

export interface FieldRule {
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "textarea"
    | "popup"
    | "date"
    | "radio"
    | "url"
    | "checkbox"
    | "toggle"
    | "rowbreak"
    | "dropdown"
    | "file";
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

/**
 * Popup handler wired into a single field.
 *
 * value   → the display string shown in the pill (e.g. master.name)
 * onOpen  → opens the KiduSelectPopup for that field
 * onClear → clears the selection
 *
 * Example usage in a Create page:
 *
 *   const [selectedMaster, setSelectedMaster] = useState<DSOmaster | null>(null);
 *   const [masterOpen, setMasterOpen] = useState(false);
 *
 *   const popupHandlers: PopupHandlers = {
 *     dsoMasterId: {
 *       value:   selectedMaster?.name ?? "",
 *       onOpen:  () => setMasterOpen(true),
 *       onClear: () => { setSelectedMaster(null); setFormExtra({ dsoMasterId: null }); },
 *     },
 *   };
 *
 *   // Pass selectedMaster.id into the form via the onSelect callback:
 *   onSelect={(master) => {
 *     setSelectedMaster(master);
 *     setFormExtra({ dsoMasterId: master.id });
 *   }}
 */
export interface PopupFieldHandler {
  /** Display label shown in the pill input */
  value: string;
  /** Called when the user clicks the pill to open the picker */
  onOpen: () => void;
  /** Called when the user clicks ✕ to clear the selection */
  onClear: () => void;
}

/** Map of field name → PopupFieldHandler */
export type PopupHandlers = Record<string, PopupFieldHandler>;

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
  /**
   * Handlers for every field whose type === "popup".
   * Key must match the field name.
   */
  popupHandlers?: PopupHandlers;
  /**
   * Extra values that are controlled outside the modal (e.g. selected popup IDs).
   * Merged into formData at submit time so onSubmit receives them.
   */
  extraValues?: Record<string, any>;
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
  extraValues = {},
  loadingState = false,
  successMessage = "Created successfully!",
  errorMessage,
  onSuccess,
  themeColor = "#ef0d50",
  size = "lg",
  centered = true,
}) => {
  // ── Initialise form state from field definitions ──────────────────────────
  const buildInitial = () => {
    const values: Record<string, any> = {};
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.rules.type === "rowbreak" || f.rules.type === "popup") return;
      if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
        values[f.name] = false;
      } else if (f.rules.type === "radio" && options[f.name]?.length) {
        const first = options[f.name][0];
        values[f.name] = typeof first === "object" ? (first as SelectOption).value : first;
      } else {
        values[f.name] = "";
      }
      errs[f.name] = "";
    });
    return { values, errs };
  };

  const { values: initialValues, errs: initialErrors } = buildInitial();

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setFormData(initialValues);
      setErrors(initialErrors);
      setTouchedFields({});
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // ==================== HANDLERS ====================

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    const updated =
      type === "checkbox" || type === "switch"
        ? checked
        : type === "tel"
        ? value.replace(/[^0-9]/g, "")
        : value;

    setFormData((prev) => ({ ...prev, [name]: updated }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (touchedFields[name]) validateField(name, updated);
  };

  const handleBlur = (name: string) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name: string, value: any): boolean => {
    const rule = fields.find((f) => f.name === name)?.rules;
    if (!rule) return true;

    // Popup fields: check that the handler value is non-empty
    if (rule.type === "popup") {
      if (rule.required && !popupHandlers[name]?.value?.trim()) {
        setErrors((prev) => ({ ...prev, [name]: `${rule.label} is required` }));
        return false;
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    }

    if ((rule.type === "toggle" || rule.type === "checkbox") && rule.required && !value) {
      setErrors((prev) => ({ ...prev, [name]: `${rule.label} is required` }));
      return false;
    }

    const result = KiduValidation.validate(value, rule as any);
    const msg = result.isValid ? "" : result.message || "";
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return result.isValid;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach((f) => {
      if (f.rules.type === "rowbreak") return;
      const { required, type, label } = f.rules;
      const value = formData[f.name];

      if (type === "popup") {
        if (required && !popupHandlers[f.name]?.value?.trim()) {
          newErrors[f.name] = `${label} is required`;
          isValid = false;
        }
        return;
      }

      if (required) {
        if ((type === "toggle" || type === "checkbox") && !value) {
          newErrors[f.name] = `${label} is required`;
          isValid = false;
        } else if (
          (value === "" || value === null || value === undefined) &&
          type !== "toggle" &&
          type !== "checkbox"
        ) {
          newErrors[f.name] = `${label} is required`;
          isValid = false;
        }
      }

      if (value !== "" && value !== null && value !== undefined && value !== false) {
        const result = KiduValidation.validate(value, f.rules as any);
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
      // Merge extra values (popup IDs etc.) into form data
      const submitData = { ...formData, ...extraValues };
      await onSubmit(submitData);

      onHide();
      await new Promise((r) => setTimeout(r, 300));
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: themeColor,
        timer: 2000,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err.message || errorMessage || "An error occurred";
      toast.error(msg);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: msg,
        confirmButtonColor: themeColor,
        confirmButtonText: "OK",
      });
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (name: string) =>
    setShowPasswords((prev) => ({ ...prev, [name]: !prev[name] }));

  // ==================== RENDER CONTROLS ====================

  const renderFormControl = (field: Field) => {
    const { name, rules } = field;
    const { type, placeholder, disabled } = rules;
    const ph = placeholder || `Enter ${rules.label.toLowerCase()}`;

    switch (type) {
      // ── POPUP ────────────────────────────────────────────────────────────
      case "popup": {
        const handler = popupHandlers[name];
        return (
          <KiduSelectInputPill
            value={handler?.value ?? ""}
            onOpen={handler?.onOpen ?? (() => {})}
            onClear={handler?.onClear ?? (() => {})}
            placeholder={`Select ${rules.label}...`}
            required={rules.required}
            disabled={disabled}
            error={errors[name]}
            inputWidth="100%"
          />
        );
      }

      // ── PASSWORD ─────────────────────────────────────────────────────────
      case "password":
        return (
          <InputGroup className="kidu-input-group">
            <Form.Control
              type={showPasswords[name] ? "text" : "password"}
              name={name}
              autoComplete="new-password"
              placeholder={ph}
              value={formData[name]}
              onChange={handleChange}
              onBlur={() => handleBlur(name)}
              isInvalid={!!errors[name]}
              disabled={disabled}
              className={`kidu-input-grouped ${disabled ? "kidu-input-disabled" : ""}`}
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

      // ── SELECT / DROPDOWN ────────────────────────────────────────────────
      case "select":
      case "dropdown": {
        const opts = options[name] || [];
        return (
          <Form.Select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            disabled={disabled}
            className={`kidu-select ${disabled ? "kidu-input-disabled" : ""}`}
          >
            <option value="">Select {rules.label}</option>
            {opts.map((opt: any, idx: number) => {
              const v = typeof opt === "object" ? opt.value : opt;
              const l = typeof opt === "object" ? opt.label : opt;
              return <option key={idx} value={v}>{l}</option>;
            })}
          </Form.Select>
        );
      }

      // ── TEXTAREA ─────────────────────────────────────────────────────────
      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            name={name}
            placeholder={ph}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            disabled={disabled}
            className={`kidu-textarea ${disabled ? "kidu-input-disabled" : ""}`}
          />
        );

      // ── RADIO ────────────────────────────────────────────────────────────
      case "radio": {
        const opts = options[name] || [];
        return (
          <div className="kidu-radio-group">
            {opts.map((opt: any, idx: number) => {
              const v = typeof opt === "object" ? opt.value : opt;
              const l = typeof opt === "object" ? opt.label : opt;
              return (
                <Form.Check
                  key={idx}
                  type="radio"
                  id={`${name}-${idx}`}
                  name={name}
                  label={l}
                  value={v}
                  checked={formData[name] === v}
                  onChange={handleChange}
                />
              );
            })}
          </div>
        );
      }

      // ── CHECKBOX ─────────────────────────────────────────────────────────
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

      // ── TOGGLE ───────────────────────────────────────────────────────────
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

      // ── DATE ─────────────────────────────────────────────────────────────
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

      // ── FILE ─────────────────────────────────────────────────────────────
      case "file":
        return (
          <Form.Control
            type="file"
            name={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] || null;
              setFormData((prev) => ({ ...prev, [name]: file }));
            }}
            isInvalid={!!errors[name]}
            className="kidu-input"
          />
        );

      // ── DEFAULT (text / email / url / number) ─────────────────────────
      default:
        return (
          <Form.Control
            type={type === "number" ? "tel" : type}
            name={name}
            autoComplete={type === "email" ? "email" : "off"}
            placeholder={ph}
            value={formData[name]}
            onChange={handleChange}
            onBlur={() => handleBlur(name)}
            isInvalid={!!errors[name]}
            maxLength={rules.maxLength}
            disabled={disabled}
            className={`kidu-input ${disabled ? "kidu-input-disabled" : ""}`}
          />
        );
    }
  };

  // ==================== RENDER FIELD ====================

  const renderField = (field: Field, index: number) => {
    const { name, rules } = field;

    if (rules.type === "rowbreak") {
      return <div key={`rowbreak-${index}`} className="w-100" />;
    }

    const colWidth = rules.colWidth || 6;

    return (
      <Col md={colWidth} className="mb-3" key={name}>
        {/* Popup fields render their own label via KiduSelectInputPill */}
        {rules.type !== "popup" && (
          <Form.Label className="kidu-form-label">
            {rules.label}
            {rules.required && <span className="kidu-required-star">*</span>}
          </Form.Label>
        )}

        {renderFormControl(field)}

        {/* Popup errors are rendered inside KiduSelectInputPill; skip duplicate */}
        {rules.type !== "popup" && errors[name] && (
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
            <Modal.Title className="kidu-modal-title">{title}</Modal.Title>
            {subtitle && <p className="kidu-modal-subtitle">{subtitle}</p>}
          </div>
        </Modal.Header>

        <Modal.Body className="kidu-modal-body">
          <Form onSubmit={handleSubmit}>
            <Row>{fields.map((f, i) => renderField(f, i))}</Row>
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
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
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