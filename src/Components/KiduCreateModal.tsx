import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import KiduValidation from "./KiduValidation";
import HttpService from "../Services/HttpService";
import KiduReset from "./KiduReset";


export interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "email" | "date" | "select";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

interface KiduCreateModalProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
  fields: Field[];
  endpoint: string;
  onCreated: (newItem: T) => void;
}

function KiduCreateModal<T>({
  show,
  handleClose,
  title,
  fields,
  endpoint,
  onCreated
}: KiduCreateModalProps<T>) {
  const initialValues: Record<string, any> = {};
  fields.forEach(f => (initialValues[f.name] = ""));

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const rules = {
        type: field.type,
        required: field.required,
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        label: field.label
      };

      const result = KiduValidation.validate(formData[field.name], rules);

      if (!result.isValid) {
        newErrors[field.name] = result.message || "Invalid input";
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const requestData: Record<string, any> = {};
      fields.forEach(f => {
        const value = formData[f.name];
        requestData[f.name] = f.type === "number" ? Number(value) : value || null;
      });

      const res = await HttpService.callApi<any>(endpoint, "POST", requestData);

      toast.success("Created successfully!");

      // ⭐ Generic extraction logic
      const newItem = res?.value || res;

      // ⭐ Send only the created object to popup
      onCreated(newItem as T);

      handleClose();
      setFormData(initialValues);
      setErrors({});
    } catch (err: any) {
      toast.error(err.message || "Failed to create", {
        style: { background: "#ffe5e5", color: "#173a6a" }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setFormData(initialValues);
    setErrors({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton style={{ background: "#f8f9fa" }}>
        <Modal.Title className="fs-6 fw-semibold text-dark">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {fields.map(field => (
            <Form.Group key={field.name} className="mb-3">
              <Form.Label className="fw-semibold">
                {field.label} {field.required && <span className="text-danger">*</span>}
              </Form.Label>

              {field.type === "textarea" ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData[field.name]}
                  onChange={e => handleChange(field.name, e.target.value)}
                  isInvalid={!!errors[field.name]}
                />
              ) : (
                <Form.Control
                  type={field.type}
                  value={formData[field.name]}
                  onChange={e => {
                    const value =
                      field.type === "number"
                        ? e.target.value.replace(/[^0-9]/g, "")
                        : e.target.value;
                    handleChange(field.name, value);
                  }}
                  isInvalid={!!errors[field.name]}
                />
              )}

              <Form.Control.Feedback type="invalid">
                {errors[field.name]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <KiduReset initialValues={initialValues} setFormData={setFormData} setErrors={setErrors} />

        <Button
          style={{ backgroundColor: "#173a6a", border: "none" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default KiduCreateModal;
