import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import style from "./Dropzone.module.css";
import uploadIcon from "./../../assets/img/upload-icon.svg";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from "@mui/material/IconButton";
import { show } from "../../store/notification.slice";
import { useDispatch } from "react-redux";
import JSZip from "jszip";

// Functional component Dropzone
function Dropzone({ onDrop, accept, format, selectedFile }) {
  const dispatch = useDispatch();
  const [myFiles, setMyFiles] = useState([]);
  const MAX_SIZE_MB = 1024;

  useEffect(() => {
    if (selectedFile instanceof File) {
      setMyFiles([selectedFile]);
    } else {
      setMyFiles([]);
    }
  }, [selectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: async (acceptedFiles) => {
      const totalSizeInMB = await calculateTotalUncompressedSize(acceptedFiles);
      if (totalSizeInMB > MAX_SIZE_MB) {
        dispatch(
          show({
            message:
              "The total size of dataset files in zip exceeds 1 GB upload limit.",
            type: "danger",
          })
        );
        return;
      }
      setMyFiles([...acceptedFiles]);
      onDrop(acceptedFiles);
    },
    maxFiles: 1,
    noClick: accept === "",
  });

  // Remove a file from the state
  const removeFile = (fileToRemove) => () => {
    const updatedFiles = myFiles.filter((file) => file !== fileToRemove);
    setMyFiles(updatedFiles);
    onDrop(updatedFiles);
  };

  // Convert bytes to megabytes for display
  const bytesToMB = (bytes) => {
    if (format === ".json") {
      return bytes;
    }
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  // Recursively calculate the uncompressed size of a ZIP file
  const getZipUncompressedSize = async (fileOrBlob) => {
    const jszip = new JSZip();
    let zip;
    try {
      zip = await jszip.loadAsync(fileOrBlob);
    } catch (e) {
      throw new Error("Error loading zip file");
    }
    let totalSize = 0;
    const entries = Object.values(zip.files);
    for (const entry of entries) {
      if (!entry.dir) {
        // If the entry is itself a ZIP file, process it recursively
        if (entry.name.toLowerCase().endsWith(".zip")) {
          const nestedBlob = await entry.async("blob");
          totalSize += await getZipUncompressedSize(nestedBlob);
        } else {
          if (typeof entry.uncompressedSize !== "undefined") {
            totalSize += entry.uncompressedSize;
          } else if (entry._data && entry._data.uncompressedSize) {
            totalSize += entry._data.uncompressedSize;
          } else {
            // Fallback
            const blob = await entry.async("blob");
            totalSize += blob.size;
          }
        }
      }
    }
    return totalSize;
  };

  // Calculate total uncompressed size for the dropped files.
  const calculateTotalUncompressedSize = async (files) => {
    let totalSize = 0;
    for (const file of files) {
      if (file.name.toLowerCase().endsWith(".zip")) {
        totalSize += await getZipUncompressedSize(file);
      } else {
        totalSize += file.size;
      }
    }
    return totalSize / (1024 * 1024);
  };

  const files = myFiles.map((file) => (
    <div key={file.path} className={style.file}>
      <div className={style.circle}>
        <InsertDriveFileOutlinedIcon sx={{ fontSize: "20px" }} />
      </div>
      <span className={style.fileTitle}>{file.path}</span>
      <span
        style={{
          color: "#CBCBD3",
          fontSize: "24px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        |
      </span>
      {bytesToMB(file.size)} {format === ".json" ? "bytes" : "MB"}
      <IconButton
        onClick={removeFile(file)}
        sx={{ marginLeft: "auto", marginRight: "10px" }}
      >
        <CancelIcon sx={{ color: "#D55962", fontSize: "20px" }} />
      </IconButton>
    </div>
  ));

  return (
    <div>
      <div {...getRootProps({ className: `${style.dropzone}` })}>
        <input {...getInputProps()} />
        <div>
          {isDragActive ? (
            <div className={style.dropFilesTitle}>
              Release to drop the files here
            </div>
          ) : (
            <div>
              <img src={uploadIcon} style={{ height: 20, marginBottom: "10px" }} />
              <div className={style.title}>
                Drop files here or click to upload.
              </div>
              <div className={style.subtile}>Allowed format {format}</div>
            </div>
          )}
        </div>
      </div>
      <aside>{myFiles.length > 0 ? files : <div></div>}</aside>
    </div>
  );
}

export default Dropzone;