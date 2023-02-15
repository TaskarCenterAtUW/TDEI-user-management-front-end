import { useMutation } from "react-query";
import { CREATE_ORG } from "../../utils";
import { postOrganisationCreation } from "../../services";

function useCreateOrganisation(mutationOptions) {
  return useMutation([CREATE_ORG], postOrganisationCreation, {
    ...mutationOptions,
    onSuccess: (data) => {
      mutationOptions.onSuccess(data);
    },
    onError: (err) => {
      mutationOptions.onError(err);
    },
  });
}

export default useCreateOrganisation;
