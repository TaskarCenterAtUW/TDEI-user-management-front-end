import { useInfiniteQuery } from "react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_FEEDBACK } from "../../utils";
import { searchFeedback } from "../../services";


function useGetFeedback(tdei_dataset_id,from_date,to_date,sort_by,sort_order,page_no,page_size) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const [refreshKey, setRefreshKey] = useState(0); // for refreshing data
  
  const { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    [GET_FEEDBACK,tdei_project_group_id ,tdei_dataset_id, from_date, to_date, sort_by, sort_order, page_no, page_size, tdei_project_group_id, refreshKey],
    ({ pageParam }) =>
        searchFeedback(tdei_project_group_id, tdei_dataset_id, from_date, to_date, sort_by, sort_order, pageParam ?? 1, page_size),
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