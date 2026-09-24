import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { UNION_ENTITY_FILTERS_SAMPLE } from '../../utils/constant';
import style from './Jobs.module.css';

const ENTITY_TYPES = ['edge', 'node', 'point', 'line', 'polygon', 'zone'];

const SUPPORTS_BUFFER = ['edge', 'line'];
const SUPPORTS_OVERLAP = ['edge', 'line', 'polygon', 'zone'];

export function makeDefaultEntityState() {
    return ENTITY_TYPES.reduce((acc, type) => {
        acc[type] = {
            enabled: false,
            filters: [{ key: '', value: '' }],
            bufferWidth: '',
            overlapPct: '',
        };
        return acc;
    }, {});
}

export function formStateToFilters(entityState) {
    const result = {};
    ENTITY_TYPES.forEach((type) => {
        const s = entityState[type];
        if (!s.enabled) return;

        const entry = {};
        const validFilters = s.filters.filter(
            (f) => f.key.trim() !== '' && f.value.trim() !== ''
        );
        if (validFilters.length > 0) {
            entry.filters = validFilters.map((f) => ({ [f.key.trim()]: f.value.trim() }));
        }
        if (SUPPORTS_BUFFER.includes(type) && s.bufferWidth !== '') {
            const v = parseFloat(s.bufferWidth);
            if (!isNaN(v)) entry.duplicate_buffer_width = v;
        }
        if (SUPPORTS_OVERLAP.includes(type) && s.overlapPct !== '') {
            const v = parseFloat(s.overlapPct);
            if (!isNaN(v)) entry.duplicate_overlap_percentage = v;
        }
        result[type] = entry;
    });
    return Object.keys(result).length > 0 ? result : null;
}

export function filtersToFormState(filters) {
    const state = makeDefaultEntityState();
    if (!filters || typeof filters !== 'object') return state;

    ENTITY_TYPES.forEach((type) => {
        if (filters[type]) {
            const entry = filters[type];
            state[type].enabled = true;

            if (Array.isArray(entry.filters) && entry.filters.length > 0) {
                state[type].filters = entry.filters.map((f) => {
                    const keys = Object.keys(f);
                    return { key: keys[0] || '', value: f[keys[0]] || '' };
                });
            }
            if (entry.duplicate_buffer_width !== undefined) {
                state[type].bufferWidth = String(entry.duplicate_buffer_width);
            }
            if (entry.duplicate_overlap_percentage !== undefined) {
                state[type].overlapPct = String(entry.duplicate_overlap_percentage);
            }
        }
    });
    return state;
}

