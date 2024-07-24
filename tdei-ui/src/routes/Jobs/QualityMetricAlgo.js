import React, { useState } from "react";
import style from "./../Jobs/Jobs.module.css";
import Form from 'react-bootstrap/Form';
import Select from "react-select";

const QualityMetricAlgo = () => {
    const [fixedChecked, setFixedChecked] = useState(false);
    const [randomChecked, setRandomChecked] = useState(false);

    const persistOptions = [
        { value: 'all', label: 'All' },
        { value: 'edges', label: 'Edges' },
        { value: 'nodes', label: 'Nodes' },
        { value: 'none', label: 'None' }
    ];

    const handleFixedChange = () => {
        setFixedChecked(!fixedChecked);
    };

    const handleRandomChange = () => {
        setRandomChecked(!randomChecked);
    };

    return (
        <div className={style.qualityMetricContainer}>
            <div className={style.qualityMetricHeader}>
                <div className="row">
                    <div className="col-3">
                        Algorithms
                    </div>
                    <div className="col-6">
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
                        <div className="col-8" >
                            <Select
                                className={style.qualityMetricDropdown}
                                options={persistOptions}
                                placeholder="Select persist value"
                                isDisabled={!fixedChecked}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 })}}
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
                                        menuPortalTarget={document.body}
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
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QualityMetricAlgo;
