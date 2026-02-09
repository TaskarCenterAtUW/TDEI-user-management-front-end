import React, { useState } from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import { Button, Form, Spinner } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Container from "../../components/Container/Container";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DatePicker from "../../components/DatePicker/DatePicker";
import "./ReferralForm.module.css";
import dayjs from "dayjs";
import { referralValidationSchema } from "./CreateUpdateReferralCode.validation";
import styles from "./ReferralForm.module.css";
import { getReferralCodes } from "../../services";
import useGetReferralCodeDetails from "../../hooks/referrals/useGetReferralCodeDetails";
import useUpdateReferralCode from "../../hooks/referrals/useUpdateReferralCode";
import useCreateReferral from "../../hooks/referrals/useCreateReferral";
import CustomModal from "../../components/SuccessModal/CustomModal";
import useGetProjectGroupById from "../../hooks/projectGroup/useGetProjectGroupById";
import { APP_LINK_URL } from "../../utils/constant";
import { generateCandidateCode } from "../../utils/helper";
import copyIcon from "../../assets/img/icon-copy-id.svg";

const WORKSPACE_URL =
  process.env.REACT_APP_TDEI_WORKSPACE_URL ||
  "";

const toIsoOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

// API -> form values
const apiItemToForm = (item) => {
  const apiRedirect = (item?.redirect_url ?? "").trim();
  const isWorkspace =
    (!!apiRedirect && /^https?:\/\/workspaces/i.test(apiRedirect)) ||
    (!!WORKSPACE_URL && apiRedirect === WORKSPACE_URL);
  const isAviv = !!apiRedirect && apiRedirect.startsWith(APP_LINK_URL);

  return {
    name: item?.name ?? "",
    type: item?.type === 1 ? "campaign" : "invite",
    instructionsUrl: item?.instructions_url || "",
    validFrom: item?.valid_from || "",
    validTo: item?.valid_to || "",
    shortCode: item?.code || "",
    redirectUrlOption: apiRedirect
      ? (isWorkspace ? "workspace" : (isAviv ? "aviv" : "custom"))
      : "aviv",
    redirectUrl: (!isWorkspace && !isAviv) ? apiRedirect : "",
  };
};

// STATE/Mock -> form values
const stateItemToForm = (r) => {
  const raw = (r?.redirectUrl ?? r?.redirect_url ?? "").trim();
  const isWorkspace =
    (!!raw && /^https?:\/\/workspaces/i.test(raw)) ||
    (!!WORKSPACE_URL && raw === WORKSPACE_URL);
  const isAviv = !!raw && raw.startsWith(APP_LINK_URL);

  return {
    name: r?.name || "",
    type: r?.type || "campaign",
    instructionsUrl: r?.instructionsUrl || "",
    validFrom: r?.validFrom ? toIsoOrNull(r.validFrom) : "",
    validTo: r?.validTo ? toIsoOrNull(r.validTo) : "",
    shortCode: r?.shortCode || "",
    redirectUrlOption: raw ? (isWorkspace ? "workspace" : (isAviv ? "aviv" : "custom")) : "aviv",
    redirectUrl: (isWorkspace || isAviv) ? "" : raw,
  };
};

const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

// UI -> API payload
const uiToApi = (values, codeId, finalCode) => {

  let redirect_url;
  if (values.redirectUrlOption === "workspace") {
    // Send workspace URL from env
    redirect_url = WORKSPACE_URL || undefined;
  } else if (values.redirectUrlOption === "custom") {
    const custom = (values.redirectUrl || "").trim();
    redirect_url = custom ? custom : undefined;
  } else if (values.redirectUrlOption === "aviv") {
    redirect_url = APP_LINK_URL;
  } else {
    redirect_url = undefined;
  }

  return compact({
    id: codeId || undefined,
    name: values.name,
    type: values.type === "campaign" ? 1 : 2,
    valid_from: values.validFrom || null,
    code: finalCode || values.shortCode, // Use passed finalCode for creation
    valid_to: values.validTo || null,
    instructions_url: values.instructionsUrl || null,
    description: null,
    redirect_url,
  });
};

