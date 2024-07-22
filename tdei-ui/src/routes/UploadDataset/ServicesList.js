import React, { useState } from 'react';
import styles from "./UploadDataset.module.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { toPascalCase } from "../../utils";

function ServicesList({ id, name, isSelected, serviceType, handleSelectedService }) {
    return (
        <div
            key={id}
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            onClick={() => handleSelectedService(id)}
        >
            {isSelected ? <CheckCircleIcon style={{ color: "var(--primary-color)", fontSize: 20 }} /> : <RadioButtonUncheckedIcon style={{ color: "var(--primary-color)", fontSize: 20 }} />}
            <span style={{ marginLeft: "10px" }}>{name}</span>
            <div className={styles.serviceTypeContainer}>
                <span className={styles.divider}>|</span>
                <span className={styles.serviceType}>{toPascalCase(serviceType)}</span>
            </div>

        </div>
    );
}

export default ServicesList;