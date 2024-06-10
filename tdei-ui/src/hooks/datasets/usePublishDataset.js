import {useMutation} from "react-query";
import {PUBLISH_DATASETS} from "../../utils";
import {postPublishDataset} from "../../services";

function usePublishDataset(mutationOptions) {
    return useMutation([PUBLISH_DATASETS], postPublishDataset, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data);
        },
        onError: (err) => {
            mutationOptions.onError(err);
        },
    });
}

export default usePublishDataset;
