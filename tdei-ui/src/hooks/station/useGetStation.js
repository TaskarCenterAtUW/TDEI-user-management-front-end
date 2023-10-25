//getStation

import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedOrg  } from "../../selectors";
import { getStation } from "../../services";
import { GET_STATIONS } from "../../utils";

function useGetStation(tdei_station_id = "") {
  const { tdei_org_id } = useSelector(getSelectedOrg);
  return useInfiniteQuery(
    [GET_STATIONS, tdei_station_id, tdei_org_id],
    ({ queryKey, pageParam }) =>
    getStation(queryKey[1], queryKey[2], pageParam)
  );
}

export default useGetStation;