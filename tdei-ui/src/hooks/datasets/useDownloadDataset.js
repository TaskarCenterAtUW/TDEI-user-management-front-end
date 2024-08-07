import {useMutation} from "react-query";
import {DOWNLOAD_DATASET} from "../../utils";
import { downloadDataset } from "../../services";

function useDownloadDataset(mutationOptions) {
    return useMutation([DOWNLOAD_DATASET], downloadDataset, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data);
        },
        onError: (err) => {
            mutationOptions.onError(err);
        },
    });
}

export default useDownloadDataset;
