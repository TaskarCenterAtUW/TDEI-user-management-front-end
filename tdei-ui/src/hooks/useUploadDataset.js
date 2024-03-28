
import { useMutation } from "react-query";
import { POST_DATASET } from "../utils/react-query-constant";
import { postUploadDataset } from "../services";

function useUploadDataset(mutationOptions) {
  return useMutation([POST_DATASET], postUploadDataset, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useUploadDataset;
