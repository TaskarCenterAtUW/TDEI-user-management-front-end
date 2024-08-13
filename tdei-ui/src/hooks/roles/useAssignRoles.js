import { useMutation } from "react-query";
import { ASSIGN_ROLES } from "../../utils";
import { postResetPassword } from "../../services";

function useAssignRoles(mutationOptions) {
  return useMutation([ASSIGN_ROLES], postResetPassword, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useAssignRoles;
