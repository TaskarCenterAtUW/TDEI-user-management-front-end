
import { useMutation } from "react-query";
import { EDIT_META_DATA } from "../../utils";
import { editMetadata } from "../../services";

function useEditMetadata(mutationOptions) {
  return useMutation([EDIT_META_DATA], editMetadata, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useEditMetadata;
