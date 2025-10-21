import { useMutation } from "react-query";
import { postAssignReferralCode } from "../../services";

export default function useApplyReferralCode(options = {}) {
  return useMutation((referral_code) => postAssignReferralCode(referral_code), options);
}
