import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import type { PreferencesStepData } from './Preferencestep';
import type { NotificationRow } from './Notificationstep';
import type { ContactEntry } from './Contactstep';
import StepIndicator from './StepIndicator';
import PreferencesStep from './Preferencestep';
import NotificationsStep from './Notificationstep';
import ContactStep from './Contactstep';
import type { ProfileStepData } from './ProfileStep';
import ProfileStep from './ProfileStep';

export interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
  onSave?: (data: ProfileFormData) => void;
}

export interface ProfileFormData {
  profile: ProfileStepData;
  preferences: PreferencesStepData;
  notifications: NotificationRow[];
  contacts: ContactEntry[];
}

const STEPS = [
  { number: 1, label: 'Profile' },
  { number: 2, label: 'Preferences' },
  { number: 3, label: 'Notifications' },
  { number: 4, label: 'Contact' },
];

const DEFAULT_DATA: ProfileFormData = {
  profile: {
    gdcNo: '1077780',
    mobileNo: '87654345671',
    emailId: 'test.email@mylabconnect.com',
    avatarUrl: null,
    signatureUrl: null,
  },
  preferences: {
    general: {
      metalOfChoice: 'Base',
      metalCollars: 'Lingual',
      occlusionContacts: 'In Light Occlusion',
      anatomy: 'Primary',
      insufficientRoom: 'Reduction Coping',
      interproximalContact: 'Broad/Tight',
      tissueShade: 'Dark Pink',
      material: 'Gold Hue',
      occlusalStain: 'Light',
      shadeGuide: 'VITA_CLASSICAL',
    },
    implant: {
      scanbodySystem: 'System A',
      implantLevel: 'Bone Level',
      tighteningTorque: '25 Ncm',
    },
  },
  notifications: [
    { event: 'Case Shipped', email: true, text: true, push: true },
    { event: 'Case on Hold', email: true, text: true, push: true },
    { event: 'Messaging Module', email: true, text: true, push: true },
    { event: 'Scan Validation', email: true, text: true, push: true },
    { event: 'Ticket Status Update', email: true, text: true, push: true },
  ],
  contacts: [
    { email: 'test.email@mylabconnect.com', mobile: '98980898982' },
    { email: '', mobile: '' },
    { email: '', mobile: '' },
    { email: '', mobile: '' },
  ],
};

const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Your Profile', subtitle: 'Photo, signature & contact details' },
  2: { title: 'Clinical Preferences', subtitle: 'Set your default lab preferences' },
  3: { title: 'Notifications', subtitle: 'Choose your notification channels' },
  4: { title: 'Contact Points', subtitle: 'Additional emails & mobile numbers' },
};

const ProfileModal: React.FC<ProfileModalProps> = ({ show, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileFormData>(DEFAULT_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave?.(formData);
    setIsSaving(false);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const stepInfo = STEP_TITLES[currentStep];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      className="profile-modal"
      scrollable
    >
      {/* Custom Header */}
      <div className="pm-header">
        <div className="pm-header-top">
          <div className="pm-header-brand">
            <div className="pm-brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h4 className="pm-title">{stepInfo.title}</h4>
              <p className="pm-subtitle">{stepInfo.subtitle}</p>
            </div>
          </div>
          <button className="pm-close-btn" onClick={handleClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2l12 12M14 2L2 14"/>
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="pm-stepper">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Body */}
      <Modal.Body className="pm-body">
        {currentStep === 1 && (
          <ProfileStep
            data={formData.profile}
            onChange={(profile) => setFormData((d) => ({ ...d, profile }))}
          />
        )}
        {currentStep === 2 && (
          <PreferencesStep
            data={formData.preferences}
            onChange={(preferences) => setFormData((d) => ({ ...d, preferences }))}
          />
        )}
        {currentStep === 3 && (
          <NotificationsStep
            rows={formData.notifications}
            onChange={(notifications) => setFormData((d) => ({ ...d, notifications }))}
          />
        )}
        {currentStep === 4 && (
          <ContactStep
            entries={formData.contacts}
            onChange={(contacts) => setFormData((d) => ({ ...d, contacts }))}
          />
        )}
      </Modal.Body>

      {/* Footer */}
      <div className="pm-footer">
        <div className="pm-footer-left">
          <span className="pm-step-chip">Step {currentStep} of {STEPS.length}</span>
        </div>
        <div className="pm-footer-right">
          <Button
            variant="outline-secondary"
            className="pm-btn-back"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </Button>

          {currentStep < 4 ? (
            <Button className="pm-btn-next" onClick={handleNext}>
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Button>
          ) : (
            <Button className="pm-btn-save" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="pm-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save Profile
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;