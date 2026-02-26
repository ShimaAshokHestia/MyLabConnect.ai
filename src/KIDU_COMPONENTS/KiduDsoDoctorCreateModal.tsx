import React, { useState, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Practice {
  id: number;
  practiceId: string;
}

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  practiceOptions?: { value: string; label: string }[];
  onSubmit: (data: {
    doctorCode: string;
    userId: string;
    firstName: string;
    lastName: string;
    gdcNo: string;
    email: string;
    isActive: boolean;
    practices: { practiceId: string }[];
  }) => Promise<void>;
}

const EMPTY_FORM = {
  doctorCode: "",
  userId:     "",
  firstName:  "",
  lastName:   "",
  gdcNo:      "",
  email:      "",
};

// ── Component ─────────────────────────────────────────────────────────────────
const KiduDsoDoctorCreateModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  practiceOptions = [],
  onSubmit,
}) => {

  // ── All useState at top ───────────────────────────────────────────────────
  const [form,         setForm]         = useState({ ...EMPTY_FORM });
  const [isActive,     setIsActive]     = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [practices,    setPractices]    = useState<Practice[]>([{ id: 1, practiceId: "" }]);
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  // ── Reset when modal closes ───────────────────────────────────────────────
  useEffect(() => {
    if (!show) {
      setForm({ ...EMPTY_FORM });
      setIsActive(true);
      setPractices([{ id: 1, practiceId: "" }]);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [show]);

  // ── All useCallback at top ────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setForm({ ...EMPTY_FORM });
    setIsActive(true);
    setPractices([{ id: 1, practiceId: "" }]);
    setErrors({});
  }, []);

  const handleClose = useCallback(() => {
    onHide();
  }, [onHide]);

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const addPractice = useCallback(() => {
    const newId = Date.now();
    setPractices((prev) => [...prev, { id: newId, practiceId: "" }]);
  }, []);

  const removePractice = useCallback((id: number) => {
    const fallbackId = Date.now();
    setPractices((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      return updated.length > 0 ? updated : [{ id: fallbackId, practiceId: "" }];
    });
  }, []);

  const updatePractice = useCallback((id: number, value: string) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, practiceId: value } : p))
    );
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!form.doctorCode.trim()) newErrors.doctorCode = "Doctor Code is required";
    if (!form.userId.trim())     newErrors.userId     = "User ID is required";
    if (!form.firstName.trim())  newErrors.firstName  = "First Name is required";
    if (!form.lastName.trim())   newErrors.lastName   = "Last Name is required";
    if (!form.email.trim())      newErrors.email      = "Email is required";
    if (practices.some((p) => !p.practiceId))
      newErrors.practices = "All practice fields are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, practices]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        isActive,
        practices: practices.map((p) => ({ practiceId: p.practiceId })),
      });
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, form, isActive, practices, onSubmit, onSuccess, handleClose]);

  // ── Early return AFTER all hooks ──────────────────────────────────────────
  if (!show) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .kdcm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .kdcm-modal {
          background: var(--theme-bg-paper);
          border-radius: 16px;
          width: 100%;
          max-width: 780px;
          max-height: 90vh;
          overflow-y: auto;
          overflow: visible;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          border: 1px solid var(--theme-border);
          position: relative;
        }

        /* ── Header ── */
        .kdcm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid var(--theme-border);
          position: sticky;
          top: 0;
          background: var(--theme-bg-paper);
          z-index: 1;
          border-radius: 16px 16px 0 0;
        }

        .kdcm-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kdcm-close-btn {
          position: absolute;
          top: -14px;
          right: -14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--theme-border);
          background: var(--theme-bg-paper);
          color: var(--theme-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          line-height: 1;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .kdcm-close-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #ef4444;
        }

        .kdcm-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--theme-text-primary);
          margin: 0;
          letter-spacing: -0.2px;
        }

        .kdcm-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .kdcm-toggle-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--theme-text-secondary);
        }

        .kdcm-toggle {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: var(--theme-border);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .kdcm-toggle.on {
          background: #22c55e;
        }

        .kdcm-toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: left 0.2s;
        }

        .kdcm-toggle.on .kdcm-toggle-thumb {
          left: 23px;
        }

        /* ── Body ── */
        .kdcm-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
        }

        .kdcm-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 24px;
          margin-bottom: 16px;
        }

        .kdcm-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .kdcm-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--theme-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .kdcm-required {
          color: #ef4444;
          margin-left: 2px;
        }

        .kdcm-input {
          height: 42px;
          border: 1.5px solid var(--theme-border);
          border-radius: 8px;
          padding: 0 12px;
          font-size: 0.88rem;
          color: var(--theme-text-primary);
          background: var(--theme-bg, #e1f2f7);
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        .kdcm-input:focus {
          border-color: var(--theme-primary);
          background: var(--theme-bg-paper);
          box-shadow: 0 0 0 3px rgba(239,13,80,0.1);
        }

        .kdcm-input.error {
          border-color: #ef4444;
        }

        .kdcm-input::placeholder {
          color: var(--theme-text-disabled);
        }

        .kdcm-error-msg {
          font-size: 0.72rem;
          color: #ef4444;
        }

        /* ── Practices ── */
        .kdcm-practices-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          margin-top: 4px;
        }

        .kdcm-practices-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--theme-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .kdcm-add-btn {
          height: 34px;
          padding: 0 14px;
          border: 1.5px solid var(--theme-border);
          border-radius: 8px;
          background: var(--theme-bg-paper);
          color: var(--theme-text-primary);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.15s, border-color 0.15s;
        }

        .kdcm-add-btn:hover {
          background: var(--theme-bg-hover);
          border-color: var(--theme-primary);
          color: var(--theme-primary);
        }

        .kdcm-practices-table {
          width: 100%;
          border-collapse: collapse;
          border: 1.5px solid var(--theme-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .kdcm-practices-table th {
          background: var(--theme-bg, #e1f2f7);
          padding: 10px 14px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--theme-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          text-align: left;
        }

        .kdcm-practices-table th.center { text-align: center; }

        .kdcm-practices-table td {
          padding: 10px 14px;
          border-top: 1px solid var(--theme-divider);
          vertical-align: middle;
          background: var(--theme-bg-paper);
        }

        .kdcm-practices-table td.center {
          text-align: center;
          color: var(--theme-text-secondary);
          font-size: 0.85rem;
        }

        .kdcm-select-wrap {
          position: relative;
          width: 100%;
        }

        .kdcm-select {
          width: 100%;
          height: 38px;
          border: 1.5px solid var(--theme-border);
          border-radius: 8px;
          padding: 0 36px 0 12px;
          font-size: 0.87rem;
          color: var(--theme-text-primary);
          background: var(--theme-bg, #e1f2f7);
          appearance: none;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s;
        }

        .kdcm-select:focus {
          border-color: var(--theme-primary);
          background: var(--theme-bg-paper);
        }

        .kdcm-select-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--theme-text-disabled);
          font-size: 0.75rem;
        }

        .kdcm-delete-btn {
          width: 32px;
          height: 32px;
          border: 1.5px solid #fecaca;
          border-radius: 8px;
          background: #fff5f5;
          color: #ef4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          margin: 0 auto;
        }

        .kdcm-delete-btn:hover {
          background: #fee2e2;
        }

        /* ── Footer ── */
        .kdcm-footer {
          padding: 16px 28px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid var(--theme-divider);
        }

        .kdcm-reset-btn {
          height: 42px;
          padding: 0 24px;
          border-radius: 10px;
          border: 1.5px solid var(--theme-border);
          background: var(--theme-bg-paper);
          color: var(--theme-text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }

        .kdcm-reset-btn:hover {
          background: var(--theme-bg-hover);
          border-color: var(--theme-primary);
          color: var(--theme-primary);
        }

        .kdcm-save-btn {
          height: 42px;
          padding: 0 32px;
          border-radius: 10px;
          border: none;
          background: var(--theme-primary);
          color: #fff;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .kdcm-save-btn:hover:not(:disabled) {
          background: var(--theme-primary-hover);
        }

        .kdcm-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .kdcm-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: kdcm-spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes kdcm-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="kdcm-overlay" onClick={handleClose}>
        <div className="kdcm-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── Floating close button outside modal top-right ── */}
          <button
            className="kdcm-close-btn"
            onClick={handleClose}
            type="button"
            title="Close"
            aria-label="Close"
          >
            ✕
          </button>

          {/* ── Header ── */}
          <div className="kdcm-header">
            <div className="kdcm-header-left">
              <h2 className="kdcm-title">Add Doctor</h2>
            </div>
            <div className="kdcm-header-right">
              <span className="kdcm-toggle-label">Active</span>
              <div
                className={`kdcm-toggle ${isActive ? "on" : ""}`}
                onClick={() => setIsActive((p) => !p)}
                role="switch"
                aria-checked={isActive}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setIsActive((p) => !p); }}
              >
                <div className="kdcm-toggle-thumb" />
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="kdcm-body">

            {/* Row 1: Doctor Code + User ID */}
            <div className="kdcm-row">
              <div className="kdcm-field">
                <label className="kdcm-label">Doctor Code <span className="kdcm-required">*</span></label>
                <input className={`kdcm-input ${errors.doctorCode ? "error" : ""}`} placeholder="Enter Doctor code" value={form.doctorCode} onChange={(e) => handleChange("doctorCode", e.target.value)} />
                {errors.doctorCode && <span className="kdcm-error-msg">{errors.doctorCode}</span>}
              </div>
              <div className="kdcm-field">
                <label className="kdcm-label">User ID <span className="kdcm-required">*</span></label>
                <input className={`kdcm-input ${errors.userId ? "error" : ""}`} placeholder="Enter User ID" value={form.userId} onChange={(e) => handleChange("userId", e.target.value)} />
                {errors.userId && <span className="kdcm-error-msg">{errors.userId}</span>}
              </div>
            </div>

            {/* Row 2: First Name + Last Name */}
            <div className="kdcm-row">
              <div className="kdcm-field">
                <label className="kdcm-label">First Name <span className="kdcm-required">*</span></label>
                <input className={`kdcm-input ${errors.firstName ? "error" : ""}`} placeholder="Enter First name" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                {errors.firstName && <span className="kdcm-error-msg">{errors.firstName}</span>}
              </div>
              <div className="kdcm-field">
                <label className="kdcm-label">Last Name <span className="kdcm-required">*</span></label>
                <input className={`kdcm-input ${errors.lastName ? "error" : ""}`} placeholder="Enter Last name" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                {errors.lastName && <span className="kdcm-error-msg">{errors.lastName}</span>}
              </div>
            </div>

            {/* Row 3: GDC No + Email */}
            <div className="kdcm-row">
              <div className="kdcm-field">
                <label className="kdcm-label">GDC No.</label>
                <input className="kdcm-input" placeholder="Enter GDC No." value={form.gdcNo} onChange={(e) => handleChange("gdcNo", e.target.value)} />
              </div>
              <div className="kdcm-field">
                <label className="kdcm-label">Email <span className="kdcm-required">*</span></label>
                <input type="email" className={`kdcm-input ${errors.email ? "error" : ""}`} placeholder="Enter Email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
                {errors.email && <span className="kdcm-error-msg">{errors.email}</span>}
              </div>
            </div>

            {/* Practices */}
            <div>
              <div className="kdcm-practices-header">
                <span className="kdcm-practices-label">Practices <span className="kdcm-required">*</span></span>
                <button className="kdcm-add-btn" onClick={addPractice} type="button">+ Add Practices</button>
              </div>
              {errors.practices && <span className="kdcm-error-msg" style={{ marginBottom: 8, display: "block" }}>{errors.practices}</span>}
              <table className="kdcm-practices-table">
                <thead>
                  <tr>
                    <th className="center" style={{ width: 60 }}>S.No</th>
                    <th>Practice <span className="kdcm-required">*</span></th>
                    <th className="center" style={{ width: 80 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {practices.map((practice, idx) => (
                    <tr key={practice.id}>
                      <td className="center">{idx + 1}</td>
                      <td>
                        <div className="kdcm-select-wrap">
                          <select className="kdcm-select" value={practice.practiceId} onChange={(e) => updatePractice(practice.id, e.target.value)}>
                            <option value="">Select Practice</option>
                            {practiceOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <span className="kdcm-select-arrow">▾</span>
                        </div>
                      </td>
                      <td>
                        <button className="kdcm-delete-btn" onClick={() => removePractice(practice.id)} type="button" title="Remove">🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="kdcm-footer">
            {/* Reset button */}
            <button className="kdcm-reset-btn" onClick={handleReset} type="button">
              ↺ Reset
            </button>

            {/* Save button */}
            <button className="kdcm-save-btn" onClick={handleSubmit} disabled={isSubmitting} type="button">
              {isSubmitting ? (<><span className="kdcm-spinner" /> Saving...</>) : "Save"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default KiduDsoDoctorCreateModal;
