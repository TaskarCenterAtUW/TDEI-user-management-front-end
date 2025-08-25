import { useInfiniteQuery } from "react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_FEEDBACK } from "../../utils";
import { searchFeedback } from "../../services";

function useGetFeedback(
  tdei_dataset_id,   // string|null
  from_date,         // string|null (ISO or MM-DD-YYYY your API expects)
  to_date,           // string|null
  sort_by,           // "created_at" | "due_date"
  sort_order,        // "asc" | "desc"
  page_no,           // number (initial page, e.g., 1)
  page_size,         // number (e.g., 10)
  status             // "" | "open" | "in_progress" | "resolved"
) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const [refreshKey, setRefreshKey] = useState(0);

  const queryKey = [
    GET_FEEDBACK,
    tdei_project_group_id,
    tdei_dataset_id,
    from_date,
    to_date,
    sort_by,
    sort_order,
    page_size,
    status,
    refreshKey,
  ];

  const queryFn = ({ pageParam = page_no }) =>
    searchFeedback(
      tdei_project_group_id,
      tdei_dataset_id,
      from_date,
      to_date,
      sort_by,
      sort_order,
      pageParam,
      page_size,
      status
    );

  const {
    data,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(queryKey, queryFn, {
    getNextPageParam: (lastPage) => {
      const len = Array.isArray(lastPage?.data) ? lastPage.data.length : 0;
      return len > 0 && len === page_size ? (lastPage.pageParam || 1) + 1 : undefined;
    },
  });

  const refreshData = () => setRefreshKey((k) => k + 1);

  return { data, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, refreshData };
}

export default useGetFeedback;