import { useQuery } from "react-query";
import { getSystemCapabilities } from "../services";
import { GET_SYSTEM_CAPABILITIES } from "../utils";

function useSystemCapabilities() {
    return useQuery([GET_SYSTEM_CAPABILITIES], getSystemCapabilities, {
        staleTime: Infinity,
    });
}

export default useSystemCapabilities;
