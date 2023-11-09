import { useMutation } from "react-query";
import { DELETE_PROJECT_GROUP } from "../../utils";
import { postProjectGroupDelete } from "../../services";

function useDeleteProjectGroup(mutationOptions) {
  return useMutation([DELETE_PROJECT_GROUP], postProjectGroupDelete, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useDeleteProjectGroup;
