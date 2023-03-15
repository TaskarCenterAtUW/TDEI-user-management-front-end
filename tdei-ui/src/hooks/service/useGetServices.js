import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedOrg } from "../../selectors";
import { getServices } from "../../services";
import { GET_SERVICES } from "../../utils";

function useGetServices(query = "") {
  const { tdei_org_id } = useSelector(getSelectedOrg);
  return useInfiniteQuery(
    [GET_SERVICES, query, tdei_org_id],
    ({ queryKey, pageParam }) =>
      getServices(queryKey[1], queryKey[2], pageParam),
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

export default useGetServices;
