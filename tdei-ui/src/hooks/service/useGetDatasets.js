import { useInfiniteQuery } from "react-query";
import { useState } from "react";
import { GET_DATASETS } from "../../utils";
import { getDatasets } from "../../services";

function useGetDatasets(isAdmin, searchText = "", searchDatasetId = "",status = "All", dataType, validFrom, validTo, tdeiServiceId, selectedProjectGroupId, includeMyGroups, sortField, sortOrder) {
  const [refreshKey, setRefreshKey] = useState(0); // for refreshing data
  
  const { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [GET_DATASETS, isAdmin, searchText,searchDatasetId, status, dataType, validFrom, validTo, tdeiServiceId, selectedProjectGroupId, includeMyGroups, sortField, sortOrder,refreshKey],
    ({ pageParam }) =>
      getDatasets(searchText,searchDatasetId, pageParam, isAdmin, status, dataType, validFrom, validTo, tdeiServiceId, selectedProjectGroupId, includeMyGroups, sortField,sortOrder),
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
