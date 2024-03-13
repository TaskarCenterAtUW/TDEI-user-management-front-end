import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { getStations } from "../../services";
import { GET_STATIONS } from "../../utils";

function useGetStations(query = "",isAdmin) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  return useInfiniteQuery(
    [GET_STATIONS, query, tdei_project_group_id],
    ({ queryKey, pageParam }) =>
      getStations(queryKey[1], queryKey[2], pageParam,isAdmin),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
      enabled: isAdmin ? true : !!tdei_project_group_id,
    }
  );
}

export default useGetStations;
