import { useMutation } from "react-query";
import { REVOKE_PERMISSION } from "../../utils";
import { postRevokePermission } from "../../services";

function useRevokePermission(mutationOptions) {
  return useMutation([REVOKE_PERMISSION], postRevokePermission, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useRevokePermission;
