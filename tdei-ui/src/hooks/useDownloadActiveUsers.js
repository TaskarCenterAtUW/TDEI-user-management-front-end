import {useMutation} from "react-query";
import { downloadUsers } from "../services";
import { saveBlobAsFile } from "../services";

export default function useDownloadActiveUsers() {
  return useMutation({
    mutationFn: async () => {
      const { blob, filename } = await downloadUsers();
      const safeName = filename || "active-users.csv";
      saveBlobAsFile(blob, safeName);
      return { filename: safeName };
    },
  });
}