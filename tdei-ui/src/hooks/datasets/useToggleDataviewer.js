import { useState } from "react";
import { useSelector } from "react-redux";
import { updateDataviewerPreferenceForDataset } from "../../services";
import { getSelectedProjectGroup } from "../../selectors";
import { useMutation } from "react-query";

function useToggleDataviewer() {
  const { tdei_project_group_id } = useSelector(getSelectedProjectGroup);
  const [isDataviewerEnabled, setIsDataviewerEnabled] = useState(false);

  const toggleDataviewer = useMutation(
    (datasetId) => updateDataviewerPreferenceForDataset(datasetId, tdei_project_group_id, isDataviewerEnabled),
    {
      onSuccess: () => {
        setIsDataviewerEnabled((prev) => !prev);
      },
    }
  );

  return { isDataviewerEnabled, toggleDataviewer };
}

export default useToggleDataviewer;