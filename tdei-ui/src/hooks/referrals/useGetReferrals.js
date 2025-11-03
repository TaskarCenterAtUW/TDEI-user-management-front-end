import { useInfiniteQuery } from "react-query";
import { useState } from "react";
import { getReferralCodes } from "../../services";
import { GET_REFERRALS } from "../../utils";

function useGetReferrals(tdei_project_group_id, name, type, code) {
  const [refreshKey, setRefreshKey] = useState(0);

  const query = useInfiniteQuery(
    [GET_REFERRALS, tdei_project_group_id, name, type, code, refreshKey],
    ({ pageParam = 1, queryKey }) => {
      const [, projectGroupId, qName, qType, qCode] = queryKey;
      return getReferralCodes({
        projectGroupId,
        page: pageParam,
        name: qName,
        type: qType,
        code: qCode,
      });
    },
    {
      getNextPageParam: (lastPage) => {
        const { current_page, total_pages } = lastPage.data;
        return current_page < total_pages ? current_page + 1 : undefined;
      },
      refetchOnWindowFocus: false,
      keepPreviousData: false,
    }
  );

  const refreshData = () => setRefreshKey(k => k + 1);

  const {
    data,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = query;

  return {
    data,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refreshData,
  };
}

export default useGetReferrals;
