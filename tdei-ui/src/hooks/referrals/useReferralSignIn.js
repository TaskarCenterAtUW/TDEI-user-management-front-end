import { useMutation } from "react-query";
import { referralSignIn } from "../../services";

export default function useReferralSignIn(options = {}) {
  return useMutation(
    ({ referral_code, data }) => referralSignIn(referral_code, data),
    options
  );
}
