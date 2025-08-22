import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_DATASETS } from "../../utils";
import { getDatasets } from "../../services";


function useGetDatasetsAutocomplete(searchText = "", pageNoOverride, minChars = 3) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
   const trimmed = (searchText || "").trim();
  const canSearch = !!tdei_project_group_id && trimmed.length >= minChars;
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    [GET_DATASETS, "autocomplete", searchText, tdei_project_group_id],
    ({ pageParam = 1 }) =>
      getDatasets(
        searchText,            
        "",                    
        pageParam,             // page
        undefined,             // isAdmin
        undefined,             // status
        undefined,             // dataType
        undefined,             // validFrom
        undefined,             // validTo
        undefined,             // tdeiServiceId
        undefined,             // selectedProjectGroupId
        tdei_project_group_id, // <- required
        undefined,             // sortField
        undefined              // sortOrder
      ),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.length > 0 && lastPage?.data?.length === 10
          ? (lastPage.pageParam || 1) + 1
          : undefined;
      },
      enabled: canSearch,
    }
  );

  const datasetList = (data?.pages || []).flatMap((p) => p?.data || []);

  const hasMore =
    hasNextPage ||
    (data?.pages?.length
      ? (data.pages[data.pages.length - 1]?.data?.length || 0) === 10
      : false);

  if (pageNoOverride && pageNoOverride > 1) {
  }

  return {
    loading: isLoading || isFetchingNextPage,
    datasetList,
    hasMore,
    fetchNextPage,
  };
}

export default useGetDatasetsAutocomplete;
