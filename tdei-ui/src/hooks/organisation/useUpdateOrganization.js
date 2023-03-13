import { useMutation } from "react-query";
import { EDIT_ORG } from "../../utils";
import { postOrganisationUpdate } from "../../services";

function useUpdateOrganization(mutationOptions) {
  return useMutation([EDIT_ORG], postOrganisationUpdate, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useUpdateOrganization;
