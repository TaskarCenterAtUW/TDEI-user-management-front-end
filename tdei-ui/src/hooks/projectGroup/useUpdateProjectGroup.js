import { useMutation } from "react-query";
import { postProjectGroupUpdate } from "../../services";
import { EDIT_PROJECT_GROUP } from "../../utils";

function useUpdateProjectGroup(mutationOptions) {
  return useMutation([EDIT_PROJECT_GROUP], postProjectGroupUpdate, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useUpdateProjectGroup;
