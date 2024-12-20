import { useInfiniteQuery } from "react-query";
import { getProjectGroupLists } from "../../services";
import { GET_PROJECT_GROUP_LIST } from "../../utils";

function useGetProjectGroups(query = "", showInactive) {
  return useInfiniteQuery(
    [GET_PROJECT_GROUP_LIST, query, showInactive],
    ({ queryKey, pageParam, signal }) => {
      const [, query, showInactive] = queryKey;
      return getProjectGroupLists(query, pageParam, signal, showInactive);
    },
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
