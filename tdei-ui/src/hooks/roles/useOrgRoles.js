import { useQuery } from "react-query";
import { getOrgRoles } from "../../services";
import { GET_ORG_ROLES } from "../../utils";
import { useAuth } from "../useAuth";

function useGetOrgRoles() {
  const { user } = useAuth();
  return useQuery([GET_ORG_ROLES, user?.userId], getOrgRoles);
}

export default useGetOrgRoles;