const CreateUpdateReferralCode = () => {
  const { id: projectGroupId, codeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { projectGroup, loading: pgLoading } = useGetProjectGroupById(projectGroupId);
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
  const groupName = pgLoading ? "…" : (projectGroup?.project_group_name || "—");
  const headerSubtitle = editing
    ? (
      <>
        You’re editing a referral code in project group — <span className="fw-bold">{groupName}</span>.
      </>
    )
    : (
      <>
        You’re creating a referral code in project group — <span className="fw-bold">{groupName}</span>.
      </>
    );

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
        redirectUrl: "",
        redirectUrlOption: "aviv",
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
        if (!projectGroupId || !codeId) {
          throw new Error("Missing projectGroupId or Code.");
        }
        const resp = await getReferralCodes({
          projectGroupId,
          page: 1,
          name: nameFromQuery,
          pageSize: 1,
          codeId,
        });
        const apiResponse = resp?.data;
        const first = apiResponse?.data?.[0] || null;
        if (!first) throw new Error("Referral not found.");
        if (!ignore) setFormInit(apiItemToForm(first));
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
  const { mutateAsync: checkCode } = useGetReferralCodeDetails(); // Check availability
  const typeDescriptions = {
    campaign: "Use for marketing campaigns and promotional activities with specific goals",
    invite: "Use for personal invitations and direct referrals to individual users"
  };

  // Modal State
  const [modal, setModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
    content: null,
    onHide: () => { },
    handler: () => { }
  });
  const [copied, setCopied] = useState(false);

  const hideModal = () => setModal(prev => ({ ...prev, show: false }));

  const headerTitle = editing ? "Edit Referral Code" : "Create Referral Code";
  const primaryButtonText = editing ? "Update" : "Create";

  const handleCancel = () => navigate(-1);

  // Generation Loading State
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsGenerating(true);
    try {
      const normalized = {
        ...values,
        validFrom: toIsoOrNull(values.validFrom),
        validTo: toIsoOrNull(values.validTo),
      };

      let finalCode = values.shortCode;

      // Only generate if creating
      if (!editing) {
        let attempts = 0;
        const MAX_ATTEMPTS = 5;
        let unique = false;

        while (attempts < MAX_ATTEMPTS && !unique) {
          const candidate = generateCandidateCode(
            groupName,
            values.name,
            values.type,
            values.redirectUrlOption
          );

          try {
            // checkCode success (200 OK) means code EXISTS -> Collision
            await checkCode(candidate);
            console.log(`Collision detected for ${candidate}. Retrying...`);
            attempts++;
          } catch (err) {
            // checkCode failure (e.g. 404) means code DOES NOT EXIST -> Unique
            finalCode = candidate;
            unique = true;
          }
        }

        if (!unique) {
          throw new Error("We couldn't generate a unique code for this name after multiple attempts. Please try modifying the referral name and try again.");
        }
      }

      const payload = uiToApi(normalized, codeId, finalCode);

      if (editing) {
        await updateReferral({ projectGroupId, code_id: codeId, data: payload });
        setModal({
          show: true,
          type: "success",
          title: "Success",
          message: "Referral updated successfully.",
          btnlabel: "OK",
          handler: () => {
            navigate(`/${projectGroupId}/referralCodes`);
          },
          onHide: () => {
            navigate(`/${projectGroupId}/referralCodes`);
          }
        });
      } else {
        await createReferral({ projectGroupId, data: payload });

        // Success Modal for creation with Copy feature
        setModal({
          show: true,
          type: "success",
          title: "Success",
          message: "Referral code created successfully.",
          content: (
            <div className="d-flex align-items-center justify-content-center">
              <span className="me-2">Your referral code is:</span>
              <div className="d-inline-flex align-items-center p-1 border rounded bg-light">
                <span className={styles.referralContent}>{finalCode}</span>
                <CopyToClipboard text={finalCode} onCopy={() => setCopied(true)}>
                  <Button variant="link" className="d-flex p-0 ms-2">
                    <img src={copyIcon} className={styles.copyIcon} alt="Copy Id" />
                  </Button>
                </CopyToClipboard>
              </div>
            </div>
          ),
          btnlabel: "OK",
          handler: () => {
            navigate(`/${projectGroupId}/referralCodes`);
          },
          onHide: () => {
            navigate(`/${projectGroupId}/referralCodes`);
          }
        });
        setCopied(false);
      }

    } catch (err) {
      let msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        err?.message ||
        (editing ? "Failed to update referral." : "Failed to create referral.");

      // If the API says "Code already exists" (collision on create) OR our loop threw the exhaustion error
      const isCollisionError =
        (typeof msg === 'string' && msg.toLowerCase().includes("code already exists")) ||
        (err.message && err.message.includes("We couldn't generate a unique code"));

      if (isCollisionError) {
        msg = "We couldn't generate a unique code for this name after multiple attempts. Please try modifying the referral name and try again.";
      }
      setModal({
        show: true,
        type: "error",
        title: "Error",
        message: msg,
        btnlabel: "Close",
        handler: hideModal,
        onHide: hideModal
      });
    } finally {
      setSubmitting(false);
      setIsGenerating(false);
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
          redirectUrlOption: formInit.redirectUrlOption ?? "",
          redirectUrl: formInit.redirectUrl ?? "",
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
          const submitting = isSubmitting || isCreating || isUpdating || isGenerating;

          return (
            <FormikForm noValidate>
              <div style={{ padding: "20px" }}>
                <div className={styles.actionBar}>
                  <div>
                    <h2 className="page-header-title">{headerTitle}</h2>
                    <div className={`page-header-subtitle ${styles.actionBarSubtitle}`}>
                      {headerSubtitle}
                    </div>
                  </div>
                  <div className={styles.actionButtons}>
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
                          <Spinner size="sm" className="me-2" />
                          {isGenerating ? "Generating Referral Code..." : "Saving..."}
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
                            <Form.Label>Type  <span style={{ color: "red" }}>*</span></Form.Label>
                            <Form.Select
                              name="type"
                              value={values.type}
                              onChange={(e) => {
                                const next = e.target.value;
                                setFieldValue("type", next);
                                if (next === "campaign") {
                                  setFieldValue("validTo", null, false);
                                }
                              }}
                              onBlur={handleBlur}
                            >
                              <option value="campaign">Campaign</option>
                              <option value="invite">Invite</option>
                            </Form.Select>
                            <div className="form-text mt-1">
                              {typeDescriptions[values.type]}
                            </div>
                          </Form.Group>
                          <div className="row">
                            <div className="col-12 col-md-6">
                              <Form.Label>Valid From  <span style={{ color: "red" }}>*</span></Form.Label>
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
                            {values.type !== "campaign" && (
                              <div className="col-12 col-md-6 mt-3 mt-md-0">
                                <Form.Label>Valid To  <span style={{ color: "red" }}>*</span></Form.Label>
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
                            )}
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
                          <Form.Group className="mb-3 mt-4" controlId="redirectUrlOption">
                            <Form.Label>Post-Signup Redirection</Form.Label>
                            {!!WORKSPACE_URL && (
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="redirectUrlOption"
                                  id="redirect-workspace"
                                  value="workspace"
                                  checked={values.redirectUrlOption === "workspace"}
                                  onChange={() => {
                                    setFieldValue("redirectUrlOption", "workspace");
                                    setFieldValue("redirectUrl", "", false);
                                  }}
                                />
                                <label className="form-check-label" htmlFor="redirect-workspace">
                                  Workspaces
                                  <div className="text-muted small">
                                    Redirects users to the main workspace dashboard after signup
                                  </div>
                                </label>
                              </div>
                            )}
                            <div className="form-check mt-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="redirectUrlOption"
                                id="redirect-custom"
                                value="custom"
                                checked={values.redirectUrlOption === "custom"}
                                onChange={() => setFieldValue("redirectUrlOption", "custom")}
                              />
                              <label className="form-check-label" htmlFor="redirect-custom">
                                Custom URL
                                <div className="text-muted small">Specify your own custom redirection URL</div>
                              </label>
                            </div>
                            <div className="form-check mt-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="redirectUrlOption"
                                id="redirect-aviv"
                                value="aviv"
                                checked={values.redirectUrlOption === "aviv"}
                                onChange={() => {
                                  setFieldValue("redirectUrlOption", "aviv");
                                  setFieldValue("redirectUrl", "", false);
                                }}
                              />
                              <label className="form-check-label" htmlFor="redirect-aviv">
                                Aviv Scoute Route app
                                <div className="text-muted small">
                                  Redirect to Aviv Scoute Route Mobile app
                                </div>
                              </label>
                            </div>
                          </Form.Group>

                          {values.redirectUrlOption === "custom" && (
                            <Form.Group className="mt-3 mb-3" controlId="redirectUrl">
                              <Form.Label>Custom Redirection URL</Form.Label>
                              <Form.Control
                                type="url"
                                name="redirectUrl"
                                placeholder="https://example.com/redirect"
                                value={values.redirectUrl}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.redirectUrl && !!errors.redirectUrl}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.redirectUrl}
                              </Form.Control.Feedback>
                            </Form.Group>
                          )}

                          {editing && (
                            <div className="mt-4 p-3 bg-light rounded">
                              <label className="form-label d-block mb-1">Referral Code</label>
                              <div className="d-flex align-items-center" style={{ minHeight: "24px" }}>
                                <code>{values.shortCode}</code>
                              </div>
                            </div>
                          )}

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
      {/* Custom Modal */}
      <CustomModal
        show={modal.show}
        modaltype={modal.type}
        title={modal.title}
        message={modal.message}
        content={modal.content}
        btnlabel={modal.btnlabel}
        handler={modal.handler}
        onHide={modal.onHide}
      />
    </>
  );
};

export default CreateUpdateReferralCode;
