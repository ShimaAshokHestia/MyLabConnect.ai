import React, { useState, useRef, useCallback } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import '../../../Styles/Pages/Prescription.css';
import KiduValidation from '../../../KIDU_COMPONENTS/KiduValidation';
import KiduDropdown from '../../../KIDU_COMPONENTS/KiduDropdown';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface FormState {
  orderTo: string | number | null;
  orderFrom: string | number | null;
  shipTo: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dueDate: string;
  caseNotes: string;
  fileType: string;
  remake: boolean;
  rush: boolean;
}

interface FormErrors {
  orderTo?: string;
  orderFrom?: string;
  patientId?: string;
  firstName?: string;
  lastName?: string;
  dueDate?: string;
  caseNotes?: string;
}

interface AdditionalService {
  serviceName: string | number | null;
  generalComments: string;
}

interface AdditionalServiceErrors {
  serviceName?: string;
}

const FILE_TYPE_OPTIONS = ['IOS scan', 'CBCT/CT Scan', 'Photograph', 'Others'];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const INITIAL_FORM: FormState = {
  orderTo: null, orderFrom: null, shipTo: '',
  patientId: '', firstName: '', lastName: '',
  dueDate: '', caseNotes: '', fileType: '',
  remake: false, rush: false,
};

const INITIAL_SERVICE: AdditionalService = { serviceName: null, generalComments: '' };

