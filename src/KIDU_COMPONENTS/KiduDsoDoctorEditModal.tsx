import React, { useState, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PracticeRow {
  id: number;
  practiceId: string;
  isActive: boolean;
}

interface InitialData {
  doctorCode: string;
  userId: string;
  firstName: string;
  lastName: string;
  gdcNo?: string;
  email: string;
  isActive: boolean;
  practices: { practiceId: string; isActive: boolean }[];
}

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  initialData: InitialData;
  practiceOptions?: { value: string; label: string }[];
  onSubmit: (data: {
    doctorCode: string;
    userId: string;
    firstName: string;
    lastName: string;
    gdcNo: string;
    email: string;
    isActive: boolean;
    practices: { practiceId: string; isActive: boolean }[];
  }) => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────
const KiduDsoDoctorEditModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  initialData,
  practiceOptions = [],
  onSubmit,
}) => {

  // ── All useState at top ───────────────────────────────────────────────────
  const [form, setForm] = useState({
    doctorCode: "",
    userId:     "",
    firstName:  "",
    lastName:   "",
    gdcNo:      "",
    email:      "",
  });
  const [isActive,     setIsActive]     = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [practices,    setPractices]    = useState<PracticeRow[]>([{ id: 1, practiceId: "", isActive: true }]);
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  // ── Sync initialData when modal opens ─────────────────────────────────────
  useEffect(() => {
    if (show && initialData) {
      setForm({
        doctorCode: initialData.doctorCode ?? "",
        userId:     initialData.userId     ?? "",
        firstName:  initialData.firstName  ?? "",
        lastName:   initialData.lastName   ?? "",
        gdcNo:      initialData.gdcNo      ?? "",
        email:      initialData.email      ?? "",
      });
      setIsActive(initialData.isActive ?? true);
      setPractices(
        initialData.practices?.length > 0
          ? initialData.practices.map((p, i) => ({
              id:         i + 1,
              practiceId: p.practiceId,
              isActive:   p.isActive ?? true,
            }))
          : [{ id: 1, practiceId: "", isActive: true }]
      );
      setErrors({});
    }
  }, [show, initialData]);

  // ── All useCallback at top ────────────────────────────────────────────────

  // Reset restores back to original initialData values
  const handleReset = useCallback(() => {
    if (!initialData) return;
    setForm({
      doctorCode: initialData.doctorCode ?? "",
      userId:     initialData.userId     ?? "",
      firstName:  initialData.firstName  ?? "",
      lastName:   initialData.lastName   ?? "",
      gdcNo:      initialData.gdcNo      ?? "",
      email:      initialData.email      ?? "",
    });
    setIsActive(initialData.isActive ?? true);
    setPractices(
      initialData.practices?.length > 0
        ? initialData.practices.map((p, i) => ({
            id:         i + 1,
            practiceId: p.practiceId,
            isActive:   p.isActive ?? true,
          }))
        : [{ id: 1, practiceId: "", isActive: true }]
    );
    setErrors({});
  }, [initialData]);

  const handleClose = useCallback(() => {
    onHide();
  }, [onHide]);

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const addPractice = useCallback(() => {
    const newId = Date.now();
    setPractices((prev) => [...prev, { id: newId, practiceId: "", isActive: true }]);
  }, []);

  const removePractice = useCallback((id: number) => {
    const fallbackId = Date.now();
    setPractices((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      return updated.length > 0 ? updated : [{ id: fallbackId, practiceId: "", isActive: true }];
    });
  }, []);

  const updatePractice = useCallback((id: number, value: string) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, practiceId: value } : p))
    );
  }, []);

  const togglePracticeActive = useCallback((id: number) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
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
        practices: practices.map((p) => ({
          practiceId: p.practiceId,
          isActive:   p.isActive,
        })),
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
        .kdem-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .kdem-modal {
          background: var(--theme-bg-paper);
          border-radius: 16px;
          width: 100%;
          max-width: 780px;
          max-height: 90vh;
          overflow: visible;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          border: 1px solid var(--theme-border);
          position: relative;
        }

        /* ── Header ── */
        .kdem-header {
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

        .kdem-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ── Floating close button ── */
        .kdem-close-btn {
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

        .kdem-close-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #ef4444;
        }

        .kdem-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--theme-text-primary);
          margin: 0;
          letter-spacing: -0.2px;
        }

        .kdem-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .kdem-toggle-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--theme-text-secondary);
        }

        .kdem-toggle {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: var(--theme-border);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .kdem-toggle.on { background: #22c55e; }

        .kdem-toggle-thumb {
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

        .kdem-toggle.on .kdem-toggle-thumb { left: 23px; }

        /* ── Body ── */
        .kdem-body {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: calc(90vh - 140px);
        }

        .kdem-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 24px;
          margin-bottom: 16px;
        }

        .kdem-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .kdem-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--theme-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .kdem-required { color: #ef4444; margin-left: 2px; }

        .kdem-input {
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

        .kdem-input:focus {
          border-color: var(--theme-primary);
          background: var(--theme-bg-paper);
          box-shadow: 0 0 0 3px rgba(239,13,80,0.1);
        }

        .kdem-input.error { border-color: #ef4444; }

        .kdem-input::placeholder { color: var(--theme-text-disabled); }

        .kdem-error-msg { font-size: 0.72rem; color: #ef4444; }

        /* ── Practices ── */
        .kdem-practices-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          margin-top: 4px;
        }

        .kdem-practices-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--theme-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .kdem-add-btn {
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

        .kdem-add-btn:hover {
          background: var(--theme-bg-hover);
          border-color: var(--theme-primary);
          color: var(--theme-primary);
        }

        .kdem-practices-table {
          width: 100%;
          border-collapse: collapse;
          border: 1.5px solid var(--theme-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .kdem-practices-table th {
          background: var(--theme-bg, #e1f2f7);
          padding: 10px 14px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--theme-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          text-align: left;
        }

        .kdem-practices-table th.center { text-align: center; }

        .kdem-practices-table td {
          padding: 10px 14px;
          border-top: 1px solid var(--theme-divider);
          vertical-align: middle;
          background: var(--theme-bg-paper);
        }

        .kdem-practices-table td.center {
          text-align: center;
          color: var(--theme-text-secondary);
          font-size: 0.85rem;
        }

        .kdem-select-wrap { position: relative; width: 100%; }

        .kdem-select {
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

        .kdem-select:focus {
          border-color: var(--theme-primary);
          background: var(--theme-bg-paper);
        }

        .kdem-select-arrow {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--theme-text-disabled);
          font-size: 0.75rem;
        }

        /* ── Per-row active toggle ── */
        .kdem-row-active {
          display: flex;
          align-items: center;
          gap: 7px;
          justify-content: center;
        }

        .kdem-row-active-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #22c55e;
        }

        .kdem-row-active-label.inactive { color: var(--theme-text-disabled); }

        .kdem-row-toggle {
          width: 36px;
          height: 20px;
          border-radius: 10px;
          background: var(--theme-border);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .kdem-row-toggle.on { background: #22c55e; }

        .kdem-row-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: left 0.2s;
        }

        .kdem-row-toggle.on .kdem-row-toggle-thumb { left: 18px; }

        /* ── Footer ── */
        .kdem-footer {
          padding: 16px 28px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid var(--theme-divider);
        }

        .kdem-reset-btn {
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

        .kdem-reset-btn:hover {
          background: var(--theme-bg-hover);
          border-color: var(--theme-primary);
          color: var(--theme-primary);
        }

        .kdem-update-btn {
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

        .kdem-update-btn:hover:not(:disabled) { background: var(--theme-primary-hover); }
        .kdem-update-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .kdem-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: kdem-spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes kdem-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="kdem-overlay" onClick={handleClose}>
        <div className="kdem-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── Floating close button outside modal top-right ── */}
          <button
            className="kdem-close-btn"
            onClick={handleClose}
            type="button"
            title="Close"
            aria-label="Close"
          >
            ✕
          </button>

          {/* ── Header ── */}
          <div className="kdem-header">
            <div className="kdem-header-left">
              <h2 className="kdem-title">Edit Doctor</h2>
            </div>
            <div className="kdem-header-right">
              <span className="kdem-toggle-label">Active</span>
              <div
                className={`kdem-toggle ${isActive ? "on" : ""}`}
                onClick={() => setIsActive((p) => !p)}
                role="switch"
                aria-checked={isActive}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setIsActive((p) => !p); }}
              >
                <div className="kdem-toggle-thumb" />
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="kdem-body">

            {/* Row 1: Doctor Code + User ID */}
            <div className="kdem-row">
              <div className="kdem-field">
                <label className="kdem-label">Doctor Code <span className="kdem-required">*</span></label>
                <input className={`kdem-input ${errors.doctorCode ? "error" : ""}`} placeholder="Enter Doctor code" value={form.doctorCode} onChange={(e) => handleChange("doctorCode", e.target.value)} />
                {errors.doctorCode && <span className="kdem-error-msg">{errors.doctorCode}</span>}
              </div>
              <div className="kdem-field">
                <label className="kdem-label">User ID <span className="kdem-required">*</span></label>
                <input className={`kdem-input ${errors.userId ? "error" : ""}`} placeholder="Enter User ID" value={form.userId} onChange={(e) => handleChange("userId", e.target.value)} />
                {errors.userId && <span className="kdem-error-msg">{errors.userId}</span>}
              </div>
            </div>

            {/* Row 2: First Name + Last Name */}
            <div className="kdem-row">
              <div className="kdem-field">
                <label className="kdem-label">First Name <span className="kdem-required">*</span></label>
                <input className={`kdem-input ${errors.firstName ? "error" : ""}`} placeholder="Enter First name" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                {errors.firstName && <span className="kdem-error-msg">{errors.firstName}</span>}
              </div>
              <div className="kdem-field">
                <label className="kdem-label">Last Name <span className="kdem-required">*</span></label>
                <input className={`kdem-input ${errors.lastName ? "error" : ""}`} placeholder="Enter Last name" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                {errors.lastName && <span className="kdem-error-msg">{errors.lastName}</span>}
              </div>
            </div>

            {/* Row 3: GDC No + Email */}
            <div className="kdem-row">
              <div className="kdem-field">
                <label className="kdem-label">GDC No.</label>
                <input className="kdem-input" placeholder="Enter GDC No." value={form.gdcNo} onChange={(e) => handleChange("gdcNo", e.target.value)} />
              </div>
              <div className="kdem-field">
                <label className="kdem-label">Email <span className="kdem-required">*</span></label>
                <input type="email" className={`kdem-input ${errors.email ? "error" : ""}`} placeholder="Enter Email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
                {errors.email && <span className="kdem-error-msg">{errors.email}</span>}
              </div>
            </div>

            {/* Practices */}
            <div>
              <div className="kdem-practices-header">
                <span className="kdem-practices-label">Practices <span className="kdem-required">*</span></span>
                <button className="kdem-add-btn" onClick={addPractice} type="button">+ Add Practices</button>
              </div>
              {errors.practices && <span className="kdem-error-msg" style={{ marginBottom: 8, display: "block" }}>{errors.practices}</span>}
              <table className="kdem-practices-table">
                <thead>
                  <tr>
                    <th className="center" style={{ width: 60 }}>S.No</th>
                    <th>Practice <span className="kdem-required">*</span></th>
                    <th className="center" style={{ width: 150 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {practices.map((practice, idx) => (
                    <tr key={practice.id}>
                      <td className="center">{idx + 1}</td>
                      <td>
                        <div className="kdem-select-wrap">
                          <select className="kdem-select" value={practice.practiceId} onChange={(e) => updatePractice(practice.id, e.target.value)}>
                            <option value="">Select Practice</option>
                            {practiceOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <span className="kdem-select-arrow">▾</span>
                        </div>
                      </td>
                      <td>
                        {/* Per-row active toggle */}
                        <div className="kdem-row-active">
                          <span className={`kdem-row-active-label ${practice.isActive ? "" : "inactive"}`}>
                            {practice.isActive ? "Active" : "Inactive"}
                          </span>
                          <div
                            className={`kdem-row-toggle ${practice.isActive ? "on" : ""}`}
                            onClick={() => togglePracticeActive(practice.id)}
                            role="switch"
                            aria-checked={practice.isActive}
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") togglePracticeActive(practice.id); }}
                          >
                            <div className="kdem-row-toggle-thumb" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="kdem-footer">
            <button className="kdem-reset-btn" onClick={handleReset} type="button">
              ↺ Reset
            </button>
            <button className="kdem-update-btn" onClick={handleSubmit} disabled={isSubmitting} type="button">
              {isSubmitting ? (<><span className="kdem-spinner" /> Updating...</>) : "Update"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default KiduDsoDoctorEditModal;
