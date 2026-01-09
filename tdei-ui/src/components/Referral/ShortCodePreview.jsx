import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { genShortCode } from "../../utils/helper";
import useGetReferralCodeDetails from "../../hooks/referrals/useGetReferralCodeDetails";

// Preview component to show the generated short code based on name and dates
export default function ShortCodePreview({ isEdit, initialShortCode, values, setFieldValue }) {
  const [generatedCode, setGeneratedCode] = useState(initialShortCode || "");
  const [isChecking, setIsChecking] = useState(false);
  const { mutateAsync: checkCode } = useGetReferralCodeDetails();

  useEffect(() => {
    if (isEdit && initialShortCode) {
      setGeneratedCode(initialShortCode);
      return;
    }

    // debounced generation
    const timeoutId = setTimeout(async () => {
      if (!values.name) {
        setGeneratedCode("");
        setFieldValue?.("shortCode", "", false);
        return;
      }

      setIsChecking(true);

      // Generate candidate from helper
      // genShortCode uses name + validFrom + validTo
      const base = genShortCode(values.name, values.validFrom, values.validTo);
      let candidate = base;
      let counter = 1;

      // Loop to check uniqueness
      while (true) {
        try {
          // If this call succeeds, the code exists -> collision
          await checkCode(candidate);
          // Append counter and retry
          candidate = `${base}${counter}`;
          counter++;
        } catch (err) {
          // If this throws the code does NOT exist -> use it
          break;
        }
      }

      setGeneratedCode(candidate);
      setIsChecking(false);

      // Update parent form
      setFieldValue?.("shortCode", candidate, false);

    }, 800);

    return () => clearTimeout(timeoutId);
  }, [
    values.name,
    values.validFrom,
    values.validTo,
    isEdit,
    initialShortCode,
    checkCode,
    setFieldValue
  ]);

  return (
    <div className="p-3 bg-light rounded">
      <label className="form-label d-block mb-1">Referral Code</label>
      <div className="d-flex align-items-center" style={{ minHeight: "24px" }}>
        {isChecking ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" role="status" />
            <small className="text-muted">Checking availability...</small>
          </>
        ) : (
          <code>{generatedCode || "Generated from name..."}</code>
        )}
      </div>
    </div>
  );
}