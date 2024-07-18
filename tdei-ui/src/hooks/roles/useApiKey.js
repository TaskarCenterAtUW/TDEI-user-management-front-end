import { useQuery } from "react-query";
import { getApiKey } from "../../services";
import { GET_API_KEY } from "../../utils";
import { useAuth } from "../useAuth";

function useApiKey() {
  const { user } = useAuth();
  return useQuery([GET_API_KEY, user?.emailId], getApiKey);
}

export default useApiKey;
