import { useMutation } from 'react-query';
import { CREATE_SERVICE } from '../../utils';
import { postCreateService } from '../../services';

function useCreateService(mutationOptions) {
    return useMutation([CREATE_SERVICE], postCreateService, {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data)
        }, onError: (err) => {
            mutationOptions.onError(err)
        }
    })
}

export default useCreateService;