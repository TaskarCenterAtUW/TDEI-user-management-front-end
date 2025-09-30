import React, { useMemo, useEffect } from "react";
import { genShortCode } from "../../utils";

export default function ShortCodePreview({ isEdit, initialShortCode, values, setFieldValue }) {
  const code = useMemo(() => {
    if (isEdit && initialShortCode) return initialShortCode;
    return genShortCode(values.name, values.validFrom, values.validTo);
  }, [isEdit, initialShortCode, values.name, values.validFrom, values.validTo]);

  useEffect(() => {
    setFieldValue?.("shortCode", code, false);
  }, [code, setFieldValue]);

  return (
    <div className="p-3 bg-light rounded">
      <label className="form-label d-block mb-1">Referral Code</label>
      <code>{code || "Generated from name (dates optional)"}</code>
    </div>
  );
}