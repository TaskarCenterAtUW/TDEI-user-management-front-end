import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedOrg } from "../../selectors";
import { getOrgUsers } from "../../services";
import { GET_ORG_USERS } from "../../utils";

function useGetOrgUsers(query = "") {
  const { tdei_org_id } = useSelector(getSelectedOrg);
  return useInfiniteQuery(
    [GET_ORG_USERS, query, tdei_org_id],
    ({ queryKey, pageParam }) =>
      getOrgUsers(queryKey[1], queryKey[2], pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
      enabled: !!tdei_org_id,
    }
  );
}

export default useGetOrgUsers;
