import { useMutation } from "react-query";
import { CREATE_STATION } from "../../utils";
import { postCreateStation } from "../../services";

function useCreateStation(mutationOptions) {
  return useMutation([CREATE_STATION], postCreateStation, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useCreateStation;
