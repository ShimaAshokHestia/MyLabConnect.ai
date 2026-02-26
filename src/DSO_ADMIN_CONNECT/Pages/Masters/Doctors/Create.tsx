import React from "react";
import KiduDsoDoctorCreateModal from "../../../../KIDU_COMPONENTS/KiduDsoDoctorCreateModal";
import DSODoctorService from "../../../Services/Masters/DsoDoctor.services";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  practiceOptions?: { value: string; label: string }[];
}

// ── Component ─────────────────────────────────────────────────────────────────
const DSODoctorCreateModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
  practiceOptions = [],
}) => {

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (formData: {
    doctorCode: string;
    userId: string;
    firstName: string;
    lastName: string;
    gdcNo: string;
    email: string;
    isActive: boolean;
    practices: { practiceId: string }[];
  }) => {
    await DSODoctorService.create({
      doctorCode: formData.doctorCode,
      userId:     formData.userId,
      firstName:  formData.firstName,
      lastName:   formData.lastName,
      fullName:   `${formData.firstName} ${formData.lastName}`,
      gdcNo:      formData.gdcNo,
      email:      formData.email,
      isActive:   formData.isActive ?? true,
      isDeleted:  false,
      practices:  formData.practices,
    });
  };

  return (
    <KiduDsoDoctorCreateModal
      show={show}
      onHide={onHide}
      onSuccess={onSuccess}
      practiceOptions={practiceOptions}
      onSubmit={handleSubmit}
    />
  );
};

export default DSODoctorCreateModal;
