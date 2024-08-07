import { useMutation } from "react-query";
import { CREATE_PROJECT_GROUP } from "../../utils";
import { postProjectGroupCreation } from "../../services";

function useCreateProjectGroup(mutationOptions) {
  return useMutation([CREATE_PROJECT_GROUP], postProjectGroupCreation, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useCreateProjectGroup;
