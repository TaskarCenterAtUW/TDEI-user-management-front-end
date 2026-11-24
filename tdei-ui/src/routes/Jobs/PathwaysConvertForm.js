import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import Dropzone from '../../components/DropZone/Dropzone';
import style from './Jobs.module.css';

export const PATHWAYS_CONVERT_DESCRIPTION = "Converts station drawings into GTFS Pathways, ready to review and edit in Workspaces. Give either a zip of DXF drawings (one file per level) or an ArcGIS map service. The result is a zip with each station's nodes, edges and zones, a report, and reference data for each level.";

const drawingsSourceOptions = [
    { value: 'dxf', label: 'DXF drawings (.zip)' },
    { value: 'arcgis', label: 'ArcGIS map service' }
];

export const makeDefaultConvertOptions = () => ({
    source: drawingsSourceOptions[0],
    arcgis_url: "",
    layers: "",
    level_pattern: "",
    crs: "",
    advanced: false,
    control: "",
    station: "",
    agency_gtfs_dataset_id: "",
    parent_station: "",
    platforms: ""
});

const commaList = (text) => text.split(",").map(s => s.trim()).filter(s => s !== "");

/**
 * Turns the form's state into the convert request's form fields.
 * Returns { error } when the form is incomplete or an option is malformed, otherwise
 * { fields, file }, where `file` is the DXF zip to upload (null for an ArcGIS service).
 */
export const buildConvertRequest = (options, selectedFile) => {
    const fields = {};
    const isDxf = options.source.value === 'dxf';
    if (isDxf) {
        if (!selectedFile) return { error: "Attach a zip of DXF drawings" };
        fields.level_pattern = options.level_pattern.trim();
        fields.crs = options.crs.trim();
        // Advanced settings are sent only while Advanced is on, so hidden values never go with the job.
        if (options.advanced) {
            const control = options.control.split("\n").map(s => s.trim()).filter(s => s !== "");
            if (control.length > 0) fields.control = JSON.stringify(control);
        }
    } else {
        if (!options.arcgis_url.trim()) return { error: "Map service URL is required for an ArcGIS map service" };
        fields.arcgis_url = options.arcgis_url.trim();
        if (options.advanced) fields.layers = options.layers.trim();
    }
    fields.agency_gtfs_dataset_id = options.agency_gtfs_dataset_id.trim();
    if (options.advanced) {
        fields.station = options.station.trim();
        fields.parent_station = options.parent_station.trim();
        const platforms = commaList(options.platforms);
        if (platforms.length > 0) fields.platforms = JSON.stringify(platforms);
    }

    Object.keys(fields).forEach(key => { if (fields[key] === "") delete fields[key]; });
    return { fields, file: isDxf ? selectedFile : null };
};

/**
 * The fields of the Pathways - Convert job: where the drawings come from, and the
 * optional settings the converter takes (see TDEI-python-pathways-converter's docs/job-messages.md).
 */
const PathwaysConvertForm = ({ convertOptions, setConvertOptions, selectedFile, onDrop }) => {
    const set = (key) => (e) => setConvertOptions({ ...convertOptions, [key]: e.target.value });
    const isDxf = convertOptions.source.value === 'dxf';

    const textField = (key, label, hint, { placeholder, required, as, rows } = {}) => (
        <Form.Group key={key} controlId={`pathways-convert-${key}`} className={style.formItem}>
            <Form.Label>
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </Form.Label>
            <Form.Control
                type="text"
                as={as}
                rows={rows}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                onChange={set(key)}
                value={convertOptions[key]}
            />
            <div className="d-flex align-items-start mt-2">
                <Form.Text className={style.description}>{hint}</Form.Text>
            </div>
        </Form.Group>
    );

    return (
        <>
            <div className={style.formItem}>
                <label htmlFor="pathways-convert-source" className={style.formLabelP}>Input Type<span style={{ color: 'red' }}> *</span></label>
                <Select
                    inputId="pathways-convert-source"
                    isSearchable={false}
                    className={style.selectFieldCommon}
                    value={convertOptions.source}
                    options={drawingsSourceOptions}
                    onChange={(value) => setConvertOptions({ ...convertOptions, source: value })}
                />
            </div>

            {isDxf ? (
                <>
                    <div className={style.formItems}>
                        <p className={style.formLabelP}>DXF drawings zip file<span style={{ color: 'red' }}> *</span></p>
                        <Dropzone
                            onDrop={onDrop}
                            accept={{ 'application/zip': ['.zip'] }}
                            format=".zip"
                            selectedFile={selectedFile}
                            dataType="pathways"
                        />
                        <div className="d-flex align-items-start mt-2">
                            <Form.Text className={style.description}>
                                A zip of one station's DXF files, one per level. Every file is read as a level of the same station, <strong>so convert each station in its own job</strong>. Folders inside the zip are fine, but each file needs a different name.
                            </Form.Text>
                        </div>
                    </div>
                    {textField("level_pattern", "Level filename pattern",
                        "A regular expression on the file name whose first group is the level name. For example, _(\\w+)$ reads \"Platform\" from Station_Platform.dxf.",
                        { placeholder: "_(\\w+)$" })}
                    {textField("crs", "Coordinate system",
                        <>
                            The coordinate system the drawings are in, when they don't carry their own location. Look up its EPSG code at{" "}
                            <a href="https://epsg.io/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', cursor: 'pointer' }}>epsg.io</a>.
                        </>,
                        { placeholder: "EPSG:2926" })}
                </>
            ) : (
                <>
                    {textField("arcgis_url", "Map service URL",
                        "A public https ArcGIS MapServer or FeatureServer URL. It can hold several stations, one per group of layers, and each is converted separately.",
                        { placeholder: "https://…/arcgis/rest/services/…/MapServer", required: true })}
                </>
            )}

            {textField("agency_gtfs_dataset_id", "Agency GTFS dataset ID on TDEI",
                "Recommended. A TDEI dataset holding the agency's GTFS, so the result uses the agency's own station, platform and entrance stop_ids. It's read with your access.",
                { placeholder: "Enter agency GTFS dataset ID" })}

            <Form.Check
                type="checkbox"
                id="pathways-convert-advanced"
                className={`${style.formItem} mt-4`}
                label="Show Advanced Options"
                checked={convertOptions.advanced}
                onChange={(e) => setConvertOptions({ ...convertOptions, advanced: e.target.checked })}
            />
            {convertOptions.advanced && (
                <>
                    {!isDxf && textField("layers", "Layers",
                        <>
                            The service's layer ids to read, as ranges or separated by commas. Leave blank to read every layer. To convert one station, give the ids of the layers in its group, as listed on the service's page (the group's own id selects nothing). <strong>Needed when the service holds more than one station and you use Station name, Parent station stop_id or Platform stop_ids, which apply to one station.</strong>
                        </>,
                        { placeholder: "7-19" })}
                    {textField("station", "Station name",
                        "The station's name, when the drawings don't carry one.")}
                    {textField("parent_station", "Parent station stop_id",
                        "The agency's stop_id for the station, when the GTFS dataset can't settle it.")}
                    {textField("platforms", "Platform stop_ids",
                        "The agency's stop_ids for the platforms, separated by commas, when the GTFS dataset can't settle them.")}
                    {isDxf && textField("control", "Control points",
                        "Instead of a coordinate system: two or more points, one per line, each as drawing x,y then longitude,latitude.",
                        { placeholder: "1520.5,880.25,-122.3125,47.5797", as: "textarea", rows: 3 })}
                </>
            )}
        </>
    );
};

export default PathwaysConvertForm;
