import React from "react";
import { Button } from "react-bootstrap";

interface KiduSubmitProps {
  isSubmitting?: boolean;
  loadingState?: boolean;
  submitButtonText?: string;
  themeColor?: string;
  disabled?: boolean;
}

const KiduSubmit: React.FC<KiduSubmitProps> = ({
  isSubmitting = false,
  loadingState = false,
  submitButtonText = "Submit",
  themeColor = "#173a6a",
  disabled = false,
}) => {
  const isDisabled = isSubmitting || loadingState || disabled;

  return (
    <Button
      type="submit"
      style={{ backgroundColor: themeColor, border: "none" }}
      disabled={isDisabled}
    >
      {isSubmitting || loadingState ? "Submitting..." : submitButtonText}
    </Button>
  );
};

export default KiduSubmit;