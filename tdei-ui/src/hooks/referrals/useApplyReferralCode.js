import { useMutation, useQueryClient } from "react-query";
import { postAssignReferralCode } from "../../services";
import { GET_PROJECT_GROUP_ROLES } from "../../utils";

export default function useApplyReferralCode(options = {}) {
  const qc = useQueryClient();
  return useMutation((referral_code) => postAssignReferralCode(referral_code), {
    ...options,
    onSuccess: (data, vars, ctx) => {
      qc.invalidateQueries({
        predicate: q =>
          Array.isArray(q.queryKey) && q.queryKey[0] === GET_PROJECT_GROUP_ROLES,
      });
      options.onSuccess?.(data, vars, ctx);
    },
  });
}
