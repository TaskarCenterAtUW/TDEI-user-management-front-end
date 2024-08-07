import { useMutation } from "react-query";
import { DELETE_SERVICE } from "../../utils";
import { postServiceDelete } from "../../services";

function useDeleteService(mutationOptions) {
  return useMutation([DELETE_SERVICE], postServiceDelete, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useDeleteService;
