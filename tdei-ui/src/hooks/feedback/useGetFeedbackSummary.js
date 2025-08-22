import { useQuery } from "react-query";
import { getFeedbackSummary } from "../../services";

function useGetFeedbackSummary() {
  const { data, isLoading, isError, error } = useQuery(
    ["GET_FEEDBACK_SUMMARY"], 
    getFeedbackSummary,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  return { 
    data, 
    isLoading, 
    isError, 
    error 
  };
}

export default useGetFeedbackSummary;
