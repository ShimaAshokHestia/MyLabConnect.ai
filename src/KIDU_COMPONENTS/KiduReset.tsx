import React from "react";
import { Button } from "react-bootstrap";

interface Props {
  initialValues: any;
  setFormData: (data: any) => void;
  setErrors?: (errors: any) => void;
}

const KiduReset: React.FC<Props> = ({ initialValues, setFormData, setErrors }) => {
  const handleReset = () => {
    setFormData(initialValues);
    if (setErrors) setErrors({}); // Reset validation errors if provided
  };

  return (
    <Button variant="outline-warning" onClick={handleReset}>
      Reset
    </Button>
  );
};

export default KiduReset;
