import { useQuery } from "react-query";
import { getRoles } from "../../services";
import { GET_ROLES } from "../../utils";

function useGetRoles() {
  return useQuery([GET_ROLES], getRoles);
}

export default useGetRoles;
