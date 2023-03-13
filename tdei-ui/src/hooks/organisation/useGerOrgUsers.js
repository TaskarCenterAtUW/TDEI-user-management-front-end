import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedOrg } from "../../selectors";
import { getOrgUsers } from "../../services";
import { GET_ORG_USERS } from "../../utils";

function useGetOrgUsers(query = "") {
  const { orgId } = useSelector(getSelectedOrg);
  return useInfiniteQuery(
    [GET_ORG_USERS, query, orgId],
    ({ queryKey, pageParam }) =>
      getOrgUsers(queryKey[1], queryKey[2], pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
      enabled: !!orgId,
    }
  );
}

export default useGetOrgUsers;
