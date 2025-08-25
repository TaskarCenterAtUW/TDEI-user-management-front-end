import { useQuery } from "react-query";
import { getFeedbackSummary } from "../../services";
import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";

function useGetFeedbackSummary() {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup) || {};

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery(
    ["GET_FEEDBACK_SUMMARY", tdei_project_group_id],
    () => getFeedbackSummary(tdei_project_group_id),
    {
      enabled: !!tdei_project_group_id,
      staleTime: 5 * 60 * 1000,       
      cacheTime: 10 * 60 * 1000,        
    }
  );

  return { data, isLoading, isError, error };
}

export default useGetFeedbackSummary;
