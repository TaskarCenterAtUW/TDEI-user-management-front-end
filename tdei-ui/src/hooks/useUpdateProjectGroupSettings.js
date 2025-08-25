import { useMutation } from "react-query";
import { updateProjectGroupDatasetViewerSettings } from "../services";

function useUpdateProjectGroupSettings(mutationOptions) {
  return useMutation(
    ({ projectGroupId, payload }) =>
      updateProjectGroupDatasetViewerSettings(projectGroupId, payload),
    {
      ...mutationOptions,
    }
  );
}

export default useUpdateProjectGroupSettings;
