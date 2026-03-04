/* eslint-disable react-refresh/only-export-components */
import React from "react";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  label?: string;
}

export interface ValidationRule {
  type?: "text" | "number" | "email" | "url" | "textarea" | "popup" | "password" | "select" | "dropDown" | "image" | "date" | "radio" | "toggle" | "checkbox";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  label?: string;
}

export const KiduValidation = {
  validate(value: unknown, rules: ValidationRule): ValidationResult {
    const rawLabel = rules.label || "This field";
    const label = rules.required ? `${rawLabel} <span style="color:#EF4444;">*</span>` : rawLabel;
    const val = value;

    if (rules.type === "dropDown") {
      const arr = Array.isArray(val) ? val : [];
      if (rules.required && arr.filter(v => v.trim() !== "").length === 0)
        return { isValid: false, message: `${rawLabel} is required`, label };
      if (rules.minLength && arr.length < rules.minLength)
        return { isValid: false, message: `${rawLabel} must have at least ${rules.minLength} locations`, label };
      if (rules.maxLength && arr.length > rules.maxLength)
        return { isValid: false, message: `${rawLabel} can have at most ${rules.maxLength} locations`, label };
      return { isValid: true, label };
    }

    if (rules.type === "image") {
      const file = val as File | null;
      if (rules.required && !file)
        return { isValid: false, message: `${rawLabel} is required`, label };
      if (file) {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(file.type))
          return { isValid: false, message: `${rawLabel} must be a valid image (JPG, PNG, WEBP)`, label };
        const max = 5;
        if (file.size > max * 1024 * 1024)
          return { isValid: false, message: `${rawLabel} must be less than ${max}MB`, label };
      }
      return { isValid: true, label };
    }

    if (rules.type === "select") {
      if (rules.required && (!val || String(val).trim() === ""))
        return { isValid: false, message: `${rawLabel} is required`, label };
      return { isValid: true, label };
    }

    if (rules.type === "radio") {
      if (rules.required && (!val || String(val).trim() === ""))
        return { isValid: false, message: `${rawLabel} is required`, label };
      return { isValid: true, label };
    }

    if (rules.type === "toggle" || rules.type === "checkbox") {
      if (rules.required && !val)
        return { isValid: false, message: `${rawLabel} is required`, label };
      return { isValid: true, label };
    }

    if (rules.type === "date") {
      const str = String(val ?? "").trim();
      if (rules.required && !str)
        return { isValid: false, message: `${rawLabel} is required`, label };
      if (str) {
        const d = new Date(str);
        if (isNaN(d.getTime()))
          return { isValid: false, message: `${rawLabel} must be a valid date`, label };
      }
      return { isValid: true, label };
    }

    const strVal = String(val ?? "").trim();

    if (rules.required && !strVal)
      return { isValid: false, message: `${rawLabel} is required`, label };

    if (rules.type === "number" && strVal && isNaN(Number(strVal)))
      return { isValid: false, message: `${rawLabel} must be a number`, label };

    if (rules.type === "email" && strVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal))
      return { isValid: false, message: `Please enter a valid email address`, label };

    if (rules.type === "url" && strVal && !/^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/.test(strVal))
      return { isValid: false, message: `Please enter a valid website URL`, label };

    if (rules.type === "password" && strVal) {
      // if (strVal.length < 8)
      //   return { isValid: false, message: `${rawLabel} must be at least 8 characters`, label };
      // if (!/[A-Z]/.test(strVal))
      //   return { isValid: false, message: `${rawLabel} must contain an uppercase letter`, label };
      // if (!/[a-z]/.test(strVal))
      //   return { isValid: false, message: `${rawLabel} must contain a lowercase letter`, label };
      // if (!/[0-9]/.test(strVal))
      //   return { isValid: false, message: `${rawLabel} must contain a number`, label };
      // if (!/[!@#$%^&*(),.?":{}|<>]/.test(strVal))
      //   return { isValid: false, message: `${rawLabel} must contain a special character`, label };
    }

    if (rules.minLength && strVal.length < rules.minLength)
      return { isValid: false, message: `${rawLabel} must be at least ${rules.minLength} characters`, label };

    if (rules.maxLength && strVal.length > rules.maxLength)
      return { isValid: false, message: `${rawLabel} must be less than ${rules.maxLength} characters`, label };

    if (rules.pattern && strVal && !rules.pattern.test(strVal))
      return { isValid: false, message: `Invalid ${rawLabel.toLowerCase()}`, label };

    return { isValid: true, label };
  }
};

// ── ValidationMessage ─────────────────────────────────────────────────────────
export const ValidationMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{ fontSize: "0.8rem", color: "#EF4444", marginTop: "4px", fontFamily: "Urbanist" }}>
      {message}
    </div>
  );
};

// ── CharacterCounter ──────────────────────────────────────────────────────────
// Renders a "{current}/{max}" counter aligned to the right of a field label.
// Only renders when maxLength is provided AND the field type supports counting.
// Usage:
//   <KiduCharacterCounter value={formData[name]} maxLength={rules.maxLength} type={rules.type} />
//
export interface CharacterCounterProps {
  value: string;
  maxLength?: number;
  type?: string;
}

// Field types that should show the character counter
const COUNTER_SUPPORTED_TYPES = ["text", "textarea", "url"];

export const KiduCharacterCounter: React.FC<CharacterCounterProps> = ({
  value,
  maxLength,
  type,
}) => {
  if (!maxLength || !type || !COUNTER_SUPPORTED_TYPES.includes(type)) return null;

  const current = value?.length ?? 0;
  const isAtLimit = current >= maxLength;

  return (
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 500,
        color: isAtLimit ? "#ef4444" : "#9ca3af",
        fontFamily: "Urbanist, sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {current}/{maxLength}
    </span>
  );
};

export default KiduValidation;