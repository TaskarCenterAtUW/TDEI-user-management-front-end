import {useMutation} from "react-query";
import {DEACTIVATE_DATASET} from "../../utils";
import {deleteDataset} from "../../services";

function useDeactivateDataset(mutationOptions) {
    return useMutation([DEACTIVATE_DATASET], deleteDataset, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data);
        },
        onError: (err) => {
            mutationOptions.onError(err);
        },
    });
}

export default useDeactivateDataset;
