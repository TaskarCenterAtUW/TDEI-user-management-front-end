import { useSelector } from "react-redux";
import { getSelectedOrg } from "../selectors";
import { POC } from "../utils";

export default function useIsPoc() {
  const { roles = [] } = useSelector(getSelectedOrg);
  return roles.includes(POC);
}
