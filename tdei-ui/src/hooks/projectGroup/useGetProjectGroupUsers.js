import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { GET_PROJECT_GROUP_USERS } from "../../utils";
import { getProjectGroupUsers } from "../../services";
import useIsPoc from "../useIsPoc"; 
import { useAuth } from "../useAuth";

function useGetProjectGroupUsers(query = "") {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const { user } = useAuth();
  const isPoc = useIsPoc();
  const isAdmin = user?.isAdmin;

  return useInfiniteQuery(
    [GET_PROJECT_GROUP_USERS, query, tdei_project_group_id],
    ({ queryKey, pageParam }) =>
    getProjectGroupUsers(queryKey[1], queryKey[2], pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
      enabled: !!tdei_project_group_id && (isAdmin || isPoc),
    }
  );
}

export default useGetProjectGroupUsers;
