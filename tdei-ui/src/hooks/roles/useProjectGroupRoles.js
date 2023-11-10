import { useQuery } from "react-query";
import { getProjectGroupRoles } from "../../services";
import { GET_PROJECT_GROUP_ROLES } from "../../utils";
import { useAuth } from "../useAuth";

function useGetProjectGroupRoles() {
  const { user } = useAuth();
  return useQuery([GET_PROJECT_GROUP_ROLES, user?.userId], getProjectGroupRoles);
}

export default useGetProjectGroupRoles;
