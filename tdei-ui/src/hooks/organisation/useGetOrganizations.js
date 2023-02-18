import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getOrgLists } from "../../services";
import { GET_ORG_LIST } from "../../utils";

function useGetOrganizations(query = "", pageNumber) {
  const [list, setList] = useState([]);
  const {
    data = [],
    isLoading,
    isFetching,
    ...rest
  } = useQuery(
    [GET_ORG_LIST, { searchText: query, page_no: pageNumber }],
    getOrgLists
  );

  useEffect(() => {
    setList([]);
  }, [query]);

  useEffect(() => {
    if (!isLoading) {
      setList((prev) => [...prev, ...data]);
    }
  }, [data]);
  return {
    data: list,
    isLoading,
    hasMore: data?.length > 0,
    ...rest,
  };
}

export default useGetOrganizations;
