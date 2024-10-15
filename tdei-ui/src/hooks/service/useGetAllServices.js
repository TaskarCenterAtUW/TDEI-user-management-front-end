import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";
import { getServices } from "../../services";
import { GET_SERVICES } from "../../utils";
import axios from "axios";
import { url } from "../../services";

function useGetAllServices(query = "", isAdmin, service_type) {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setServiceList([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    
    axios({
      url: `${url}/service`, 
      params: {
        searchText: query,
        tdei_project_group_id: isAdmin ? null : tdei_project_group_id,
        page_no: pageNumber,
        page_size: 10,
        service_type,
      },
      method: "GET",
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setServiceList((prevServiceList) => {
          return [...prevServiceList, ...res.data];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    
    return () => cancel(); 
  }, [query, tdei_project_group_id, pageNumber, isAdmin, service_type]);

  return { loading, error, serviceList, hasMore, setPageNumber };
}

export default useGetAllServices;
