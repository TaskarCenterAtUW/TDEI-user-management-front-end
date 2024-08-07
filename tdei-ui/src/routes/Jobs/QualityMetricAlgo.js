import React, { useState, useEffect } from "react";
import style from "./../Jobs/Jobs.module.css";
import Form from 'react-bootstrap/Form';
import Select from "react-select";

const QualityMetricAlgo = ({ onUpdate }) => {
    const [fixedChecked, setFixedChecked] = useState(false);
    const [randomChecked, setRandomChecked] = useState(false);
    const [persistValues, setPersistValues] = useState({
        fixed: null,
        random: null
    });

    const persistOptions = [
        { value: 'all', label: 'All' },
        { value: 'edges', label: 'Edges' },
        { value: 'nodes', label: 'Nodes' },
        { value: 'none', label: 'None' }
    ];

    const updateParent = (fixedChecked, randomChecked, persistValues) => {
        const updatedConfig = {
            algorithms: [],
            persist: {}
        };

        if (fixedChecked) {
            updatedConfig.algorithms.push('fixed');
            updatedConfig.persist.fixed = persistValues.fixed;
        }

        if (randomChecked) {
            updatedConfig.algorithms.push('random');
            updatedConfig.persist.random = persistValues.random;
        }
        // Remove null/none values from persist
        Object.keys(updatedConfig.persist).forEach(key => {
            if (updatedConfig.persist[key] === null || updatedConfig.persist[key] === "none") {
                delete updatedConfig.persist[key];
            }
        });

        onUpdate(updatedConfig);
    };

    useEffect(() => {
        updateParent(fixedChecked, randomChecked, persistValues);
    }, [fixedChecked, randomChecked, persistValues]);

    const handleFixedChange = () => {
        setFixedChecked(!fixedChecked);
        setPersistValues({
            ...persistValues,
            fixed: !fixedChecked ? persistValues.fixed : null
        });
    };

    const handleRandomChange = () => {
        setRandomChecked(!randomChecked);
        setPersistValues({
            ...persistValues,
            random: !randomChecked ? persistValues.random : null
        });
    };

    const handlePersistChange = (algorithm, selectedOption) => {
        setPersistValues({
            ...persistValues,
            [algorithm]: selectedOption ? selectedOption.value : null
        });
    };

    return (
        <div className={style.qualityMetricContainer}>
            <div className={style.qualityMetricHeader}>
                <div className="row">
                    <div className="col-3">
                        Algorithms
                    </div>
                    <div className="col-4">
                        Persistence
                    </div>
                </div>
            </div>
            <div className={style.jobStatusContainerContent}>
                <div className={style.qualityMetricContentRow}>
                    <div className="row">
                        <div className="col-3">
                            <div className={style.qualityMetricContentLabel}>
                                <Form>
                                    <Form.Check
                                        type='checkbox'
                                        id='fixed'
                                        label='Fixed'
                                        checked={fixedChecked}
                                        onChange={handleFixedChange}
                                    />
                                </Form>
                            </div>
                        </div>
                        <div className="col-8">
                            <Select
                                className={style.qualityMetricDropdown}
                                options={persistOptions}
                                placeholder="Select persist value"
                                isDisabled={!fixedChecked}
                                value={fixedChecked && persistValues.fixed ? persistOptions.find(option => option.value === persistValues.fixed) : null}
                                onChange={(selectedOption) => handlePersistChange('fixed', selectedOption)}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={style.qualityMetricContentRow}>
                    <div className="row">
                        <div className="col-3">
                            <div className={style.qualityMetricContentLabel}>
                                <Form>
                                    <Form.Check
                                        type='checkbox'
                                        id='random'
                                        label='Random'
                                        checked={randomChecked}
                                        onChange={handleRandomChange}
                                    />
                                </Form>
                            </div>
                        </div>
                        <div className="col-8">
                            <Select
                                className={style.qualityMetricDropdown}
                                options={persistOptions}
                                placeholder="Select persist value"
                                isDisabled={!randomChecked}
                                value={randomChecked && persistValues.random ? persistOptions.find(option => option.value === persistValues.random) : null}
                                onChange={(selectedOption) => handlePersistChange('random', selectedOption)}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QualityMetricAlgo;
