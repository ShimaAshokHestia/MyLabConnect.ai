import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../Styles/Contactstep.css';

export interface ContactEntry {
  email: string;
  mobile: string;
}

interface ContactStepProps {
  entries: ContactEntry[];
  onChange: (entries: ContactEntry[]) => void;
}

const ContactStep: React.FC<ContactStepProps> = ({ entries, onChange }) => {
  const updateEntry = (index: number, field: 'email' | 'mobile', value: string) => {
    const updated = entries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    onChange(updated);
  };

  return (
    <div className="contact-step animate-step">
      <div className="contact-header-info">
        <div className="contact-header-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div>
          <p className="contact-header-title">Additional Contact Points</p>
          <p className="contact-header-sub">Add up to 4 email and mobile number contacts for notifications.</p>
        </div>
      </div>

      <div className="contact-entries">
        {entries.map((entry, i) => (
          <div key={i} className={`contact-entry-row ${i === 0 ? 'primary-entry' : ''}`}>
            <div className="entry-number">
              <span>{i + 1}</span>
              {i === 0 && <span className="primary-badge">Primary</span>}
            </div>
            <Row className="g-2 flex-grow-1">
              <Col xs={12} sm={6}>
                <div className="contact-field-wrap">
                  <span className="contact-field-icon email-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="contact-input"
                    value={entry.email}
                    onChange={(e) => updateEntry(i, 'email', e.target.value)}
                    placeholder={i === 0 ? 'Primary email' : `Email ID ${i + 1}`}
                    disabled={i === 0}
                  />
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="contact-field-wrap">
                  <span className="contact-field-icon mobile-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                  </span>
                  <input
                    type="tel"
                    className="contact-input"
                    value={entry.mobile}
                    onChange={(e) => updateEntry(i, 'mobile', e.target.value)}
                    placeholder={i === 0 ? 'Primary mobile' : `Mobile No. ${i + 1}`}
                    disabled={i === 0}
                  />
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </div>

      <p className="contact-note">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Primary contact is synced from your profile and cannot be changed here.
      </p>
    </div>
  );
};

export default ContactStep;