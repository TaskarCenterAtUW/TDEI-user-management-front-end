import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { getOrgLists } from "../../services";
import { GET_ORG_LIST } from "../../utils";

function useGetOrganizations(query = "") {
  return useInfiniteQuery(
    [GET_ORG_LIST, query],
    ({ queryKey, pageParam, signal }) =>
      getOrgLists(queryKey[1], pageParam, signal),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.data.length > 0 ? lastPage.pageParam + 1 : undefined;
      },
    }
  );
}

export default useGetOrganizations;
