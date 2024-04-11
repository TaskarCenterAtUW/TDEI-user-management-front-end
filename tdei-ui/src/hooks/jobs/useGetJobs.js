import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { getJobs } from "../../services";
import { GET_JOBS } from "../../utils";

function useGetJobs(isAdmin,job_id = "", job_type = "", status = "") {
    const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
    return useInfiniteQuery(
        [GET_JOBS, tdei_project_group_id, job_id, job_type, status],
        ({ queryKey, pageParam }) =>
            getJobs(queryKey[1], pageParam, isAdmin, queryKey[2], queryKey[3], queryKey[4]),
        {
            getNextPageParam: (lastPage) => {
                return lastPage.data.length > 0 && lastPage.data.length === 10
                    ? lastPage.pageParam + 1
                    : undefined;
            },
            keepPreviousData : false
        }
    );
}

export default useGetJobs;