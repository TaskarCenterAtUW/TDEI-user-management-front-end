import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_DATASETS } from "../../utils";
import { getDatasets, getReleasedDatasets } from "../../services";

function useGetDatasets(searchText = "", status = "All", dataType) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const [refreshKey, setRefreshKey] = useState(0); // for refeshing data
  const { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [GET_DATASETS, searchText, status, dataType, tdei_project_group_id, refreshKey],
    ({ pageParam }) =>
    getDatasets(searchText, pageParam, status, dataType,tdei_project_group_id),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
    }
  );
  // Function to refresh data
  const refreshData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };
  return { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData };
}

export default useGetDatasets;
