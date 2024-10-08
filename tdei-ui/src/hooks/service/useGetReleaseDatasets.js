import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_DATASETS } from "../../utils";
import { getReleasedDatasets } from "../../services";

function useGetReleasedDatasets(searchText = "", dataType, projectId = "") {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [GET_DATASETS, searchText, dataType, tdei_project_group_id, refreshKey,projectId],
    ({ pageParam }) =>
      getReleasedDatasets(searchText, pageParam, dataType, projectId),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
    }
  );

  const refreshData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData };
}

export default useGetReleasedDatasets;
