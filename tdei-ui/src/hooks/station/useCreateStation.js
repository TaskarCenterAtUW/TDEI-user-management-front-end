import { useMutation } from 'react-query';
import { CREATE_STATION } from '../../utils';
import { postCreateService } from '../../services';

function useCreateStation(mutationOptions) {
    return useMutation([CREATE_STATION], postCreateService, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data)
        }, onError: (err) => {
            mutationOptions.onError(err)
        }
    })
}

export default useCreateStation;