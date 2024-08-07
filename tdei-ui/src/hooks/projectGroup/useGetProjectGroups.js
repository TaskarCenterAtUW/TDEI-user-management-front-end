import { useInfiniteQuery } from "react-query";
import { getProjectGroupLists } from "../../services";
import { GET_PROJECT_GROUP_LIST } from "../../utils";

function useGetProjectGroups(query = "") {
  return useInfiniteQuery(
    [GET_PROJECT_GROUP_LIST, query],
    ({ queryKey, pageParam, signal }) =>
    getProjectGroupLists(queryKey[1], pageParam, signal),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
    }
  );
}

export default useGetProjectGroups;
