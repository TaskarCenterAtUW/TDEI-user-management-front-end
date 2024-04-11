import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import {getJobReport, getJobs} from "../../services";
import { GET_JOB_REPORT } from "../../utils";

function UseGetJobReport(job_id) {
    return useInfiniteQuery(
        [GET_JOB_REPORT, job_id],
        ({ queryKey, pageParam }) =>
            getJobReport(queryKey[1])
    );
}

export default UseGetJobReport;