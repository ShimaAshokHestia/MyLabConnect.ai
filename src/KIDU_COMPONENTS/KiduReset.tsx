import React from "react";
import { Button } from "react-bootstrap";

interface Props {
  initialValues: any;
  setFormData: (data: any) => void;
  setErrors?: (errors: any) => void;
  dropdownRefs?: React.MutableRefObject<{ [key: string]: () => void }>; // For dropdown reset functions
  popupRefs?: React.MutableRefObject<{ [key: string]: () => void }>; // For popup reset functions
}

const KiduReset: React.FC<Props> = ({ 
  initialValues, 
  setFormData, 
  setErrors,
  dropdownRefs,
  popupRefs 
}) => {
  const handleReset = () => {
    // Reset form data
    setFormData(initialValues);
    
    // Reset validation errors
    if (setErrors) setErrors({});
    
    // Reset all dropdowns
    if (dropdownRefs?.current) {
      Object.values(dropdownRefs.current).forEach(resetFn => resetFn());
    }
    
    // Reset all popups
    if (popupRefs?.current) {
      Object.values(popupRefs.current).forEach(resetFn => resetFn());
    }
  };

  return (
    <Button variant="outline-warning" onClick={handleReset}>
      Reset
    </Button>
  );
};

export default KiduReset;