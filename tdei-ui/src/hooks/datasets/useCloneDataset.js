
import { useMutation } from "react-query";
import { CLONE_DATASET } from "../../utils";
import { cloneDataset } from "../../services";

function useCloneDataset(mutationOptions) {
  return useMutation([CLONE_DATASET], cloneDataset, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useCloneDataset;
