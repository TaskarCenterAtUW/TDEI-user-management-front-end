import { useMutation } from "react-query";
import { DELETE_STATION } from "../../utils";
import { postStationDelete } from "../../services";

function useDeleteStation(mutationOptions) {
  return useMutation([DELETE_STATION], postStationDelete, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useDeleteStation;
