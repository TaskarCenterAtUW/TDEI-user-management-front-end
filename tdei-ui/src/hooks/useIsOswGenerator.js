import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../selectors";

export default function useIsOswGenerator() {
  const { roles = [] } = useSelector(getSelectedProjectGroup);
  return roles.includes("osw_data_generator");
}