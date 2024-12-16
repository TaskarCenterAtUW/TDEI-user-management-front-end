import { useMutation } from "react-query";
import { UPDATE_SERVICE_STATUS } from "../../utils";
import { updateServiceStatus } from "../../services";

function useEditServiceStatus(mutationOptions) {
  return useMutation([UPDATE_SERVICE_STATUS], updateServiceStatus, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useEditServiceStatus;
