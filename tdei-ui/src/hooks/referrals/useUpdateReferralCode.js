import { useMutation, useQueryClient } from "react-query";
import { updateReferralCode} from "../../services";
import { GET_REFERRALS } from "../../utils";

/**
 * Update a referral code
 * mutate({ projectGroupId, code_id, data })
 */
 function useUpdateReferralCode() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ projectGroupId, code_id, data }) =>
      updateReferralCode(projectGroupId, code_id, data),
    {
      onSuccess: () => {
        // Refresh any referral lists
        queryClient.invalidateQueries(GET_REFERRALS);
      },
    }
  );
}
export default useUpdateReferralCode;