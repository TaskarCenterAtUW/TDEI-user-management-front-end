import React from "react";
import { Alert, Spinner } from "react-bootstrap";
import useGetReferralCodeDetails from "../../hooks/referrals/useGetReferralCodeDetails";
import styles from "./ReferralBanner.module.css";

export default function ReferralBanner({ code, context = "register" }) {
  const { mutate, data, isLoading, error, reset } = useGetReferralCodeDetails();

  React.useEffect(() => {
    if (!code) return;
    reset?.();         
    mutate(code);       
  }, [code, mutate, reset]);

  if (!code) return null;

  const details = data || null;

  return (
    <div className={`${styles.referralBanner} mb-3`}>
      <div className={styles.referralRow}>
        <div className={styles.referralInfo}>
          <div className={styles.referralTitle}>Referral Code:</div>
          <div className={styles.referralSubtle}>
            {context === "login"
              ? "You're signing in with a referral code"
              : "You're registering with a referral code"}
          </div>

          {isLoading && (
            <div className={styles.referralInline}>
              <Spinner animation="border" size="sm" />
              <span className="text-muted">Loading details…</span>
            </div>
          )}

          {!!error && (
            <Alert className="mt-2 mb-0" variant="warning">
              {error?.response?.data?.message ||
                error?.message ||
                "Failed to load referral details."}
            </Alert>
          )}

          {details && (details.name || details.description) && (
            <div className={styles.referralDetails}>
              <strong>{details.name}</strong>
              {details?.description ? ` — ${details.description}` : ""}
            </div>
          )}
        </div>

        <div className={styles.referralCode}>{String(code).toUpperCase()}</div>
      </div>
    </div>
  );
}