const UnionEntityFiltersForm = ({
    isJsonMode,
    setIsJsonMode,
    entityFiltersJson,
    setEntityFiltersJson,
    entityFormState,
    setEntityFormState,
}) => {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (type) => {
        setOpenSections((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const updateEntityField = (type, field, value) => {
        setEntityFormState((prev) => ({
            ...prev,
            [type]: { ...prev[type], [field]: value },
        }));
    };

    const toggleEntityEnabled = (type, checked) => {
        setEntityFormState((prev) => ({
            ...prev,
            [type]: { ...prev[type], enabled: checked },
        }));
        if (checked) {
            setOpenSections((prev) => ({ ...prev, [type]: true }));
        }
    };

    const addFilter = (type) => {
        setEntityFormState((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                filters: [...prev[type].filters, { key: '', value: '' }],
            },
        }));
    };

    const removeFilter = (type, idx) => {
        setEntityFormState((prev) => {
            const newFilters = [...prev[type].filters];
            newFilters.splice(idx, 1);
            return { ...prev, [type]: { ...prev[type], filters: newFilters } };
        });
    };

    const updateFilter = (type, idx, field, value) => {
        setEntityFormState((prev) => {
            const newFilters = [...prev[type].filters];
            newFilters[idx] = { ...newFilters[idx], [field]: value };
            return { ...prev, [type]: { ...prev[type], filters: newFilters } };
        });
    };

    const handleModeSwitch = (isJson) => {
        if (isJson) {
            const filters = formStateToFilters(entityFormState);
            setEntityFiltersJson(filters ? JSON.stringify(filters, null, 2) : '');
        } else {
            try {
                if (entityFiltersJson.trim() === '') {
                    setEntityFormState(makeDefaultEntityState());
                } else {
                    const parsed = JSON.parse(entityFiltersJson);
                    setEntityFormState(filtersToFormState(parsed));
                }
            } catch (e) {
                console.warn('Invalid JSON in entity_filters', e);
            }
        }
        setIsJsonMode(isJson);
    };

    const renderEntitySection = (type) => {
        const s = entityFormState[type];
        const isOpen = Boolean(openSections[type]);
        const supportsBuffer = SUPPORTS_BUFFER.includes(type);
        const supportsOverlap = SUPPORTS_OVERLAP.includes(type);
        const sectionButtonId = `${type}-entity-filters-button`;
        const sectionPanelId = `${type}-entity-filters-panel`;
        const sectionTitleId = `${type}-entity-filters-title`;
        const filtersHelpId = `${type}-tag-filters-help`;
        const bufferLabelId = `${type}-buffer-width-label`;
        const bufferHelpId = `${type}-buffer-width-help`;
        const overlapLabelId = `${type}-overlap-label`;
        const overlapHelpId = `${type}-overlap-help`;

        return (
            <div
                key={type}
                className={`${style.spatialSection} ${style.entitySection}`}
            >
                <div className={style.entitySectionHeader}>
                    <Form.Check
                        type="checkbox"
                        id={`entity-enable-${type}`}
                        checked={s.enabled}
                        onChange={(e) => toggleEntityEnabled(type, e.target.checked)}
                        label={
                            <span className="visually-hidden">Enable {type} entity filters</span>
                        }
                        className={style.entityCheckbox}
                    />
                    <h3 className={style.entitySectionHeading}>
                        <button
                            id={sectionButtonId}
                            type="button"
                            onClick={() => toggleSection(type)}
                            aria-expanded={isOpen}
                            aria-controls={sectionPanelId}
                            className={style.entityCollapseBtn}
                            data-open={isOpen ? 'true' : 'false'}
                        >
                            <span id={sectionTitleId} className={style.entitySectionTitle}>{type}</span>
                            <span className={style.entityArrowContainer}>
                                <span data-arrow="downArrow" aria-hidden="true" className={`${style.entityArrowIcon} ${style.entityArrowDown}`} />
                                <span data-arrow="upArrow" aria-hidden="true" className={`${style.entityArrowIcon} ${style.entityArrowUp}`} />
                            </span>
                        </button>
                    </h3>
                </div>

                {isOpen && (
                    <div
                        id={sectionPanelId}
                        role="region"
                        aria-labelledby={sectionButtonId}
                        className={style.entitySectionPanel}
                    >
                        <fieldset className={style.entityFilterFieldset} aria-describedby={filtersHelpId}>
                            <legend className={style.entityFilterLegend}>
                                Tag Filters{' '}
                                <span className={style.fieldHint} style={{ display: 'inline', fontStyle: 'normal' }}>
                                    (optional)
                                </span>
                            </legend>
                            {s.filters.map((filter, idx) => (
                                <div key={idx} className={style.filterRow}>
                                    <Form.Control
                                        className={style.filterInput}
                                        placeholder="Key (e.g. highway)"
                                        value={filter.key}
                                        onChange={(e) => updateFilter(type, idx, 'key', e.target.value)}
                                        aria-label={`${type} tag filter ${idx + 1} key`}
                                        aria-describedby={filtersHelpId}
                                        disabled={!s.enabled}
                                    />
                                    <Form.Control
                                        className={style.filterInput}
                                        placeholder="Value (e.g. footway)"
                                        value={filter.value}
                                        onChange={(e) => updateFilter(type, idx, 'value', e.target.value)}
                                        aria-label={`${type} tag filter ${idx + 1} value`}
                                        aria-describedby={filtersHelpId}
                                        disabled={!s.enabled}
                                    />
                                    <button
                                        type="button"
                                        className={style.removeBtn}
                                        onClick={() => removeFilter(type, idx)}
                                        disabled={!s.enabled || s.filters.length === 1}
                                        aria-label={`Remove ${type} filter ${idx + 1}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div>
                                <button
                                    type="button"
                                    className={style.addBtn}
                                    onClick={() => addFilter(type)}
                                    disabled={!s.enabled}
                                    aria-label={`Add ${type} tag filter`}
                                >
                                    + Add Filter
                                </button>
                            </div>
                            <span id={filtersHelpId} className={style.fieldHint}>
                                Optional OSW tag key/value pairs to limit which features are eligible to merge. Blank rows are not sent.
                            </span>
                        </fieldset>

                        <div className={style.formRow}>
                            {supportsBuffer && (
                                <Form.Group className={style.formItem} controlId={`${type}-bufferWidth`}>
                                    <Form.Label id={bufferLabelId}>
                                        Duplicate Buffer Width (m){' '}
                                        <span className={style.fieldHint} style={{ display: 'inline', fontStyle: 'normal' }}>
                                            (optional)
                                        </span>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="any"
                                        placeholder="e.g. 2"
                                        value={s.bufferWidth}
                                        onChange={(e) => updateEntityField(type, 'bufferWidth', e.target.value)}
                                        disabled={!s.enabled}
                                        aria-labelledby={`${sectionTitleId} ${bufferLabelId}`}
                                        aria-describedby={bufferHelpId}
                                    />
                                    <span id={bufferHelpId} className={style.fieldHint}>
                                        Buffer distance (in meters) used to detect duplicate geometries. Leave blank to omit it.
                                    </span>
                                </Form.Group>
                            )}
                            {supportsOverlap && (
                                <Form.Group className={style.formItem} controlId={`${type}-overlapPct`}>
                                    <Form.Label id={overlapLabelId}>
                                        Duplicate Overlap %{' '}
                                        <span className={style.fieldHint} style={{ display: 'inline', fontStyle: 'normal' }}>
                                            (optional)
                                        </span>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="any"
                                        min="0"
                                        max="100"
                                        placeholder="e.g. 75"
                                        value={s.overlapPct}
                                        onChange={(e) => updateEntityField(type, 'overlapPct', e.target.value)}
                                        disabled={!s.enabled}
                                        aria-labelledby={`${sectionTitleId} ${overlapLabelId}`}
                                        aria-describedby={overlapHelpId}
                                    />
                                    <span id={overlapHelpId} className={style.fieldHint}>
                                        Minimum overlap % (0–100) used to treat two features as duplicates. Leave blank to omit it.
                                    </span>
                                </Form.Group>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={style.spatialFormContainer}>
            <Tabs
                activeKey={isJsonMode ? 'json' : 'form'}
                onSelect={(k) => handleModeSwitch(k === 'json')}
                className="mb-1"
            >
                <Tab eventKey="form" title={<span style={{ fontWeight: 600 }}>Form</span>} />
                <Tab eventKey="json" title={<span style={{ fontWeight: 600 }}>Json</span>} />
            </Tabs>

            <div className={`mb-3 ${style.fieldHint}`} style={{ marginTop: '0', textAlign: 'left' }}>
                This entire section and every property within it are optional. Blank properties are not sent. Use the form to configure entity filters per OSW type, or type the JSON directly. Inputs will automatically sync between the two views.
                {' '}You can also{' '}
                <button
                    type="button"
                    onClick={() => {
                        setEntityFiltersJson(JSON.stringify(UNION_ENTITY_FILTERS_SAMPLE, null, 2));
                        setIsJsonMode(true);
                    }}
                    className={style.inlineLinkButton}
                >
                    load the sample JSON
                </button>.
            </div>

            {!isJsonMode ? (
                <div>
                    <p className={style.fieldHint} style={{ marginBottom: '16px' }}>
                        Enable only the entity types you want to configure, then expand them to set any optional tag filters or duplicate-detection thresholds. Leave all unchecked to omit entity filters and merge all features.
                    </p>
                    {ENTITY_TYPES.map(renderEntitySection)}
                </div>
            ) : (
                <div style={{ marginTop: '10px' }}>
                    <Form.Label htmlFor="entityFiltersJson">
                        Entity Filters JSON{' '}
                        <span className={style.fieldHint} style={{ display: 'inline', fontStyle: 'normal' }}>
                            (optional - leave empty to merge all features)
                        </span>
                    </Form.Label>
                    <div className="jsonContent">
                        <Form.Control
                            id="entityFiltersJson"
                            as="textarea"
                            rows={18}
                            value={entityFiltersJson}
                            onChange={(e) => setEntityFiltersJson(e.target.value)}
                            placeholder={'{\n  "edge": { "filters": [...] }\n}'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnionEntityFiltersForm;
