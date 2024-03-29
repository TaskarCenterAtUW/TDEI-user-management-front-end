import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_DATASETS } from "../../utils";
import { getDatasets } from "../../services";

function useGetDatasets(query = "", status,dataType) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  return useInfiniteQuery(
    [GET_DATASETS, query, tdei_project_group_id],
    ({ queryKey, pageParam }) =>
    getDatasets(queryKey[1], queryKey[2], pageParam,status,dataType),
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
