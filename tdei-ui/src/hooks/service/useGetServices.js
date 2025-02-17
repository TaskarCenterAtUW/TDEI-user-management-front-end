import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { getServices } from "../../services";
import { GET_SERVICES } from "../../utils";


function useGetServices(query = "", isAdmin, service_type, showInactive, selectedProjectGroupId = "") {
  const selectedProjectGroup = useSelector(getSelectedProjectGroup);
  const tdei_project_group_id = selectedProjectGroupId !== "" 
    ? selectedProjectGroupId 
    : selectedProjectGroup?.tdei_project_group_id;

  return useInfiniteQuery(
    [GET_SERVICES, query, tdei_project_group_id, service_type, showInactive],
    ({ queryKey, pageParam = 1 }) =>
      getServices(queryKey[1], queryKey[2], pageParam, isAdmin, service_type, showInactive),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 && lastPage.data.length === 10
          ? lastPage.pageParam + 1
          : undefined;
      },
      enabled: isAdmin || !!tdei_project_group_id,
    }
  );
}

export default useGetServices;
