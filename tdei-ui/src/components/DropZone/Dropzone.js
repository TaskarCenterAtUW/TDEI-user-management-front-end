import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import style from "./Dropzone.module.css";
import uploadIcon from "./../../assets/img/upload-icon.svg";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from "@mui/material/IconButton";

// Functional component Dropzone
function Dropzone({ onDrop, accept, format, selectedFile }) {
    const [myFiles, setMyFiles] = useState([]);
    // Effect hook to update files when selectedFile prop changes
    useEffect(() => {
        if (selectedFile instanceof File) {
            setMyFiles([selectedFile]);
        } else {
            setMyFiles([]);
        }
    }, [selectedFile]);
    // Dropzone hook to manage file drop functionality
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        onDrop: (acceptedFiles) => {
            setMyFiles([...acceptedFiles]);
            onDrop(acceptedFiles);
        },
        maxFiles: 1
    });
    // Function to remove a file from myFiles state
    const removeFile = fileToRemove => () => {
        const updatedFiles = myFiles.filter(file => file !== fileToRemove);
        setMyFiles(updatedFiles);
        onDrop(updatedFiles);
    };
    // Function to convert bytes to megabytes
    const bytesToMB = (bytes) => {
        if(format == ".json"){
            return bytes
        }
        return (bytes / (1024 * 1024)).toFixed(2);
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