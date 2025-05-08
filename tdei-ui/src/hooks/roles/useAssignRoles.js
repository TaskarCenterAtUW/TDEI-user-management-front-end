import { useMutation } from "react-query";
import { ASSIGN_ROLES } from "../../utils";
import { postAssignRoles } from "../../services";

function useAssignRoles(mutationOptions) {
  return useMutation([ASSIGN_ROLES], postAssignRoles, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err, variables) => {
      if (err?.response?.status === 404) {
        err.response.data = `The user '${variables.user_name}' not registered with TDEI`;
      }
      mutationOptions.onError(err);
    },
  });
}

export default useAssignRoles;
