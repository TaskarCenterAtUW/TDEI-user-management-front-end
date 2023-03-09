import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedOrg } from "../../selectors";
import { getStations } from "../../services";
import { GET_STATIONS } from "../../utils";

function useGetStations(query = "") {
  const { orgId } = useSelector(getSelectedOrg);
  return useInfiniteQuery(
    [GET_STATIONS, query, orgId],
    ({ queryKey, pageParam }) =>
      getStations(queryKey[1], queryKey[2], pageParam),
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

export default useGetStations;
