import { useMutation, useQueryClient } from "react-query";
import { getReferralCodeDetails } from "../../services";

export default function useGetReferralCodeDetails(options = {}) {
  const queryClient = useQueryClient();

  return useMutation(
    (referral_code) => getReferralCodeDetails(referral_code),
    {
      // onSuccess: (data, referral_code) => {
      //   queryClient.setQueryData(["referral-code-details", referral_code], data);
      // },
      ...options,
    }
  );
}
