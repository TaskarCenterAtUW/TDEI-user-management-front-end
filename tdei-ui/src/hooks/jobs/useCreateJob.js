import {useMutation} from "react-query";
import {POST_CREATE_JOB} from "../../utils";
import {postCreateJob} from "../../services";

function useCreateJob(mutationOptions) {
    return useMutation([POST_CREATE_JOB], postCreateJob, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data);
        },
        onError: (err) => {
            mutationOptions.onError(err);
        },
    });
}

export default useCreateJob;
