import React from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import { Button, Form, Spinner } from "react-bootstrap";
import Container from "../../components/Container/Container";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DatePicker from "../../components/DatePicker/DatePicker";
import "./ReferralForm.module.css";
import dayjs from "dayjs";
import { referralValidationSchema } from "./CreateUpdateReferralCode.validation";
import styles from "./ReferralForm.module.css";
import ShortCodePreview from "../../components/Referral/ShortCodePreview";
import { getReferralCodes } from "../../services";
import useUpdateReferralCode from "../../hooks/referrals/useUpdateReferralCode";
import useCreateReferral from "../../hooks/referrals/useCreateReferral";
import ResponseToast from "../../components/ToastMessage/ResponseToast";

const USE_MOCK = true;

const MOCK_ROWS = [
  {
    id: "1",
    name: "Summer Campaign 2024",
    type: "campaign",
    shortCode: "SUMM2424ABC",
    instructionsUrl: "https://wearemotto.com/",
    validFrom: "2024-06-01",
    validTo: "2024-08-31",
  },
  {
    id: "2",
    name: "Friend Invite",
    type: "invite",
    shortCode: "FRIE2424XYZ",
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
  },
];

const toIsoOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

// API -> form values
const apiItemToForm = (item) => ({
  name: item?.name ?? "",
  type: item?.type === 1 ? "campaign" : "invite",
  instructionsUrl: item?.instructions_url || "",
  validFrom: item?.valid_from || "",
  validTo: item?.valid_to || "",
  shortCode: item?.code || "",
});

// STATE/Mock -> form values
const stateItemToForm = (r) => ({
  name: r?.name || "",
  type: r?.type || "campaign",
  instructionsUrl: r?.instructionsUrl || "",
  validFrom: r?.validFrom ? toIsoOrNull(r.validFrom) : "",
  validTo: r?.validTo ? toIsoOrNull(r.validTo) : "",
  shortCode: r?.shortCode || "",
});

// UI -> API payload
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
  const [searchParams, setSearchParams] = useSearchParams();

  const editing = Boolean(codeId);
  const referralFromState = location.state?.referral || null;
  
  // This ensures that if user refreshes the page, we still have the name in query for prefill logic.
  React.useEffect(() => {
    if (editing && referralFromState?.name && !searchParams.get("name")) {
      const params = new URLSearchParams(searchParams);
      params.set("name", referralFromState.name);
      setSearchParams(params, { replace: true });
    }
  }, [editing, referralFromState, searchParams, setSearchParams]);

  const nameFromQuery = searchParams.get("name") || undefined;

  // Prefill loader state
  const [initLoading, setInitLoading] = React.useState(editing && !referralFromState);
  const [initError, setInitError] = React.useState("");
  const [formInit, setFormInit] = React.useState(() =>
    referralFromState
      ? stateItemToForm(referralFromState)
      : {
          name: "",
          type: "campaign",
          instructionsUrl: "",
          validFrom: "",
          validTo: "",
          shortCode: "",
        }
  );

  // Prefill on edit: by projectGroupId + name 
  React.useEffect(() => {
    let ignore = false;

    const prefill = async () => {
      if (!editing) return;
      if (referralFromState) return;

      setInitLoading(true);
      setInitError("");
      try {
        if (USE_MOCK) {
          const match =
            (nameFromQuery &&
              MOCK_ROWS.find(
                (r) => r.name.toLowerCase() === nameFromQuery.toLowerCase()
              )) ||
            null;

          if (!ignore) {
            if (!match) throw new Error("Referral not found.");
            setFormInit(stateItemToForm(match));
          }
        } else {
          if (!projectGroupId || !nameFromQuery) {
            throw new Error("Missing projectGroupId or name.");
          }
          const resp = await getReferralCodes({
            projectGroupId,
            page: 1,
            name: nameFromQuery,
            pageSize: 1,
          });
          const apiResponse = resp?.data;
          const first = apiResponse?.data?.[0] || null;
          if (!first) throw new Error("Referral not found.");
          if (!ignore) setFormInit(apiItemToForm(first));
        }
      } catch (e) {
        if (!ignore) setInitError(e?.message || "Failed to load referral.");
      } finally {
        if (!ignore) setInitLoading(false);
      }
    };

    prefill();
    return () => {
      ignore = true;
    };
  }, [editing, referralFromState, projectGroupId, nameFromQuery]);

  // Mutations
  const { mutateAsync: updateReferral, isLoading: isUpdating } = useUpdateReferralCode();
  const { mutateAsync: createReferral, isLoading: isCreating } = useCreateReferral();

  // Toast
  const [toast, setToast] = React.useState({
    show: false,
    type: "success",
    message: "",
    autoHideDuration: 3000,
  });
  const showToast = (type, message, autoHideDuration = 3000) =>
    setToast({ show: true, type, message, autoHideDuration });
  const handleToastClose = () => setToast((t) => ({ ...t, show: false }));

  const headerTitle = editing ? "Edit Referral Code" : "Create Referral Code";
  const primaryButtonText = editing ? "Update" : "Create";

  const handleCancel = () => navigate(-1);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const normalized = {
        ...values,
        validFrom: toIsoOrNull(values.validFrom),
        validTo: toIsoOrNull(values.validTo),
      };
      const payload = uiToApi(normalized, codeId);
      if (editing) {
        await updateReferral({ projectGroupId, code_id: codeId, data: payload });
        showToast("success", "Referral updated successfully.");
      } else {
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

  // Loading / error for prefill
  if (initLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: 240 }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    );
  }
  if (editing && initError) {
    return <div className="alert alert-danger">Prefill error: {initError}</div>;
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          name: formInit.name,
          type: formInit.type,
          validFrom: formInit.validFrom,
          validTo: formInit.validTo,
          instructionsUrl: formInit.instructionsUrl,
          shortCode: formInit.shortCode,
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
                    <Button type="submit" className="tdei-primary-button" disabled={submitting}>
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
                            <ShortCodePreview
                              isEdit={editing}
                              initialShortCode={formInit.shortCode || ""}
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
                              <div className="text-muted small mb-2">Preview of instructions URL:</div>
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
