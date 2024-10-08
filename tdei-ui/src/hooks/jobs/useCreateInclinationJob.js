import {useMutation} from "react-query";
import {CREATE_INCLINE_JOB} from "../../utils";
import {createInclinationJob} from "../../services";

function useCreateInclinationJob(mutationOptions) {
    return useMutation([CREATE_INCLINE_JOB], createInclinationJob, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data);
        },
        onError: (err) => {
            mutationOptions.onError(err);
        },
    });
}

export default useCreateInclinationJob;
