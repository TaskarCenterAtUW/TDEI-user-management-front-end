import React from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import { Button, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "../../components/DatePicker/DatePicker";
import "./ReferralForm.module.css";
import dayjs from "dayjs";
import { referralValidationSchema } from "./CreateUpdateReferralCode.validation";
import styles from "./ReferralForm.module.css";
import ShortCodePreview from "../../components/Referral/ShortCodePreview";
import useUpdateReferralCode from "../../hooks/referrals/useUpdateReferralCode";
import useCreateReferral from "../../hooks/referrals/useCreateReferral";
import ResponseToast from "../../components/ToastMessage/ResponseToast";

const USE_MOCK = true;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const toIsoOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

// UI -> API payload mapper
const uiToApi = (values, codeId) => ({
  id: codeId || undefined,
  name: values.name,
  type: values.type === "campaign" ? 1 : 2,
  valid_from: values.validFrom || null,
  code: values.shortCode,
  valid_to: values.validTo || null,
  instructions_url: values.instructionsUrl || null,
  description: null,
});

const CreateUpdateReferralCode = () => {
  const { id: projectGroupId, codeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const referralFromState = location.state?.referral || null;

  const fallbackFromMock =
    !referralFromState && codeId
      ? {
        id: codeId,
        name: "",
        type: "campaign",
        shareLink: "",
        shortCode: "FALLBACKCODE",
        instructionsUrl: "",
        validFrom: "",
        validTo: "",
        createdAt: "",
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
    shortCode: "",
  };

  const headerTitle = editing ? "Edit Referral Code" : "Create Referral Code";
  const primaryButtonText = editing ? "Update" : "Create";
  const selectedCode = location.state?.referral?.shortCode || null;

  // mutations (only used when USE_MOCK === false)
  const { mutateAsync: updateReferral, isLoading: isUpdating } =
    useUpdateReferralCode();
  const {
    mutateAsync: createReferral,
    isLoading: isCreating,
  } = useCreateReferral({
    onSuccess: () => { },
    onError: () => { },
  });

  // toast
  const [toast, setToast] = React.useState({
    show: false,
    type: "success",
    message: "",
    autoHideDuration: 3000,
  });
  const showToast = (type, message, autoHideDuration = 3000) =>
    setToast({ show: true, type, message, autoHideDuration });
  const handleToastClose = () => setToast((t) => ({ ...t, show: false }));

  const handleCancel = () => navigate(-1);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const normalized = {
        ...values,
        validFrom: toIsoOrNull(values.validFrom),
        validTo: toIsoOrNull(values.validTo),
      };
      const payload = uiToApi(normalized, codeId);
      if (USE_MOCK) {
        await sleep(400);
        showToast(
          "success",
          editing ? "Referral updated successfully." : "Referral created successfully."
        );
        navigate(`/${projectGroupId}/referralCodes`);
        return;
      }

      if (editing) {
        // API update
        await updateReferral({
          projectGroupId,
          code_id: codeId,
          data: payload,
        });
        showToast("success", "Referral updated successfully.");
      } else {
        // API create
        await createReferral({ projectGroupId, data: payload });
        showToast("success", "Referral created successfully.");
      }

      navigate(`/${projectGroupId}/referralCodes`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (editing ? "Failed to update referral." : "Failed to create referral.");
      showToast("error", msg, 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          name: initial?.name || "",
          type: initial?.type || "campaign",
          validFrom: toIsoOrNull(initial?.validFrom) || "",
          validTo: toIsoOrNull(initial?.validTo) || "",
          instructionsUrl: initial?.instructionsUrl || "",
          shortCode: initial?.shortCode || "",
        }}
        validationSchema={referralValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue,
        }) => {
          const submitting = isSubmitting || isCreating || isUpdating;

          return (
            <FormikForm noValidate>
              {/* Header */}
              <div style={{ padding: "20px" }}>
                <div className="header">
                  <div className="page-header-title">{headerTitle}</div>
                  <div className="d-flex gap-2">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="tdei-secondary-button"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="tdei-primary-button"
                      disabled={submitting}
                    >
                      {submitting ? (
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
                                    maxDate={
                                      values.validTo
                                        ? dayjs(values.validTo)
                                        : undefined
                                    }
                                    onChange={(iso) =>
                                      form.setFieldValue("validFrom", iso)
                                    }
                                  />
                                )}
                              </Field>
                              {touched.validFrom && errors.validFrom ? (
                                <div className="text-danger small mt-1">
                                  {errors.validFrom}
                                </div>
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
                                    minDate={
                                      values.validFrom
                                        ? dayjs(values.validFrom)
                                        : undefined
                                    }
                                    onChange={(iso) =>
                                      form.setFieldValue("validTo", iso)
                                    }
                                  />
                                )}
                              </Field>
                              {touched.validTo && errors.validTo ? (
                                <div className="text-danger small mt-1">
                                  {errors.validTo}
                                </div>
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
                              isInvalid={
                                touched.instructionsUrl &&
                                !!errors.instructionsUrl
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.instructionsUrl}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <div className="mt-3">
                            <ShortCodePreview
                              isEdit={editing}
                              // was `selectedCode?.shortCode` (string), fixed:
                              initialShortCode={selectedCode || initial.shortCode || ""}
                              values={values}
                              setFieldValue={setFieldValue}
                            />
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
                                onClick={() =>
                                  window.open(values.instructionsUrl, "_blank")
                                }
                              >
                                Open in New Tab
                              </Button>
                            </>
                          ) : (
                            <div className="text-muted">
                              Add an Instructions URL to preview.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Container>
              </div>
            </FormikForm>
          );
        }}
      </Formik>

      {/* Toast */}
      <ResponseToast
        showtoast={toast.show}
        type={toast.type}
        message={toast.message}
        autoHideDuration={toast.autoHideDuration}
        handleClose={handleToastClose}
      />
    </>
  );
};

export default CreateUpdateReferralCode;