const UploadIcon = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const AddNewCase: React.FC = () => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [service, setService] = useState<AdditionalService>(INITIAL_SERVICE);
  const [serviceErrors, setServiceErrors] = useState<AdditionalServiceErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Validation ────────────────────────────────

  const validateField = useCallback((name: keyof FormErrors, value: any): string => {
    const rules: Record<keyof FormErrors, any> = {
      orderTo:    { type: 'select',  required: true, label: 'Order To' },
      orderFrom:  { type: 'select',  required: true, label: 'Order From' },
      patientId:  { type: 'text',    required: true, label: 'Patient ID', minLength: 2 },
      firstName:  { type: 'text',    required: true, label: 'First Name', minLength: 2 },
      lastName:   { type: 'text',    required: true, label: 'Last Name',  minLength: 2 },
      dueDate:    { type: 'date',    required: true, label: 'Due Date' },
      caseNotes:  { type: 'textarea',required: true, label: 'Case Notes', minLength: 5 },
    };
    const result = KiduValidation.validate(value, rules[name]);
    return result.isValid ? '' : result.message ?? '';
  }, []);

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {
      orderTo:   validateField('orderTo',   form.orderTo),
      orderFrom: validateField('orderFrom', form.orderFrom),
      patientId: validateField('patientId', form.patientId),
      firstName: validateField('firstName', form.firstName),
      lastName:  validateField('lastName',  form.lastName),
      dueDate:   validateField('dueDate',   form.dueDate),
      caseNotes: validateField('caseNotes', form.caseNotes),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  // ── Form handlers ─────────────────────────────

  const handleText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors(p => ({ ...p, [name]: validateField(name as keyof FormErrors, value) }));
  };

  const handleCheck = (name: 'remake' | 'rush') =>
    setForm(p => ({ ...p, [name]: !p[name] }));

  const handleDropdownChange = (name: 'orderTo' | 'orderFrom', val: string | number | null) => {
    setForm(p => ({ ...p, [name]: val }));
    // Simulate ship-to resolve from orderFrom
    if (name === 'orderFrom' && val)
      setForm(p => ({ ...p, orderFrom: val, shipTo: 'Cotgrave, 21 West Furlong, Nottingham, Nottinghamshire, NG12 3NL' }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: validateField(name, val) }));
  };

  // ── Files ─────────────────────────────────────

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles(p => [...p, ...Array.from(incoming)]);
  };

  const removeFile = (idx: number) => setFiles(p => p.filter((_, i) => i !== idx));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Submit / Reset ────────────────────────────

  const handleSubmit = () => {
    if (!validateAll()) return;
    console.log('Submit', { ...form, files });
    // API call goes here
  };

  const handleDraft = () => {
    console.log('Draft', { ...form, files });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setFiles([]);
  };

  // ── Additional Services modal ─────────────────

  const handleServiceSave = () => {
    const err = KiduValidation.validate(service.serviceName, { type: 'select', required: true, label: 'Service Name' });
    if (!err.isValid) { setServiceErrors({ serviceName: err.message }); return; }
    console.log('Additional service saved:', service);
    setShowServiceModal(false);
    setService(INITIAL_SERVICE);
    setServiceErrors({});
  };

  // ── Render ────────────────────────────────────

  return (
    <div className="anc-page">
      <div className="anc-body">

        {/* ── Header card ── */}
        <div className="anc-header">
          <span className="anc-page-title">Add New Case</span>
          <div className="anc-header-right">
            <div className="anc-check-group">
              {(['remake', 'rush'] as const).map(key => (
                <label key={key} className="anc-check-item">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={() => handleCheck(key)}
                  />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Order info card ── */}
        <div className="anc-card">
          <Row className="g-3">
            {/* Order To */}
            <Col xs={12} md={4}>
              <label className="anc-label">Order To <span className="anc-required">*</span></label>
              <KiduDropdown
                value={form.orderTo}
                onChange={val => handleDropdownChange('orderTo', val)}
                placeholder="Select Lab..."
                error={errors.orderTo}
                inputWidth="100%"
              />
            </Col>

            {/* Order From */}
            <Col xs={12} md={4}>
              <label className="anc-label">Order From <span className="anc-required">*</span></label>
              <KiduDropdown
                value={form.orderFrom}
                onChange={val => handleDropdownChange('orderFrom', val)}
                placeholder="Select Practice / Doctor..."
                error={errors.orderFrom}
                inputWidth="100%"
              />
            </Col>

            {/* Ship To */}
            <Col xs={12} md={4}>
              <label className="anc-label">Ship To</label>
              <input
                className="anc-input anc-input-readonly"
                value={form.shipTo}
                placeholder="Auto-filled on Order From selection"
                readOnly
              />
            </Col>

            {/* Patient ID */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">Patient ID <span className="anc-required">*</span></label>
              <input
                className={`anc-input${errors.patientId ? ' is-invalid' : ''}`}
                name="patientId"
                placeholder="Enter Patient ID"
                value={form.patientId}
                onChange={handleText}
                onBlur={e => setErrors(p => ({ ...p, patientId: validateField('patientId', e.target.value) }))}
              />
              {errors.patientId && <div className="anc-error">{errors.patientId}</div>}
            </Col>

            {/* First Name */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">First Name <span className="anc-required">*</span></label>
              <input
                className={`anc-input${errors.firstName ? ' is-invalid' : ''}`}
                name="firstName"
                placeholder="Enter First Name"
                value={form.firstName}
                onChange={handleText}
                onBlur={e => setErrors(p => ({ ...p, firstName: validateField('firstName', e.target.value) }))}
              />
              {errors.firstName && <div className="anc-error">{errors.firstName}</div>}
            </Col>

            {/* Last Name */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">Last Name <span className="anc-required">*</span></label>
              <input
                className={`anc-input${errors.lastName ? ' is-invalid' : ''}`}
                name="lastName"
                placeholder="Enter Last Name"
                value={form.lastName}
                onChange={handleText}
                onBlur={e => setErrors(p => ({ ...p, lastName: validateField('lastName', e.target.value) }))}
              />
              {errors.lastName && <div className="anc-error">{errors.lastName}</div>}
            </Col>

            {/* Due Date */}
            <Col xs={12} sm={6} md={3}>
              <label className="anc-label">Due Date <span className="anc-required">*</span></label>
              <input
                type="date"
                className={`anc-input${errors.dueDate ? ' is-invalid' : ''}`}
                name="dueDate"
                value={form.dueDate}
                onChange={handleText}
                onBlur={e => setErrors(p => ({ ...p, dueDate: validateField('dueDate', e.target.value) }))}
              />
              {errors.dueDate && <div className="anc-error">{errors.dueDate}</div>}
            </Col>
          </Row>
        </div>

        {/* ── Restoration Details card ── */}
        <div className="anc-card">
          <div className="anc-card-header">
            <span className="anc-card-title">Restoration Details</span>
            <div className="anc-card-actions">
              <button className="anc-btn anc-btn-primary" type="button">Add Restoration</button>
              <button className="anc-btn anc-btn-outline" type="button" onClick={() => setShowServiceModal(true)}>
                Additional Services
              </button>
            </div>
          </div>
          {/* Restoration rows rendered here dynamically — placeholder */}
          <div style={{ minHeight: 28, color: 'var(--theme-text-disabled)', fontSize: '0.75rem', textAlign: 'center', padding: '8px 0' }}>
            No restorations added yet. Click "Add Restoration" to begin.
          </div>
        </div>

        {/* ── Document + Case Notes ── */}
        <div className="anc-split">
          {/* Document Attachment */}
          <div className="anc-card">
            <div className="anc-card-header">
              <span className="anc-card-title">Document Attachment</span>
              <div className="anc-filetype-wrap">
                <span className="anc-filetype-label">File Type</span>
                <select
                  className="anc-filetype-select"
                  value={form.fileType}
                  name="fileType"
                  onChange={handleText}
                >
                  <option value="">Select File Type</option>
                  {FILE_TYPE_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drop zone */}
            <div
              className={`anc-dropzone${dragOver ? ' dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload files"
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <div className="anc-dropzone-icon"><UploadIcon /></div>
              <span className="anc-dropzone-text">Drag and Drop Files here or Choose file</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              style={{ display: 'none' }}
              onChange={e => addFiles(e.target.files)}
            />

            {files.length > 0 && (
              <div className="anc-file-list">
                {files.map((f, i) => (
                  <div key={i} className="anc-file-chip">
                    <span className="anc-file-chip-name">{f.name}</span>
                    <button className="anc-file-chip-remove" onClick={() => removeFile(i)} aria-label="Remove file">×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="anc-file-note">Note: Max 2GB file upload allowed</div>

            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="anc-btn anc-btn-outline" onClick={() => fileInputRef.current?.click()}>
                Upload Files
              </button>
            </div>
          </div>

          {/* Case Notes */}
          <div className="anc-card">
            <div className="anc-card-header">
              <span className="anc-card-title">Case Notes <span className="anc-required">*</span></span>
            </div>
            <textarea
              className={`anc-textarea${errors.caseNotes ? ' is-invalid' : ''}`}
              name="caseNotes"
              placeholder="Enter case notes..."
              value={form.caseNotes}
              onChange={handleText}
              onBlur={e => setErrors(p => ({ ...p, caseNotes: validateField('caseNotes', e.target.value) }))}
              style={{ height: 'calc(100% - 50px)', minHeight: 130 }}
            />
            {errors.caseNotes && <div className="anc-error">{errors.caseNotes}</div>}
          </div>
        </div>

      </div>

      {/* ── Sticky footer ── */}
      <div className="anc-footer">
        <button className="anc-btn anc-btn-reset" onClick={handleReset}>Reset</button>
        <button className="anc-btn anc-btn-draft" onClick={handleDraft}>Draft</button>
        <button className="anc-btn anc-btn-submit" onClick={handleSubmit}>Submit</button>
      </div>

      {/* ── Additional Services Modal ── */}
      <Modal
        show={showServiceModal}
        onHide={() => { setShowServiceModal(false); setService(INITIAL_SERVICE); setServiceErrors({}); }}
        centered
        size="sm"
        dialogClassName="anc-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Additional Services</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <label className="anc-label">
              Service Name <span className="anc-required">*</span>
            </label>
            <KiduDropdown
              value={service.serviceName}
              onChange={val => {
                setService(p => ({ ...p, serviceName: val }));
                if (serviceErrors.serviceName) setServiceErrors({});
              }}
              placeholder="Select Service Name"
              error={serviceErrors.serviceName}
              inputWidth="100%"
            />
          </div>

          <div>
            <label className="anc-label">General Comments</label>
            <textarea
              className="anc-textarea"
              placeholder="Enter any General Comments"
              value={service.generalComments}
              onChange={e => setService(p => ({ ...p, generalComments: e.target.value }))}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            className="anc-btn anc-btn-outline"
            onClick={() => { setShowServiceModal(false); setService(INITIAL_SERVICE); setServiceErrors({}); }}
          >
            Cancel
          </Button>
          <Button
            className="anc-btn anc-btn-primary"
            style={{ border: 'none' }}
            onClick={handleServiceSave}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddNewCase;