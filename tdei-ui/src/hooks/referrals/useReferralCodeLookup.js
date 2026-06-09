import React from "react";
import { useQuery } from "react-query";
import { getReferralCodeDetails } from "../../services";

function getReferralLookupMessage(details, error) {
  if (error) {
    return (
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to load referral details."
    );
  }

  if (typeof details === "string") {
    return details.trim();
  }

  if (
    details &&
    typeof details === "object" &&
    typeof details.message === "string"
  ) {
    return details.message.trim();
  }

  return "";
}

export default function useReferralCodeLookup(referralCode) {
  const query = useQuery(
    ["referral-code-details", referralCode],
    () => getReferralCodeDetails(referralCode),
    {
      enabled: !!referralCode,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const message = React.useMemo(
    () => getReferralLookupMessage(query.data, query.error),
    [query.data, query.error]
  );

  const isInvalid = React.useMemo(() => {
    if (!message) return false;
    return /invalid|expired|not found/i.test(message);
  }, [message]);

  return {
    ...query,
    message,
    isInvalid,
    details:
      query.data && typeof query.data === "object" && !Array.isArray(query.data)
        ? query.data
        : null,
  };
}
