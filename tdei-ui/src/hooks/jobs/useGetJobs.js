import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { getJobs } from "../../services";
import { GET_JOBS } from "../../utils";
import { useState, useEffect } from "react";

function useGetJobs(isAdmin, job_id = "", job_type = "", status = "", show = "") {
    const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
    const [refreshKey, setRefreshKey] = useState(0); // for refreshing data

    const { data, isError,error, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
        [GET_JOBS, tdei_project_group_id, job_id, job_type, status, show, refreshKey],
        ({ queryKey, pageParam = 1 }) => {
            return getJobs(queryKey[1], pageParam, isAdmin, queryKey[2], queryKey[3], queryKey[4], queryKey[5]);
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.data.length > 0 && lastPage.data.length === 10
                    ? lastPage.pageParam + 1
                    : undefined;
            },
            keepPreviousData: false,
            refetchOnWindowFocus: false,
        }
    );

    // Function to refresh data
    const refreshData = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };
    return { data, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData };
}

export default useGetJobs;