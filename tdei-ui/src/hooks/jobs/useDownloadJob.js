import {useMutation} from "react-query";
import {DOWNLOAD_JOB} from "../../utils";
import { downloadJob } from "../../services";

function useDownloadJob(mutationOptions) {
    return useMutation([DOWNLOAD_JOB], downloadJob, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data);
        },
        onError: (err) => {
            mutationOptions.onError(err);
        },
    });
}

export default useDownloadJob;
