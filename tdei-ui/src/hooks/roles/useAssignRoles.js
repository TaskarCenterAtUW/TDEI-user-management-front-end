import { useMutation } from 'react-query';
import {ASSIGN_ROLES } from '../../utils';
import { postAssignRoles } from '../../services';

function useAssignRoles(mutationOptions) {
    return useMutation([ASSIGN_ROLES], postAssignRoles , {
        ...mutationOptions,
        onSuccess: (data) => {
            mutationOptions.onSuccess(data)
        }, onError: (err) => {
            mutationOptions.onError(err)
        }
    })
}

export default useAssignRoles;