import React, { useState } from 'react';
import styles from "./UploadDataset.module.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';


function ProjectGroupsList({ id, name, isSelected, handleSelectedProjectGroup }) {
    return (
        <div
            key={id}
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            onClick={() => handleSelectedProjectGroup(id)}
        >
            {isSelected ? <CheckCircleIcon style={{ color: "var(--primary-color)", fontSize: 20 }} /> : <RadioButtonUncheckedIcon style={{ color: "var(--primary-color)", fontSize: 20 }} />}
            <span style={{ marginLeft: "10px" }}>{name}</span>
        </div>
    );
}

export default ProjectGroupsList;