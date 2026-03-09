import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { SPATIAL_JOIN } from "../../utils";
import style from './Jobs.module.css';

const SpatialJoinForm = ({
    isSpatialJsonMode,
    setIsSpatialJsonMode,
    spatialTargetDatasetId,
    setSpatialTargetDatasetId,
    spatialSourceDatasetId,
    setSpatialSourceDatasetId,
    spatialAssignmentMethod,
    setSpatialAssignmentMethod,
    spatialAssignmentOptions,
    spatialTargetDimension,
    setSpatialTargetDimension,
    spatialSourceDimension,
    setSpatialSourceDimension,
    targetDimensionOptions,
    sourceDimensionOptions,
    spatialJoinCondition,
    setSpatialJoinCondition,
    spatialTargetFilters,
    setSpatialTargetFilters,
    spatialSourceFilters,
    setSpatialSourceFilters,
    spatialAggregate,
    setSpatialAggregate,
    spatialRequestBody,
    setSpatialRequestBody,
    handleShow
}) => {
    const spatialGuideUrl = process.env.REACT_APP_SPATIAL_GUIDE_URL;

    const handleAddFilter = (type) => {
        if (type === 'target') {
            setSpatialTargetFilters([...spatialTargetFilters, { key: "", value: "" }]);
        } else {
            setSpatialSourceFilters([...spatialSourceFilters, { key: "", value: "" }]);
        }
    };

    const handleRemoveFilter = (type, index) => {
        if (type === 'target') {
            const newFilters = [...spatialTargetFilters];
            newFilters.splice(index, 1);
            setSpatialTargetFilters(newFilters);
        } else {
            const newFilters = [...spatialSourceFilters];
            newFilters.splice(index, 1);
            setSpatialSourceFilters(newFilters);
        }
    };

    const handleFilterChange = (type, index, field, value) => {
        if (type === 'target') {
            const newFilters = [...spatialTargetFilters];
            newFilters[index][field] = value;
            setSpatialTargetFilters(newFilters);
        } else {
            const newFilters = [...spatialSourceFilters];
            newFilters[index][field] = value;
            setSpatialSourceFilters(newFilters);
        }
    };

    const handleAddAggregate = () => {
        setSpatialAggregate([...spatialAggregate, { value: "" }]);
    };

    const handleRemoveAggregate = (index) => {
        const newAggregates = [...spatialAggregate];
        newAggregates.splice(index, 1);
        setSpatialAggregate(newAggregates);
    };

    const handleAggregateChange = (index, value) => {
        const newAggregates = [...spatialAggregate];
        newAggregates[index].value = value;
        setSpatialAggregate(newAggregates);
    };

    const handleModeSwitch = (isJson) => {
        setIsSpatialJsonMode(isJson);
    };


    return (
        <div className={style.spatialFormContainer}>
            <div className={style.modeToggleContainer}>
                <div className={style.segmentedControl}>
                    <div className={`${style.slider} ${isSpatialJsonMode ? style.sliderRight : ""}`}></div>
                    <button
                        type="button"
                        className={!isSpatialJsonMode ? style.activeBtn : ""}
                        onClick={() => handleModeSwitch(false)}
                    >
                        Form
                    </button>
                    <button
                        type="button"
                        className={isSpatialJsonMode ? style.activeBtn : ""}
                        onClick={() => handleModeSwitch(true)}
                    >
                        Json
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="tdei-hint-text">
                    Check out the sample request{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); handleShow(); }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                        here
                    </a>
                    {spatialGuideUrl && (
                        <>
                            {' '}and the{' '}
                            <a href={spatialGuideUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                Spatial Join Guide
                            </a>
                            {' '}for more details.
                        </>
                    )}
                </div>
            </div>

            {!isSpatialJsonMode ? (
                <>
                    <div className={style.spatialSection}>
                        <h3 className={style.spatialSectionTitle}>Datasets</h3>
                        <div className={style.formRow} style={{ marginBottom: '20px' }}>
                            <Form.Group className={style.formItem} controlId="spatialTargetDatasetId">
                                <Form.Label>Target Dataset Id <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Target Dataset Id"
                                    value={spatialTargetDatasetId}
                                    onChange={(e) => setSpatialTargetDatasetId(e.target.value)}
                                    aria-describedby="targetDatasetHint"
                                />
                                <span id="targetDatasetHint" className={style.fieldHint}>Unique dataset id defined in TDEI system</span>
                            </Form.Group>
                            <Form.Group className={style.formItem} controlId="spatialSourceDatasetId">
                                <Form.Label>Source Dataset Id <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Source Dataset Id"
                                    value={spatialSourceDatasetId}
                                    onChange={(e) => setSpatialSourceDatasetId(e.target.value)}
                                    aria-describedby="sourceDatasetHint"
                                />
                                <span id="sourceDatasetHint" className={style.fieldHint}>Unique dataset id defined in TDEI system</span>
                            </Form.Group>
                        </div>
                    </div>

                    <div className={style.spatialSection}>
                        <h3 className={style.spatialSectionTitle}>Configuration</h3>
                        <div className={style.formRow} style={{ marginBottom: '20px' }}>
                            <div className={style.formItem}>
                                <label htmlFor="assignmentMethod" className={style.formLabelP}>Assignment Method <span style={{ color: 'red' }}>*</span></label>
                                <Select
                                    inputId="assignmentMethod"
                                    isSearchable={false}
                                    className={style.selectFieldCommon}
                                    value={spatialAssignmentMethod}
                                    options={spatialAssignmentOptions}
                                    placeholder="Select Method"
                                    onChange={setSpatialAssignmentMethod}
                                    aria-describedby="assignmentMethodHint"
                                />
                                <span id="assignmentMethodHint" className={style.fieldHint}>How to handle matching records.</span>
                            </div>
                            <div className={style.formItem}>
                                <label htmlFor="targetDimension" className={style.formLabelP}>Target Dimension <span style={{ color: 'red' }}>*</span></label>
                                <Select
                                    inputId="targetDimension"
                                    isSearchable={false}
                                    className={style.selectFieldCommon}
                                    value={spatialTargetDimension}
                                    options={targetDimensionOptions}
                                    placeholder="Select Dimension"
                                    onChange={setSpatialTargetDimension}
                                    aria-describedby="targetDimensionHint"
                                />
                                <span id="targetDimensionHint" className={style.fieldHint}>Valid opensidewalks core entity on which the join operation is to be performed</span>
                            </div>
                            <div className={style.formItem}>
                                <label htmlFor="sourceDimension" className={style.formLabelP}>Source Dimension <span style={{ color: 'red' }}>*</span></label>
                                <Select
                                    inputId="sourceDimension"
                                    isSearchable={false}
                                    className={style.selectFieldCommon}
                                    value={spatialSourceDimension}
                                    options={sourceDimensionOptions}
                                    placeholder="Select Dimension"
                                    onChange={setSpatialSourceDimension}
                                    aria-describedby="sourceDimensionHint"
                                />
                                <span id="sourceDimensionHint" className={style.fieldHint}>Valid opensidewalks core entity on which the join operation is to be performed</span>
                            </div>
                        </div>

                        <Form.Group style={{ marginBottom: '20px' }} controlId="spatialJoinCondition">
                            <Form.Label>Join Condition <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Join Condition (e.g. ST_Intersects(...))"
                                value={spatialJoinCondition}
                                onChange={(e) => setSpatialJoinCondition(e.target.value)}
                                aria-describedby="joinConditionHint"
                            />
                            <span id="joinConditionHint" className={style.fieldHint}>Condition on which target and source geometry will join. geometry_target & geometry_source are constant variable representing the element geometry.</span>
                        </Form.Group>
                    </div>

                    <div className={style.spatialSection}>
                        <h3 className={style.spatialSectionTitle}>Filters & Aggregates</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <Form.Label>Join Filter Target</Form.Label>
                            {spatialTargetFilters.map((filter, index) => (
                                <div key={`target-${index}`} className={style.filterRow}>
                                    <Form.Control
                                        className={style.filterInput}
                                        placeholder="Key"
                                        value={filter.key}
                                        onChange={(e) => handleFilterChange('target', index, 'key', e.target.value)}
                                        aria-label={`Target filter ${index + 1} key`}
                                    />
                                    <Form.Control
                                        className={style.filterInput}
                                        placeholder="Value"
                                        value={filter.value}
                                        onChange={(e) => handleFilterChange('target', index, 'value', e.target.value)}
                                        aria-label={`Target filter ${index + 1} value`}
                                    />
                                    <button
                                        type="button"
                                        className={style.removeBtn}
                                        onClick={() => handleRemoveFilter('target', index)}
                                        aria-label={`Remove Target filter ${index + 1}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div>
                                <button type="button" className={style.addBtn} aria-label="Add Target Filter" onClick={() => handleAddFilter('target')}>+ Add Target Filter</button>
                            </div>
                            <span className={style.fieldHint}>Target attribute filters. These can be any valid attributes defined in the OpenSidewalks schema for the entity.</span>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <Form.Label>Join Filter Source</Form.Label>
                            {spatialSourceFilters.map((filter, index) => (
                                <div key={`source-${index}`} className={style.filterRow}>
                                    <Form.Control
                                        className={style.filterInput}
                                        placeholder="Key"
                                        value={filter.key}
                                        onChange={(e) => handleFilterChange('source', index, 'key', e.target.value)}
                                        aria-label={`Source filter ${index + 1} key`}
                                    />
                                    <Form.Control
                                        className={style.filterInput}
                                        placeholder="Value"
                                        value={filter.value}
                                        onChange={(e) => handleFilterChange('source', index, 'value', e.target.value)}
                                        aria-label={`Source filter ${index + 1} value`}
                                    />
                                    <button
                                        type="button"
                                        className={style.removeBtn}
                                        onClick={() => handleRemoveFilter('source', index)}
                                        aria-label={`Remove Source filter ${index + 1}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div>
                                <button type="button" className={style.addBtn} aria-label="Add Source Filter" onClick={() => handleAddFilter('source')}>+ Add Source Filter</button>
                            </div>
                            <span className={style.fieldHint}>Source attribute filters, These can be any valid attributes defined in the OpenSidewalks schema for the entity</span>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <Form.Label>Aggregate</Form.Label>
                            {spatialAggregate.map((agg, index) => (
                                <div key={`agg-${index}`} className={style.filterRow}>
                                    <Form.Control
                                        className={style.filterInput}
                                        placeholder="ARRAY_AGG(field) as alias"
                                        value={agg.value}
                                        onChange={(e) => handleAggregateChange(index, e.target.value)}
                                        aria-label={`Aggregate expression ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        className={style.removeBtn}
                                        onClick={() => handleRemoveAggregate(index)}
                                        aria-label={`Remove Aggregate expression ${index + 1}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div>
                                <button type="button" className={style.addBtn} aria-label="Add Aggregate expression" onClick={handleAddAggregate}>+ Add Aggregate</button>
                            </div>
                            <span className={style.fieldHint}>Agrregate function for attribute. Attribute information to be pulled along from source and attach to target dataset entity. All attribute_name/alias will be prefixed with 'ext:'</span>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    <Form.Label htmlFor="spatialRequestBodyJson">Spatial join operation request body <span style={{ color: 'red' }}> *</span></Form.Label>
                    <div className="jsonContent">
                        <Form.Control
                            id="spatialRequestBodyJson"
                            as="textarea"
                            name="Spatial join operation request body"
                            onChange={(e) => setSpatialRequestBody(e.target.value)}
                            value={spatialRequestBody}
                            rows={15}
                            aria-label="Spatial join JSON payload text area"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpatialJoinForm;
