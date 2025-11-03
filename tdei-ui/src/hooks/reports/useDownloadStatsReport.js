import { useMutation } from "react-query";
import { downloadStatsExport } from "../../services/apiServices";
import { saveBlobAsFile } from "../../services/apiServices";

export function useDownloadStatsReport() {
  return useMutation({
    mutationFn: async (params) => {
      const { blob, filename } = await downloadStatsExport(params);
      saveBlobAsFile(blob, filename); 
      return { filename };
    },
  });
}
