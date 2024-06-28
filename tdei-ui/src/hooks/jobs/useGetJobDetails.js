import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { getJobDetails } from "../../services";
import { GET_JOB_DETAILS } from "../../utils";
import { useEffect, useState } from "react";

function useGetJobDetails(isAdmin, job_id = "", enabled = false) {
    const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
    const [refreshKey, setRefreshKey] = useState(0); // for refreshing data

    useEffect(() => {
        console.log("useGetJobDetails Hook called with job_id:", job_id);
    }, [job_id]);

    const { data, error, isLoading, refetch } = useQuery(
        [GET_JOB_DETAILS, tdei_project_group_id, job_id, isAdmin, refreshKey],
        () => getJobDetails(tdei_project_group_id, job_id, isAdmin),
        {
            enabled, // Only fetch data if enabled is true
        }
    );

    // Function to refresh data
    const refreshData = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    return { data, error, isLoading,refreshData };
}

export default useGetJobDetails;
