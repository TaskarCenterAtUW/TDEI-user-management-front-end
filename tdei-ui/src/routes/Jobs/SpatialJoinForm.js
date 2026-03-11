import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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
    // Helper to format filters for the JSON payload
    const formatFilters = (filters) => {
        return filters
            .filter(f => f.key.trim() !== "" && f.value.trim() !== "")
            .map(f => `${f.key}='${f.value}'`)
            .join(" AND ");
    };

    // Helper to parse SQL string filters ("key='value' AND key2='value2'") back to UI array state
    const parseFilters = (filterString) => {
        if (!filterString) return [{ key: "", value: "" }];
        const conditions = filterString.split(" AND ");
        const parsed = conditions.map(cond => {
            const parts = cond.split("=");
            if (parts.length === 2) {
                return { key: parts[0].trim(), value: parts[1].replace(/^'|'$/g, "").trim() };
            }
            return { key: "", value: "" };
        });
        return parsed.length > 0 ? parsed : [{ key: "", value: "" }];
    };

    const handleModeSwitch = (isJson) => {
        if (isJson) {
            // Form -> JSON
            const formattedAggregates = spatialAggregate
                .map(a => a.value.trim())
                .filter(a => a !== "");

            const payload = {
                target_dataset_id: spatialTargetDatasetId,
                target_dimension: spatialTargetDimension?.value || "",
                source_dataset_id: spatialSourceDatasetId,
                source_dimension: spatialSourceDimension?.value || "",
                join_condition: spatialJoinCondition,
                join_filter_target: formatFilters(spatialTargetFilters),
                join_filter_source: formatFilters(spatialSourceFilters),
                aggregate: formattedAggregates,
                assignment_method: spatialAssignmentMethod?.value || 'default'
            };
            setSpatialRequestBody(JSON.stringify(payload, null, 2));
        } else {
            // JSON -> Form
            try {
                const parsed = JSON.parse(spatialRequestBody);

                if (parsed.target_dataset_id !== undefined) setSpatialTargetDatasetId(parsed.target_dataset_id);
                if (parsed.source_dataset_id !== undefined) setSpatialSourceDatasetId(parsed.source_dataset_id);

                if (parsed.target_dimension) {
                    const match = targetDimensionOptions.find(o => o.value === parsed.target_dimension);
                    if (match) setSpatialTargetDimension(match);
                }
                if (parsed.source_dimension) {
                    const match = sourceDimensionOptions.find(o => o.value === parsed.source_dimension);
                    if (match) setSpatialSourceDimension(match);
                }

                if (parsed.join_condition !== undefined) setSpatialJoinCondition(parsed.join_condition);

                if (parsed.join_filter_target !== undefined) setSpatialTargetFilters(parseFilters(parsed.join_filter_target));
                if (parsed.join_filter_source !== undefined) setSpatialSourceFilters(parseFilters(parsed.join_filter_source));

                if (Array.isArray(parsed.aggregate) && parsed.aggregate.length > 0) {
                    setSpatialAggregate(parsed.aggregate.map(val => ({ value: val })));
                } else {
                    setSpatialAggregate([{ value: "" }]);
                }

                if (parsed.assignment_method) {
                    const match = spatialAssignmentOptions.find(o => o.value === parsed.assignment_method);
                    if (match) setSpatialAssignmentMethod(match);
                } else {
                    setSpatialAssignmentMethod({ value: 'default', label: 'Default' });
                }

            } catch (e) {
                // If the user formulated invalid JSON, we can't reliably sync it back to the form state.
                // It's safest to just ignore and let them correct it or wipe it.
                console.warn("Invalid JSON in request body to parse back to form state", e);
            }
        }
        setIsSpatialJsonMode(isJson);
    };


    return (
        <div className={style.spatialFormContainer}>
            <Tabs
                activeKey={isSpatialJsonMode ? 'json' : 'form'}
                onSelect={(k) => handleModeSwitch(k === 'json')}
                className="mb-1"
            >
                <Tab eventKey="form" title={<span style={{ fontWeight: 600 }}>Form</span>}>
                </Tab>
                <Tab eventKey="json" title={<span style={{ fontWeight: 600 }}>Json</span>}>
                </Tab>
            </Tabs>
            <div className={`mb-3 ${style.fieldHint}`} style={{ marginTop: '0', textAlign: 'left' }}>
                Either use the Form fields below or type directly in Json format. Inputs will automatically sync between the two views.
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
