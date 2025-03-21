import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../selectors";

//Custom hook to check if the user has the "<data_type>_data_generator" role.
export default function useIsDataTypeGenerator(data_type) {
  const { roles = [] } = useSelector(getSelectedProjectGroup);
  return roles.includes(`${data_type}_data_generator`);
}
