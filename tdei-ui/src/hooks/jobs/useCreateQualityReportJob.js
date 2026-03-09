import { useMutation } from "react-query";
import { CREATE_QUALITY_REPORT_JOB } from "../../utils";
import { createQualityReportJob } from "../../services";

function useCreateQualityReportJob(mutationOptions) {
    return useMutation([CREATE_QUALITY_REPORT_JOB], createQualityReportJob, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data);
        },
        onError: (err) => {
            mutationOptions.onError(err);
        },
    });
}

export default useCreateQualityReportJob;
