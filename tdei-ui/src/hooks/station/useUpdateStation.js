import { useMutation } from "react-query";
import { UPDATE_STATION } from "../../utils";
import { postUpdateStation } from "../../services";

function useUpdateStation(mutationOptions) {
  return useMutation([UPDATE_STATION], postUpdateStation, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useUpdateStation;
