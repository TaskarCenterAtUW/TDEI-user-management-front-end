import { useMutation } from "react-query";
import { ASSIGN_POC } from "../../utils";
import { postAssignPoc } from "../../services";

function useAssignPoc(mutationOptions) {
  return useMutation([ASSIGN_POC], postAssignPoc, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useAssignPoc;
