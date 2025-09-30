import * as yup from "yup";

/**
 * Yup schema that accepts ISO strings (or null/empty), transforms them to Date,
 * and validates that validTo ≥ validFrom. Prevents "Invalid Date" cast errors.
 */
export const referralValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),

  type: yup
    .mixed()
    .oneOf(["invite", "campaign"], "Invalid type")
    .required("Type is required"),

  validFrom: yup
    .date()
    .transform((val, orig) => (orig ? new Date(orig) : null))
    .typeError("Valid from date is required")
    .nullable()
    .required("Valid from date is required"),

  // If type === "campaign": ignore/hide and force null.
  // Otherwise: optional, but if provided must be >= validFrom.
  validTo: yup.lazy((value, ctx) => {
    const { type, validFrom } = ctx.parent;
    if (type === "campaign") {
      return yup.mixed().nullable().transform(() => null);
    }
    return yup
      .date()
      .transform((val, orig) => (orig ? new Date(orig) : null))
      .nullable()
      .required("Valid to date is required")
      .when("validFrom", (vf, schema) =>
        vf ? schema.min(vf, "Valid to date must be after valid from date") : schema
      );
  }),

  instructionsUrl: yup
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .url("Must be a valid URL")
    .notRequired(),
});

/**
 * Helper for Formik initialValues.
 * Keeps dates as ISO strings to play nicely with your MUI DatePicker wrapper.
 */
export const buildReferralInitialValues = (selected = null) => {
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const toISO = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  };

  return {
    name: selected?.name || "",
    type: selected?.type || "campaign",
    validFrom: toISO(selected?.validFrom) || now.toISOString(),
    validTo: toISO(selected?.validTo) || in7.toISOString(),
    instructionsUrl: selected?.instructionsUrl || "",
  };
};
