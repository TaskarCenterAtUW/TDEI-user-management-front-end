import { useMutation } from "react-query";
import { downloadPGFeedbacksCSV, saveBlobAsFile } from "../../services";

export function useDownloadPGFeedbacks() {
  return useMutation(
    async (vars) => {
      const { blob, filename } = await downloadPGFeedbacksCSV(vars);
      saveBlobAsFile(blob, filename); 
      return { filename };
    }
  );
}
