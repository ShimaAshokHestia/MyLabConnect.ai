// src/Hooks/useApiErrorHandler.ts
//
// ─── useApiErrorHandler ───────────────────────────────────────────────────────
// Centralised error handler for create/edit modal submit handlers.
//
// Covers three failure scenarios:
//   1. Session errors    (missing token claims, auth context problems)
//   2. Network errors    (fetch threw — server down, timeout, CORS)
//   3. API failures      (server returned { isSucess: false, customMessage })
//
// Usage inside any modal's handleSubmit:
//
//   const { handleApiError, assertApiSuccess } = useApiErrorHandler();
//
//   // Wrap network calls:
//   let result: any;
//   try {
//     result = await MyService.create(payload);
//   } catch (err) {
//     handleApiError(err, "network");   // shows toast + Swal, then re-throws
//   }
//
//   // Assert the response was successful:
//   assertApiSuccess(result, "Failed to create record");  // shows toast + Swal, then re-throws
//
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// ── Config ────────────────────────────────────────────────────────────────────
const THEME_COLOR = "#ef0d50";
const TOAST_DURATION_MS = 5000;

// ── Error types ───────────────────────────────────────────────────────────────
export type ApiErrorType = "session" | "network" | "api";

// ── Hook return type ──────────────────────────────────────────────────────────
export interface ApiErrorHandler {
  /**
   * Shows toast + Swal for the given error and re-throws so the modal's
   * isSubmitting state resets. Pass the raw caught error or a message string.
   *
   * @param err       - The caught error or a plain message string
   * @param errorType - "session" | "network" | "api"
   * @param fallback  - Fallback message if err has no readable message
   */
  handleApiError: (
    err: unknown,
    errorType: ApiErrorType,
    fallback?: string
  ) => Promise<never>;

  /**
   * Checks a CustomApiResponse and throws if isSucess is false.
   * Displays toast + Swal with the backend's error message.
   *
   * @param result       - The API response object (or null/undefined)
   * @param fallbackMsg  - Shown if result has no customMessage or error
   */
  assertApiSuccess: (result: any, fallbackMsg?: string) => Promise<void>;
}

// ── Titles per error type ─────────────────────────────────────────────────────
const TITLES: Record<ApiErrorType, string> = {
  session: "Session Error",
  network: "Connection Error",
  api:     "Request Failed",
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useApiErrorHandler(): ApiErrorHandler {

  const handleApiError = useCallback(async (
    err: unknown,
    errorType: ApiErrorType,
    fallback = "An unexpected error occurred. Please try again."
  ): Promise<never> => {
    // Extract a human-readable message
    const msg =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : fallback;

    // Toast for instant feedback (stays visible while Swal is open)
    toast.error(msg, { duration: TOAST_DURATION_MS });

    // Swal for prominent display
    await Swal.fire({
      icon:               "error",
      title:              TITLES[errorType],
      text:               msg,
      confirmButtonColor: THEME_COLOR,
      confirmButtonText:  "OK",
    });

    // Re-throw so the calling modal resets its isSubmitting / loading state
    throw new Error(msg);
  }, []);


  const assertApiSuccess = useCallback(async (
    result: any,
    fallbackMsg = "Operation failed. Please try again."
  ): Promise<void> => {
    // Treat null / undefined response as a failure
    if (!result) {
      await handleApiError(
        new Error("No response received from server."),
        "network",
        fallbackMsg
      );
    }

    if (!result.isSucess) {
      const msg = result.customMessage || result.error || fallbackMsg;
      await handleApiError(new Error(msg), "api", fallbackMsg);
    }
  }, [handleApiError]);

  return { handleApiError, assertApiSuccess };
}