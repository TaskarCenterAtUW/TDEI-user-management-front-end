import { useMutation } from "react-query";
import { ACTIVATE_DEACTIVATE_PROJECT_GROUP } from "../../utils";
import { updateActivateDeleteProjectGroup } from "../../services";

function useActivateDeleteProjectGroup(mutationOptions) {
  return useMutation([ACTIVATE_DEACTIVATE_PROJECT_GROUP], updateActivateDeleteProjectGroup, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useActivateDeleteProjectGroup;
