import React from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import * as yup from "yup";
import { Button, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "../../components/DatePicker/DatePicker";
import "./ReferralForm.module.css";
import dayjs from "dayjs";
import { referralValidationSchema, buildReferralInitialValues } from "./CreateUpdateReferralCode.validation";
import styles from "./ReferralForm.module.css";

const toIsoOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
};
// Short code generator: NAME(4) + YY(from) + YY(to) + 3-char hash
function generateShortCode(name = "", validFromISO, validToISO) {
  const cleaned = (name || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // initials from first two words, then fill to length 4 with cleaned string
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  let prefix = "";
  if (words.length >= 2) {
    const initials = (words[0][0] || "") + (words[1][0] || "");
    prefix = (initials + cleaned.replace(initials, "")).slice(0, 4).toUpperCase();
  } else {
    prefix = cleaned.slice(0, 4).toUpperCase();
  }
  if (prefix.length < 4) prefix = (prefix + "XXXX").slice(0, 4);

  const fromYY = validFromISO ? new Date(validFromISO).getFullYear().toString().slice(-2) : "00";
  const toYY = validToISO ? new Date(validToISO).getFullYear().toString().slice(-2) : "00";

  // Stable 3-char hash from inputs (avoid random jitter)
  const hashInput = `${name}|${fromYY}|${toYY}`;
  let h = 0;
  for (let i = 0; i < hashInput.length; i++) h = (h * 31 + hashInput.charCodeAt(i)) | 0;
  const suffix = Math.abs(h).toString(36).toUpperCase().slice(0, 3).padEnd(3, "0");

  return `${prefix}${fromYY}${toYY}${suffix}`;
}


const CreateUpdateReferralCode = () => {
  const { id: projectGroupId, codeId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const referralFromState = state?.referral || null;

  const fallbackFromMock =
    !referralFromState && codeId
      ? {
        id: codeId,
        name: "Loaded from fallback",
        type: "campaign",
        shareLink: "https://app.example.com/join/FALLBACKCODE",
        shortCode: "FALLBACKCODE",
        instructionsUrl: "",
        validFrom: "2024-06-01",
        validTo: "2024-06-15",
        createdAt: "2024-06-01",
        isActive: true,
      }
      : null;

  const editing = Boolean(codeId);
  const initial = referralFromState || fallbackFromMock || {
    name: "",
    type: "campaign",
    instructionsUrl: "",
    validFrom: null,
    validTo: null,
  };

  const initialValues = {
    name: initial.name || "",
    type: initial.type || "campaign",
    instructionsUrl: initial.instructionsUrl || "",
    validFrom: toIsoOrNull(initial.validFrom),
    validTo: toIsoOrNull(initial.validTo),
  };
  const location = useLocation();
  const headerTitle = editing ? "Edit Referral Code" : "Create Referral Code";
  const primaryButtonText = editing ? "Update" : "Create";
  const isEdit = Boolean(codeId);
  const selectedCode = location.state?.referral
.shortCode || null;

  const handleCancel = () => navigate(-1);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        projectGroupId,
        ...(editing && { id: codeId }),
        ...values,
      };
      // TODO: call create/update API here
      // await api.saveReferralCode(payload)

      navigate(`/${projectGroupId}/referralCodes`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={buildReferralInitialValues(referralFromState)}
      validationSchema={referralValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => {
        const computedShort =
          isEdit
            ? (selectedCode || "")
            : generateShortCode(values.name, values.validFrom, values.validTo);
        return (
          <>
            <FormikForm noValidate>
              {/* Header */}
              <div style={{ padding: '20px' }} >
                <div className="header">
                  <div className="page-header-title">{headerTitle}</div>
                  <div className="d-flex gap-2">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="tdei-secondary-button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="tdei-primary-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="me-2" /> Saving…
                        </>
                      ) : (
                        primaryButtonText
                      )}
                    </Button>
                  </div>
                </div>

                <Container className="mt-2">
                  <div className="row g-3">
                    <div className="col-12 col-lg-8 d-flex">
                      <div className="card flex-grow-1">
                        <div className="card-header">
                          <strong>Referral Code Details</strong>
                        </div>
                        <div className="card-body">
                          <Form.Group className="mb-3" controlId="name">
                            <Form.Label>
                              Name <span style={{ color: "red" }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              placeholder="Enter code name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.name && !!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3" controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                              name="type"
                              value={values.type}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="campaign">Campaign</option>
                              <option value="invite">Invite</option>
                            </Form.Select>
                          </Form.Group>

                          <div className="row">
                            <div className="col-12 col-md-6">
                              <Form.Label>Valid From</Form.Label>
                              <Field name="validFrom">
                                {({ field, form }) => (
                                  <DatePicker
                                    field={field}
                                    form={form}
                                    label="Valid From"
                                    dateValue={values.validFrom}
                                    maxDate={values.validTo ? dayjs(values.validTo) : undefined}
                                    onChange={(iso) => form.setFieldValue("validFrom", iso)}
                                  />
                                )}
                              </Field>
                              {touched.validFrom && errors.validFrom ? (
                                <div className="text-danger small mt-1">{errors.validFrom}</div>
                              ) : null}
                            </div>

                            <div className="col-12 col-md-6 mt-3 mt-md-0">
                              <Form.Label>Valid To</Form.Label>
                              <Field name="validTo">
                                {({ field, form }) => (
                                  <DatePicker
                                    field={field}
                                    form={form}
                                    label="Valid To"
                                    dateValue={values.validTo}
                                    minDate={values.validFrom ? dayjs(values.validFrom) : undefined}
                                    onChange={(iso) => form.setFieldValue("validTo", iso)}

                                  />
                                )}
                              </Field>
                              {touched.validTo && errors.validTo ? (
                                <div className="text-danger small mt-1">{errors.validTo}</div>
                              ) : null}
                            </div>
                          </div>

                          <Form.Group className="mt-3" controlId="instructionsUrl">
                            <Form.Label>Instructions URL</Form.Label>
                            <Form.Control
                              type="url"
                              name="instructionsUrl"
                              placeholder="https://example.com/instructions"
                              value={values.instructionsUrl || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.instructionsUrl && !!errors.instructionsUrl}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.instructionsUrl}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <div className="mt-3">
                            <Form.Label>Short Code (Auto-generated)</Form.Label>
                            <div className="p-2 bg-light rounded border">
                              <code className="small">
                                {computedShort || "—"}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-4 d-flex">
                      <div className="card flex-grow-1">
                        <div className="card-header">
                          <strong>URL Preview</strong>
                        </div>
                        <div className="card-body">
                          {values.instructionsUrl ? (
                            <>
                              <div className="text-muted small mb-2">
                                Preview of instructions URL:
                              </div>
                              <div className="border rounded p-2 bg-light">
                                <iframe
                                  title="URL Preview"
                                  className={styles.previewIframe}
                                  src={values.instructionsUrl}

                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline-secondary"
                                className="w-100 mt-2"
                                onClick={() => window.open(values.instructionsUrl, "_blank")}
                              >
                                Open in New Tab
                              </Button>
                            </>
                          ) : (
                            <div className="text-muted">Add an Instructions URL to preview.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Container>
              </div>
            </FormikForm>
          </>);
      }}
    </Formik>);
}



export default CreateUpdateReferralCode;
