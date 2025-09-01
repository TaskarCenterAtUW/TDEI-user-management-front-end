import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../services";

/**
 * Fetch a single project group by tdei_project_group_id.
 */
function useGetProjectGroupById(tdei_project_group_id) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [projectGroup, setProjectGroup] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!tdei_project_group_id) {
      setProjectGroup(null);
      setNotFound(false);
      setError(null);
      return;
    }

    let cancel;
    setLoading(true);
    setError(null);
    setNotFound(false);

    const endpoint = `${url}/project-group`;

    axios({
      url: endpoint,
      method: "GET",
      params: { tdei_project_group_id },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!data) {
          setProjectGroup(null);
          setNotFound(true);
        } else {
          setProjectGroup(data);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        if (e?.response?.status === 404) {
          setNotFound(true);
          setProjectGroup(null);
          setError(null);
        } else {
          setError(e);
        }
      })
      .finally(() => setLoading(false));

    return () => cancel && cancel();
  }, [tdei_project_group_id]);

  return { loading, error, projectGroup, notFound };
}

export default useGetProjectGroupById;
