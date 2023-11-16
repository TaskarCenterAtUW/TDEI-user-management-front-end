import { useState, useEffect } from "react";
import { url } from "../../services";
import axios from "axios";

function useGetProjectGroup(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projectGroupList, setProjectGroupList] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setProjectGroupList([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      url: `${url}/project-group`,
      params: {
        searchText: query,
        page_no: pageNumber,
        page_size: 10,
      },
      method: "GET",
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setProjectGroupList((prevProjectGroup) => {
          const result = [...prevProjectGroup, ...res.data];
          return result;
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, projectGroupList, hasMore };
}
export default useGetProjectGroup;
