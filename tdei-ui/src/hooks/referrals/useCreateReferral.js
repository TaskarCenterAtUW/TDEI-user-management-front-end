import { useMutation, useQueryClient } from "react-query";
import { POST_CREATE_REFERRAL, GET_REFERRALS } from "../../utils";
import { createReferralCode } from "../../services";

function useCreateReferral(mutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation(
    [POST_CREATE_REFERRAL],
    ({ projectGroupId, data }) => createReferralCode(projectGroupId, data),
    {
      onSuccess: (res, variables, context) => {
        queryClient.invalidateQueries(GET_REFERRALS);
        mutationOptions?.onSuccess?.(res, variables, context);
      },
      onError: (err, variables, context) => {
        mutationOptions?.onError?.(err, variables, context);
      },
      ...mutationOptions,
    }
  );
}

export default useCreateReferral;
