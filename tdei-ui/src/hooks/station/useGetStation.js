//getStation

import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { getStation } from "../../services";
import { GET_STATIONS } from "../../utils";

function useGetStation(tdei_station_id = "") {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  return useInfiniteQuery(
    [GET_STATIONS, tdei_station_id, tdei_project_group_id],
    ({ queryKey, pageParam }) =>
    getStation(queryKey[1], queryKey[2], pageParam)
  );
}

export default useGetStation;