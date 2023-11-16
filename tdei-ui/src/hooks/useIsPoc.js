import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../selectors";
import { POC } from "../utils";

export default function useIsPoc() {
  const { roles = [] } = useSelector(getSelectedProjectGroup);
  return roles.includes(POC);
}
