import { useMutation } from "react-query";
import { DELETE_ORG } from "../../utils";
import { postOrganisationDelete } from "../../services";

function useDeleteOrganization(mutationOptions) {
  return useMutation([DELETE_ORG], postOrganisationDelete, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useDeleteOrganization;
