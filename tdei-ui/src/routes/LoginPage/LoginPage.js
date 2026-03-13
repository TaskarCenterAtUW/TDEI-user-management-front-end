import React, { useState, useEffect } from "react";
import { Row, Form, Button, Card, InputGroup } from "react-bootstrap";
import { Link, Navigate, useLocation, useMatch, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import style from "./style.module.css";
import tempLogo from "./../../assets/img/tdei-logo.png";
import { useDispatch } from "react-redux";
import { show } from "../../store/notification.slice";
import { Formik } from "formik";
import * as yup from "yup";
import ForgotPassModal from "../../components/ForgotPassModal/ForgotPassModal";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSearchParams } from "react-router-dom";
import ReferralBanner from "../../components/Referral/ReferralBanner";
import { buildShareDatasetAuthPath, buildShareDatasetPath, DEFAULT_SHARE_REFERRAL_CODE, SHOW_REFERRALS } from "../../utils";
import useReferralSignIn from "../../hooks/referrals/useReferralSignIn";
import { saveAuthTokensFromPromo } from '../../utils/helper';
import bannerStyles from "../../components/Referral/ReferralBanner.module.css";


const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const shareDatasetMatch = useMatch("/login/share-dataset/:data_type/:tdei_dataset_id");
  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  useEffect(() => {
    sessionStorage.removeItem("inviteHandoffDone");
    sessionStorage.removeItem("inviteRegPayload");
  }, []);

  const validationSchema = yup.object().shape({
    username: yup.string().required("Email Id is required"),
    password: yup.string().required("Password is required"),
  });

  const codeFromUrl = (searchParams.get("code") || "").trim();
  const isShareDatasetFlow = !!shareDatasetMatch;
  const shareDatasetPath = isShareDatasetFlow
    ? buildShareDatasetPath(
      shareDatasetMatch.params.data_type,
      shareDatasetMatch.params.tdei_dataset_id
    )
    : "";
  const referralCode = SHOW_REFERRALS
    ? (isShareDatasetFlow ? DEFAULT_SHARE_REFERRAL_CODE : codeFromUrl)
    : "";
  const registerPath = isShareDatasetFlow
    ? buildShareDatasetAuthPath(
      "/register",
      shareDatasetMatch.params.data_type,
      shareDatasetMatch.params.tdei_dataset_id
    )
    : "/register";

  React.useEffect(() => {
    if (!SHOW_REFERRALS) return;
    if (codeFromUrl) {
      sessionStorage.setItem("referralCode", codeFromUrl);
    } else {
      sessionStorage.removeItem("referralCode");
    }
  }, [codeFromUrl]);



  const promoSignin = useReferralSignIn({
    onSuccess: (resp) => {
      setLoading(false);
      sessionStorage.setItem("promoSigninPayload", JSON.stringify(resp || {}));
      sessionStorage.setItem("handoffFlow", "promo");
      // Only save tokens to localStorage for desktop
      const isMobileKey = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent || "") ||
        (/Macintosh/i.test(navigator.userAgent || "") && navigator.maxTouchPoints > 1);

      if (!isMobileKey) {
        if (resp?.token) saveAuthTokensFromPromo(resp.token);
      }
      navigate("/invite-instructions?flow=promo", {
        replace: true,
        state: {
          ...location.state,
          ...(isShareDatasetFlow ? { from: shareDatasetPath } : {}),
          isPromo: true,
          instructions_url: resp?.instructions_url || resp?.instructions_url || "",
          token: resp?.token || "",
          redirect_url: resp?.redirect_url || "",
          referral_code: referralCode || ""
        }
      });
    },
    onError: (err) => {
      setLoading(false);
      sessionStorage.removeItem("referralCode");
      const status = err?.response?.status || err?.status;
      if (status === 404 || status === 410) {
        dispatch(show({ message: "Promo code is invalid or expired.", type: "warning" }));
      } else {
        dispatch(show({ message: "Invalid credentials or error in sign in", type: "danger" }));
      }
    }
  });

  const handleSignIn = async (values) => {
    setLoading(true);
    if (SHOW_REFERRALS && referralCode) {
      // PROMO FLOW: only call the referralSignIn API
      promoSignin.mutate({ referral_code: referralCode, data: values });
      return;
    }
    // Normal login flow
    auth.signin(
      values,
      () => setLoading(false),
      (err) => {
        console.error(err);
        setLoading(false);
        sessionStorage.removeItem("referralCode");
        if (err?.status === 403 || err?.response?.status === 403) {
          navigate("/emailVerify", {
            state: {
              actionText: "Your email address has not been verified. Please verify your email before logging in.",
              email: values.username
            }
          });
        } else {
          dispatch(show({ message: "Invalid credentials or Error in signing in", type: "danger" }));
        }
      }
    );
  };

  if (auth.user) {
    return <Navigate to={isShareDatasetFlow ? shareDatasetPath : (location.state?.from || "/")} replace />;
  }


  return (
    <div className={style.loginContainer}>
      <Row className="justify-content-center align-items-center">
        <div className={style.loginCard}>
          <Card>
            <Card.Body>
              <>
                <img src={tempLogo} className={style.loginLogo} alt="TDEI logo" />
                {isShareDatasetFlow && (
                  <div className={`${bannerStyles.referralBanner} mb-3`}>
                    <div className={bannerStyles.referralInfo}>
                      <div className={bannerStyles.referralTitle}>Shared Dataset</div>
                      <div className={bannerStyles.referralSubtle}>
                        You&apos;re signing in to access a shared dataset.
                      </div>
                    </div>
                  </div>
                )}
                {SHOW_REFERRALS && referralCode && !isShareDatasetFlow && (
                  <ReferralBanner code={referralCode} context="login" />
                )}
                <h1 className={style.loginTitle}>Welcome!</h1>
                <div className={style.loginSubTitle}>
                  Please login to your account.
                </div>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSignIn}
                  validationSchema={validationSchema}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email Id</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter Email Id"
                          value={values.username}
                          name="username"
                          isInvalid={touched.username && !!errors.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="username"
                          aria-describedby="email-error"
                          aria-invalid={touched.username && !!errors.username}
                        />
                        <Form.Control.Feedback type="invalid" id="email-error">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={values.password}
                            name="password"
                            isInvalid={touched.password && !!errors.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="current-password"
                            aria-describedby="password-error"
                            aria-invalid={touched.password && !!errors.password}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ borderLeft: "1px solid #ccc", background: "#fff", borderColor: "#ced4da" }}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <VisibilityOff sx={{ color: 'grey' }} /> : <Visibility sx={{ color: 'grey' }} />}
                          </Button>
                          <Form.Control.Feedback type="invalid" id="password-error">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group
                        className="mb-3 d-flex justify-content-between align-items-center"
                        controlId="formBasicCheckbox"
                      >
                        {/* <Form.Check type="checkbox" label="Remember me" /> */}
                        {/* <Button className="tdei-primary-link" variant="link">Reset Password?</Button> */}
                      </Form.Group>
                      <Button
                        className="tdei-primary-button"
                        variant="primary col-12 mx-auto"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                      <div className="mt-5 mb-2">
                        New to TDEI?{" "}
                        <Link
                          className="tdei-primary-link"
                          to={isShareDatasetFlow ? registerPath : (SHOW_REFERRALS && referralCode ? `/register?code=${encodeURIComponent(referralCode)}` : "/register")}
                          state={location.state}
                        >
                          Register Now
                        </Link>

                      </div>
                      <Link className="tdei-primary-link" to={"/ForgotPassword"}>
                        Forgot Password?
                      </Link>
                    </Form>
                  )}
                </Formik>
              </>
            </Card.Body>
          </Card>
        </div>
      </Row>
      <div className={style.appVersionText}>V 0.2.1</div>
    </div>
  );
};

export default LoginPage;
