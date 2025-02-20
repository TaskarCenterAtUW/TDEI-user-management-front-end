import { useSelector } from "react-redux";
import { getSelectedProjectGroup } from "../../selectors";

export default function useIsMember() {
  const { roles = [] } = useSelector(getSelectedProjectGroup);
  return roles.includes("member");
}
