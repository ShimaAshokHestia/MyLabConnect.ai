import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Image, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import Swal from 'sweetalert2';
import KiduValidation from "./KiduValidation";
import KiduPrevious from "./KiduPrevious";
import KiduReset from "./KiduReset";
import KiduSubmit from "./KiduSubmit";

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

export interface ImageConfig {
  fieldName: string;
  defaultImage: string;
  label?: string;
  required?: boolean;
}

export interface KiduCreateProps {
  title: string;
  subtitle?: string;
  fields: Field[];
  onSubmit: (formData: Record<string, any>) => Promise<void> | void;
  submitButtonText?: string;
  showResetButton?: boolean;
  showBackButton?: boolean;
  containerStyle?: React.CSSProperties;
  children?: React.ReactNode;
  options?: Record<string, SelectOption[] | string[]>;
  popupHandlers?: Record<string, PopupHandler>;
  loadingState?: boolean;
  successMessage?: string;
  errorMessage?: string;
  navigateOnSuccess?: string;
  navigateDelay?: number;
  imageConfig?: ImageConfig;
  themeColor?: string;
}

// ==================== COMPONENT ====================
const KiduCreate: React.FC<KiduCreateProps> = ({
  title,
  fields,
  onSubmit,
  submitButtonText = "Create",
  showResetButton = true,
  showBackButton = true,
  containerStyle = {},
  children,
  options = {},
  popupHandlers = {},
  loadingState = false,
  successMessage = "Created successfully!",
  errorMessage,
  navigateOnSuccess,
  imageConfig,
  themeColor = "#882626ff",
}) => {
  const navigate = useNavigate();

  // Separate toggle fields from regular fields
  const regularFields = fields.filter(f => f.rules.type !== "toggle");
  const toggleFields = fields.filter(f => f.rules.type === "toggle");

  // Initialize form data and errors using fields
  const initialValues: Record<string, any> = {};
  const initialErrors: Record<string, string> = {};

  fields.forEach(f => {
    if (f.rules.type === "rowbreak") return; // Skip rowbreak fields

    if (f.rules.type === "toggle" || f.rules.type === "checkbox") {
      initialValues[f.name] = f.name === "isActive" ? true : false;
    } else if (f.rules.type === "radio" && options[f.name]?.length) {
      const firstOption = options[f.name][0];
      initialValues[f.name] = typeof firstOption === "object" ? firstOption.value : firstOption;
    } else {
      initialValues[f.name] = "";
    }
    initialErrors[f.name] = "";
  });

  // Add image field if configured
  if (imageConfig) {
    initialValues[imageConfig.fieldName] = "";
  }

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Image upload states
  const [previewUrl, setPreviewUrl] = useState<string>(imageConfig?.defaultImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ==================== HANDLERS ====================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imageConfig) return;

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (typeof previewUrl === "string" && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      const objectUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
    }
  };

  // const fileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       const base64String = reader.result as string;
  //       const base64Data = base64String.split(',')[1];
  //       resolve(base64Data);
  //     };
  //     reader.onerror = error => reject(error);
  //   });
  // };

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

    if (imageConfig?.required && !selectedFile) {
      toast.error(`Please upload ${imageConfig.label || "an image"}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };

      // Convert image to File if exists
      if (imageConfig && selectedFile) {
        submitData[imageConfig.fieldName] = selectedFile;
      }

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

      // Navigate to list page after success
      if (navigateOnSuccess) {
        navigate(navigateOnSuccess);
      }
    } catch (err: any) {
      // ✅ UPDATED ERROR HANDLING - Show actual error message from API
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
          <InputGroup>
            <Form.Control
              type="text"
              value={popup?.value || ""}
              placeholder={`Select ${rules.label}`}
              readOnly
              isInvalid={!!errors[name]}
              disabled={rules.disabled}
              style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
            />
            <Button variant="outline-secondary" onClick={popup?.onOpen}>
              <BsSearch />
            </Button>
          </InputGroup>
        );
      }

      /* ---------- PASSWORD ---------- */
      case "password":
        return (
          <InputGroup>
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
              style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
            />
            <Button
              variant="outline-secondary"
              onClick={() => togglePasswordVisibility(name)}
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
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
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
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
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
            style={rules.disabled ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" } : {}}
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

    const colWidth = rules.colWidth || 4;

    return (
      <Col md={colWidth} className="mb-3" key={name}>
        <Form.Label className="fw-bold">
          {rules.label}
          {rules.required && <span style={{ color: "red", marginLeft: "2px" }}>*</span>}
        </Form.Label>

        {renderFormControl(field)}

        {errors[name] && (
          <div className="text-danger small mt-1">{errors[name]}</div>
        )}
      </Col>
    );
  };

  // ==================== RENDER ====================
  return (
    <>
      <div
        className="container-fluid px-2 mt-1"
        style={{ fontFamily: "Urbanist" }}
      >
        <div
          className="shadow-sm rounded p-4"
          style={{
            backgroundColor: "white",
            ...containerStyle
          }}
        >
          {/* HEADER */}
          <div className="d-flex align-items-center mb-3">
            {showBackButton && <KiduPrevious />}
            <h4 className="fw-bold mb-0 ms-2" style={{ color: themeColor }}>
              {title}
            </h4>
          </div>

          <hr />

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              {/* Image Upload Section */}
              {imageConfig && (
                <Col xs={12}>
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title mb-3">
                        {imageConfig.label || "Profile Picture"}
                      </h5>

                      <div className="d-flex align-items-center gap-3">
                        {/* Image Preview */}
                        <div>
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt={imageConfig.label || "Preview"}
                              style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid #dee2e6",
                              }}
                              onError={(e: any) => {
                                e.target.src = imageConfig.defaultImage;
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "120px",
                                height: "120px",
                                backgroundColor: "#f8f9fa",
                                border: "2px dashed #dee2e6",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#6c757d",
                                fontSize: "14px",
                              }}
                            >
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div>
                          <input
                            type="file"
                            id={imageConfig.fieldName}
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                          />

                          <label
                            htmlFor={imageConfig.fieldName}
                            className="btn btn-primary btn-sm mb-2"
                            style={{ cursor: "pointer", backgroundColor: themeColor, border: "none" }}
                          >
                            Select Image
                          </label>

                          <div className="text-muted small">
                            Max size: 5MB. Accepted formats: JPG, PNG, GIF
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              )}

              {/* Form Fields Section */}
              <Col xs={12}>
                <Row className="g-2">
                  {regularFields.map((field, index) => renderField(field, index))}
                </Row>
              </Col>
            </Row>


            {/* Toggle Switches Section */}
            {toggleFields.length > 0 && (
              <Row className="mb-3 mx-1">
                <Col xs={12}>
                  <div className="d-flex flex-wrap gap-3">
                    {toggleFields.map(field => (
                      <Form.Check
                        key={field.name}
                        type="switch"
                        id={field.name}
                        name={field.name}
                        label={field.rules.label}
                        checked={formData[field.name] || false}
                        onChange={handleChange}
                        className="fw-semibold"
                      />
                    ))}
                  </div>
                </Col>
              </Row>
            )}

            {/* Custom children content */}
            {children}

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              {showResetButton && (
                <KiduReset
                  initialValues={initialValues}
                  setFormData={setFormData}
                  setErrors={setErrors}
                />
              )}
              <KiduSubmit
                isSubmitting={isSubmitting}
                loadingState={loadingState}
                submitButtonText={submitButtonText}
                themeColor={themeColor}
              />
            </div>
          </Form>
        </div>

        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default KiduCreate;