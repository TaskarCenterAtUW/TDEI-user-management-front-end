import { useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_DATASETS } from "../../utils";
import { getReleasedDatasets } from "../../services";

function useGetReleasedDatasets(searchText = "",debounceDatasetIdQuery = "", dataType, projectId = "", validFrom = null, validTo = null, tdeiServiceId,sortField, sortOrder) {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const tdei_project_group_id = projectId === "" ? selectedProjectGroup?.tdei_project_group_id : projectId;
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [GET_DATASETS, searchText,debounceDatasetIdQuery, dataType, tdei_project_group_id, refreshKey, validFrom, validTo,tdeiServiceId,sortField, sortOrder],
    ({ pageParam }) =>
      getReleasedDatasets(searchText, debounceDatasetIdQuery, pageParam, dataType, tdei_project_group_id, validFrom, validTo,tdeiServiceId,sortField, sortOrder),
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
