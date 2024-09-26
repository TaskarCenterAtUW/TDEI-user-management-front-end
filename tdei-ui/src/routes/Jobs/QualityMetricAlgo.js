import React, { useState, useEffect } from "react";
import style from "./../Jobs/Jobs.module.css";
import Select from "react-select";

const QualityMetricAlgo = ({ onUpdate }) => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

    const algorithmOptions = [
        { value: 'fixed', label: 'Fixed' },
        { value: 'ixn', label: 'Intersection' }
    ];

    const updateParent = (selectedAlgorithm) => {
        const updatedConfig = selectedAlgorithm ? selectedAlgorithm.value : null
        onUpdate(updatedConfig);
    };

    useEffect(() => {
        updateParent(selectedAlgorithm);
    }, [selectedAlgorithm]);

    const handleAlgorithmChange = (selectedOption) => {
        setSelectedAlgorithm(selectedOption);
    };

    return (
        <div >
                <Select
                    className={style.createJobSelectType}
                    options={algorithmOptions}
                    placeholder="Select algorithm"
                    value={selectedAlgorithm}
                    onChange={handleAlgorithmChange}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    components={{
                        IndicatorSeparator: () => null
                    }}
                />
            </div>
    );
};

export default QualityMetricAlgo;
