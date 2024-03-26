import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import style from "./Dropzone.module.css";
import uploadIcon from "./../../assets/img/upload-icon.svg";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from "@mui/material/IconButton";

function Dropzone({ onDrop, accept, open, format }) {

    const [myFiles, setMyFiles] = useState([]);
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
        useDropzone({
            accept,
            onDrop: (acceptedFiles) => {
                setMyFiles([...acceptedFiles]);
                onDrop(acceptedFiles);
            },
            maxFiles: 1
        });


    const removeFile = fileToRemove => () => {
        const updatedFiles = myFiles.filter(file => file !== fileToRemove);
        setMyFiles(updatedFiles);
        onDrop(updatedFiles);
    };
    // To Convert bytes to megabytes
    const bytesToMB = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2);
    };

    const files = myFiles.map((file) => (
        <div key={file.path} className={style.file}>
            <div class={style.circle}>
                <InsertDriveFileOutlinedIcon sx={{fontSize:"20px"}}/>
            </div>
            <span className={style.fileTitle}>{file.path}</span> <span style={{ color: "#CBCBD3", fontSize: "24px", paddingLeft: "15px", paddingRight: "15px" }}>|</span> {bytesToMB(file.size)} MB
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
                        <p>
                            Release to drop the files here
                        </p>
                    ) : (
                        <div>
                            <img src={uploadIcon} style={{ height: 20, marginBottom: "10px" }} />
                            <p className={style.title}>
                                Drop files here or click to upload.
                            </p>
                            <p className={style.subtile}>
                                Allowed format {format}
                            </p>
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
