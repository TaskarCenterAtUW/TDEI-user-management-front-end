import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_DATASETS } from "../../utils";
import { getDatasets } from "../../services";

function useGetDatasets(searchText = "", status = "All", dataType) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  return useInfiniteQuery(
    [GET_DATASETS, searchText, status, dataType, tdei_project_group_id],
    ({ pageParam }) =>
      getDatasets(searchText, pageParam, status, dataType),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
    }
  );
}

export default useGetDatasets;
