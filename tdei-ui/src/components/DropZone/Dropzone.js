import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import style from "./Dropzone.module.css";
import uploadIcon from "./../../assets/img/upload-icon.svg";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from "@mui/material/IconButton";
import { show } from "../../store/notification.slice";
import { useDispatch } from "react-redux";

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
                dispatch(show({ message: "The total size of dataset files in zip exceeds 1 GB upload limit.", type: "danger" }));
                return;
            }
            setMyFiles([...acceptedFiles]);
            onDrop(acceptedFiles);
        },
        maxFiles: 1,
        noClick: accept === ""
    });
    // Function to remove a file from myFiles state
    const removeFile = fileToRemove => () => {
        const updatedFiles = myFiles.filter(file => file !== fileToRemove);
        setMyFiles(updatedFiles);
        onDrop(updatedFiles);
    };
    // Function to convert bytes to megabytes
    const bytesToMB = (bytes) => {
        if (format === ".json") {
            return bytes;
        }
        return (bytes / (1024 * 1024)).toFixed(2);
    };

    // Function to calculate the total uncompressed size of internal files
    const calculateTotalUncompressedSize = async (files) => {
        let totalSize = 0;
        for (const file of files) {
            const content = await readFile(file);
            totalSize += new Blob([content]).size;
        }
        return totalSize / (1024 * 1024);
    };

    // Helper function to read the file content as a promise
    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const files = myFiles.map((file) => (
        <div key={file.path} className={style.file}>
            <div className={style.circle}>
                <InsertDriveFileOutlinedIcon sx={{ fontSize: "20px" }} />
            </div>
            <span className={style.fileTitle}>{file.path}</span> <span style={{ color: "#CBCBD3", fontSize: "24px", paddingLeft: "15px", paddingRight: "15px" }}>|</span> {bytesToMB(file.size)} {format == ".json"? "bytes" : "MB"}
            <IconButton onClick={removeFile(file)} sx={{ marginLeft: "auto", marginRight: "10px" }}>
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
                            <div className={style.subtile}>
                                Allowed format {format}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <aside>
                {myFiles.length > 0 ? files : <div></div>}
            </aside>
        </div>
    );
}

export default Dropzone;