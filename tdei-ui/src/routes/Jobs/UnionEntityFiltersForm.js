import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import style from './Jobs.module.css';
import { UNION_ENTITY_CONFIG, UNION_ENTITY_TYPES } from './UnionEntityFiltersForm.config';

export function makeDefaultEntityState() {
    return UNION_ENTITY_TYPES.reduce((acc, type) => {
        acc[type] = {
            enabled: false,
            filters: type === 'polygon' ? [{ '': '' }] : [],
            bufferWidth: '',
            overlapPct: '',
        };
        return acc;
    }, {});
}

export function formStateToFilters(entityState) {
    const result = {};
    UNION_ENTITY_TYPES.forEach((type) => {
        const s = entityState[type];
        const config = UNION_ENTITY_CONFIG[type];
        if (!s.enabled) return;

        const entry = {};
        const validFilters = s.filters.filter((filter) => {
            if (!filter || typeof filter !== 'object' || Array.isArray(filter)) return false;
            const entries = Object.entries(filter);
            return entries.length > 0 && entries.every(([key, value]) => (
                key.trim() !== '' && typeof value === 'string' && value.trim() !== ''
            ));
        });
        if (validFilters.length > 0) {
            entry.filters = validFilters.map((filter) => ({ ...filter }));
        }
        if (config.supportsBuffer && s.bufferWidth !== '') {
            const v = parseFloat(s.bufferWidth);
            if (!isNaN(v)) entry.duplicate_buffer_width = v;
        }
        if (config.supportsOverlap && s.overlapPct !== '') {
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

    UNION_ENTITY_TYPES.forEach((type) => {
        if (filters[type]) {
            const entry = filters[type];
            state[type].enabled = true;

            if (Array.isArray(entry.filters) && entry.filters.length > 0) {
                state[type].filters = entry.filters
                    .filter((filter) => filter && typeof filter === 'object' && !Array.isArray(filter))
                    .map((filter) => ({ ...filter }));
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
    proximity,
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

    const filtersMatch = (left, right) => {
        const leftKeys = Object.keys(left).sort();
        const rightKeys = Object.keys(right).sort();
        return leftKeys.length === rightKeys.length
            && leftKeys.every((key, index) => key === rightKeys[index] && left[key] === right[key]);
    };

    const togglePreset = (type, tags, checked) => {
        setEntityFormState((prev) => {
            const filters = prev[type].filters.filter((filter) => !filtersMatch(filter, tags));
            if (checked) filters.push({ ...tags });
            return { ...prev, [type]: { ...prev[type], filters } };
        });
    };

    const addPolygonFilter = () => {
        setEntityFormState((prev) => ({
            ...prev,
            polygon: {
                ...prev.polygon,
                filters: [...prev.polygon.filters, { '': '' }],
            },
        }));
    };

    const removePolygonFilter = (index) => {
        setEntityFormState((prev) => ({
            ...prev,
            polygon: {
                ...prev.polygon,
                filters: prev.polygon.filters.filter((_, filterIndex) => filterIndex !== index),
            },
        }));
    };

    const updatePolygonFilter = (index, field, value) => {
        setEntityFormState((prev) => {
            const filters = [...prev.polygon.filters];
            const [currentKey = '', currentValue = ''] = Object.entries(filters[index] || {})[0] || [];
            filters[index] = field === 'key'
                ? { [value]: currentValue }
                : { [currentKey]: value };
            return { ...prev, polygon: { ...prev.polygon, filters } };
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
        const config = UNION_ENTITY_CONFIG[type];
        const cardCopy = config.copy;
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
                                {cardCopy.filterLabel}{' '}
                                <span className={style.fieldHint} style={{ display: 'inline', fontStyle: 'normal' }}>
                                    (optional)
                                </span>
                            </legend>
                            {type === 'polygon' ? (
                                <>
                                    {s.filters.map((filter, index) => {
                                        const [key = '', value = ''] = Object.entries(filter)[0] || [];
                                        return (
                                            <div key={index} className={style.filterRow}>
                                                <Form.Control
                                                    className={style.filterInput}
                                                    placeholder="Key (e.g. building)"
                                                    value={key}
                                                    onChange={(e) => updatePolygonFilter(index, 'key', e.target.value)}
                                                    aria-label={`polygon tag filter ${index + 1} key`}
                                                    aria-describedby={filtersHelpId}
                                                    disabled={!s.enabled}
                                                />
                                                <Form.Control
                                                    className={style.filterInput}
                                                    placeholder="Value (e.g. yes)"
                                                    value={value}
                                                    onChange={(e) => updatePolygonFilter(index, 'value', e.target.value)}
                                                    aria-label={`polygon tag filter ${index + 1} value`}
                                                    aria-describedby={filtersHelpId}
                                                    disabled={!s.enabled}
                                                />
                                                <button
                                                    type="button"
                                                    className={style.removeBtn}
                                                    onClick={() => removePolygonFilter(index)}
                                                    disabled={!s.enabled || s.filters.length === 1}
                                                    aria-label={`Remove polygon filter ${index + 1}`}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        className={style.addBtn}
                                        onClick={addPolygonFilter}
                                        disabled={!s.enabled}
                                        aria-label="Add polygon tag filter"
                                    >
                                        + Add condition
                                    </button>
                                </>
                            ) : (
                                <div className={style.entityPresetGrid}>
                                    {config.presets.map((preset) => {
                                        const presetId = `${type}-${preset.name.toLowerCase().replace(/\s+/g, '-')}`;
                                        return (
                                            <Form.Check
                                                key={preset.name}
                                                id={presetId}
                                                type="checkbox"
                                                label={preset.name}
                                                checked={s.filters.some((filter) => filtersMatch(filter, preset.tags))}
                                                onChange={(e) => togglePreset(type, preset.tags, e.target.checked)}
                                                disabled={!s.enabled}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                            <span id={filtersHelpId} className={style.fieldHint}>
                                {cardCopy.filterHelp}
                            </span>
                        </fieldset>

                        <div className={style.formRow}>
                            {config.supportsBuffer && (
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
                                        placeholder={proximity || '0.5 (default)'}
                                        value={s.bufferWidth}
                                        onChange={(e) => updateEntityField(type, 'bufferWidth', e.target.value)}
                                        disabled={!s.enabled}
                                        aria-labelledby={`${sectionTitleId} ${bufferLabelId}`}
                                        aria-describedby={bufferHelpId}
                                    />
                                    <span id={bufferHelpId} className={style.fieldHint}>
                                        {cardCopy.bufferHelp}
                                    </span>
                                </Form.Group>
                            )}
                            {config.supportsOverlap && (
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
                                        placeholder={cardCopy.overlapPlaceholder}
                                        value={s.overlapPct}
                                        onChange={(e) => updateEntityField(type, 'overlapPct', e.target.value)}
                                        disabled={!s.enabled}
                                        aria-labelledby={`${sectionTitleId} ${overlapLabelId}`}
                                        aria-describedby={overlapHelpId}
                                    />
                                    <span id={overlapHelpId} className={style.fieldHint}>
                                        {cardCopy.overlapHelp}
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
                <Tab eventKey="json" title={<span style={{ fontWeight: 600 }}>JSON</span>} />
            </Tabs>

            <div className={`mb-3 ${style.fieldHint}`} style={{ marginTop: '0', textAlign: 'left' }}>
                Leave this section empty and every feature is eligible to merge with default settings. Tick a file type to restrict which of its features may merge, or to change how its duplicates are detected. File types you leave unticked keep the defaults.
            </div>

            {!isJsonMode ? (
                <div>
                    <p className={style.fieldHint} style={{ marginBottom: '16px' }}>
                        Filters control which features are merged. Features that do not match a filter are retained in the output and remain connected to the network.
                    </p>
                    {UNION_ENTITY_TYPES.map(renderEntitySection)}
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
