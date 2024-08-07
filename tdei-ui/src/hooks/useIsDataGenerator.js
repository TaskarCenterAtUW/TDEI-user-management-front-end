import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../selectors";

export default function useIsDataGenerator() {
  const { roles = [] } = useSelector(getSelectedProjectGroup);
  return roles.includes("flex_data_generator");
}