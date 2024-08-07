import { useMutation } from "react-query";
import { UPDATE_SERVICE } from "../../utils";
import { postUpdateService } from "../../services";

function useUpdateSevice(mutationOptions) {
  return useMutation([UPDATE_SERVICE], postUpdateService, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useUpdateSevice;
