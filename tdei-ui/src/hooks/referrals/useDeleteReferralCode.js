import { useMutation, useQueryClient } from "react-query";
import {deleteReferralCode } from "../../services";
import { GET_REFERRALS } from "../../utils";
/**
 * Delete a referral code
 * mutate({ projectGroupId, code_id })
 */
export function useDeleteReferralCode() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ projectGroupId, code_id }) => deleteReferralCode(projectGroupId, code_id),
    {
      onSuccess: () => {
        // Refresh any referral lists
        queryClient.invalidateQueries(GET_REFERRALS);
      },
    }
  );
}