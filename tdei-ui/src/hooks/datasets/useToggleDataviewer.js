import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { updateDataviewerPreferenceForDataset } from "../../services";
import { getSelectedProjectGroup } from "../../selectors";

// const useToggleDataviewer = ({ onSuccess, onError }) => {
//   const selectedProjectGroup = useSelector(getSelectedProjectGroup);
//   const tdei_project_group_id = selectedProjectGroup?.tdei_project_group_id;

//   const mutation = useMutation(
//     ({ tdei_dataset_id, data_viewer_allowed }) =>
//       updateDataviewerPreferenceForDataset(
//         tdei_dataset_id,
//         data_viewer_allowed
//       ),
//     {
//       onSuccess: (data) => {
//         mutationOptions.onSuccess(data);
//       },
//       onError: (err) => {
//         mutationOptions.onError(err);
//       },
//     }
//   );

//   return mutation;
// };

function useToggleDataviewer(mutationOptions) {
  return useMutation(
    ({ tdei_dataset_id, data_viewer_allowed }) =>
      updateDataviewerPreferenceForDataset(
        tdei_dataset_id,
        data_viewer_allowed
      ),
    {
      ...mutationOptions,
    }
  );
}

export default useToggleDataviewer;
