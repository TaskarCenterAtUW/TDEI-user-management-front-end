import { useInfiniteQuery } from "react-query";
import { getProjectGroupRoles } from "../../services";
import { GET_PROJECT_GROUP_ROLES } from "../../utils";
import { useAuth } from "../useAuth";

function useGetProjectGroupRoles(queryText) {
  const { user } = useAuth();
  return useInfiniteQuery(
    [GET_PROJECT_GROUP_ROLES, user?.userId,queryText],
    ({ pageParam = 1 }) => getProjectGroupRoles(user?.userId, pageParam,queryText),
    {
      getNextPageParam: (lastPage) =>
        lastPage.data.length === 10 ? lastPage.pageParam + 1 : undefined,
    }
  );
}

export default useGetProjectGroupRoles;
