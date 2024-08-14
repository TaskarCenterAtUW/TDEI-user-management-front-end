import { useMutation } from "react-query";
import { RESET_PASSWORD } from "../utils";
import { postResetPassword } from "../services";

function useResetPassword(mutationOptions) {
  return useMutation([RESET_PASSWORD], postResetPassword, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useResetPassword;
