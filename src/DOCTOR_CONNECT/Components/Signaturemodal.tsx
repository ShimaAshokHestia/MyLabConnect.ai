import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../Styles/Signaturemodal.css';

interface SignatureModalProps {
  show: boolean;
  mode: 'draw' | 'upload';
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const PEN_COLORS = [
  { name: 'Navy', value: '#1a2a4a' },
  { name: 'Crimson', value: '#ef0d50' },
  { name: 'Forest', value: '#10b981' },
  { name: 'Slate', value: '#64748b' },
];

const SignatureModal: React.FC<SignatureModalProps> = ({ show, mode, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1a2a4a');
  const [isEmpty, setIsEmpty] = useState(true);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [penColor]);

  useEffect(() => {
    if (show && mode === 'draw') {
      setTimeout(initCanvas, 50);
    }
    setIsEmpty(true);
    setUploadPreview(null);
  }, [show, mode, initCanvas]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.strokeStyle = penColor;
    }
  }, [penColor]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setIsDrawing(true);
    setIsEmpty(false);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const handleClear = () => {
    initCanvas();
    setIsEmpty(true);
    setUploadPreview(null);
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) onSave(canvas.toDataURL('image/png'));
    } else if (uploadPreview) {
      onSave(uploadPreview);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadPreview(ev.target?.result as string);
      setIsEmpty(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal show={show} onHide={onClose} centered className="signature-modal" size="lg">
      <Modal.Header>
        <div className="sig-modal-header">
          <div className="sig-modal-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </div>
          <div>
            <h5 className="sig-modal-title">
              {mode === 'draw' ? 'Draw Your Signature' : 'Upload Your Signature'}
            </h5>
            <p className="sig-modal-subtitle">
              {mode === 'draw' ? 'Use your mouse or finger to sign below' : 'Upload a PNG or JPG of your signature'}
            </p>
          </div>
        </div>
        <button className="sig-close-btn" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 2l12 12M14 2L2 14" />
          </svg>
        </button>
      </Modal.Header>

      <Modal.Body className="sig-modal-body">
        {mode === 'draw' ? (
          <>
            <div className="pen-color-bar">
              <span className="pen-label">Ink color</span>
              <div className="pen-colors">
                {PEN_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`pen-swatch ${penColor === c.value ? 'selected' : ''}`}
                    style={{ background: c.value }}
                    title={c.name}
                    onClick={() => setPenColor(c.value)}
                  />
                ))}
              </div>
            </div>
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={680}
                height={220}
                className={`sig-canvas ${isDrawing ? 'drawing' : ''}`}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              {isEmpty && (
                <div className="canvas-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  <span>Sign here</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="upload-area">
            <input
              type="file"
              id="sig-upload"
              accept="image/png,image/jpeg,image/jpg"
              className="d-none"
              onChange={handleFileChange}
            />
            {uploadPreview ? (
              <div className="upload-preview">
                <img src={uploadPreview} alt="Signature preview" />
                <button className="upload-change-btn" onClick={() => document.getElementById('sig-upload')?.click()}>
                  Change
                </button>
              </div>
            ) : (
              <label htmlFor="sig-upload" className="upload-dropzone">
                <div className="upload-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="upload-hint">Click to browse or drag & drop</p>
                <span className="upload-formats">PNG, JPG up to 5MB</span>
              </label>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="sig-modal-footer">
        <Button variant="outline-secondary" className="sig-btn-clear" onClick={handleClear}>
          Clear
        </Button>
        <Button
          className="sig-btn-save"
          disabled={isEmpty}
          onClick={handleSave}
        >
          Apply Signature
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignatureModal;