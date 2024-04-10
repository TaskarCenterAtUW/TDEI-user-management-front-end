import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../selectors";

export default function useIsDatasetsAccessible() {
  const { roles = [] } = useSelector(getSelectedProjectGroup);
  return roles.includes("poc") || roles.includes("flex_data_generator") || roles.includes("osw_data_generator") || roles.includes("pathways_data_generator");
}
