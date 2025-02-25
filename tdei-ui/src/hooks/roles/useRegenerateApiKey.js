import { useMutation } from "react-query";
import { REGNERATE_API_KEY } from "../../utils";
import { regenerateApiKey } from "../../services";

function useRegenerateApiKey(mutationOptions) {
  return useMutation([REGNERATE_API_KEY], regenerateApiKey, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useRegenerateApiKey;