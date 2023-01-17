import { useState, useEffect } from "react";
import { url } from "../../services";
import axios from 'axios'

function useGetOrganisation(query, pageNumber) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [orgList, setOrgList] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setOrgList([])
    }, [query])

    // useEffect(() => {
    //     const getOrg = async () => {
    //         setLoading(true)
    //         setError(false)
    //         try {
    //             let data = await getOrgList(query, pageNumber)
    //             setOrgList(prevOrg => {
    //                 return [...prevOrg, ...data]
    //             })
    //             setHasMore(data.length > 0)
    //             setLoading(false)

    //         } catch (e) {
    //             setError(true)
    //         }
    //     }
    //     getOrg();

    // }, [query, pageNumber])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        axios({
            url: `${url}/organization`,
            params: {
                searchText: query,
                page_no:pageNumber,
                page_size: 10
            },
            method: 'GET',
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            setOrgList(prevOrg => {
                return [...prevOrg, ...res.data]
            })
            setHasMore(res.data.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [query, pageNumber])

    return { loading, error, orgList, hasMore }
}
export default useGetOrganisation;
