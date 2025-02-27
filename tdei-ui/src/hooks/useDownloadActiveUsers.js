import {useMutation} from "react-query";
import { downloadUsers } from "../services";
import { useDispatch } from "react-redux";
import { show } from "../store/notificationModal.slice";

const useDownloadUsers = () => {
    const dispatch = useDispatch();
    return useMutation(downloadUsers, {
      onSuccess: () => {
        dispatch(show({ message: "Active users downloaded successfully", type: "success" }));
      },
      onError: (error) => {
        dispatch(show({ message: error.message, type: "danger" }));
      },
    });
  };

export default useDownloadUsers;
