import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_DATASETS } from "../../utils";
import { getReleasedDatasets } from "../../services";

function useGetReleasedDatasets(searchText = "", dataType) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [GET_DATASETS, searchText, dataType, tdei_project_group_id, refreshKey],
    ({ pageParam }) =>
    getReleasedDatasets(searchText, pageParam, dataType),
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
  useEffect(() => {
    refreshData();
  }, [searchText, dataType]);
  console.log("released datasets hook", data)
  return { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData };
}

export default useGetReleasedDatasets;
