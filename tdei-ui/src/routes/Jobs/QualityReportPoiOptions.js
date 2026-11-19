import React from "react";
import { Form } from "react-bootstrap";
import style from "./Jobs.module.css";

// The kinds of points of interest (POIs) a quality report can look for. The values are the report
// pipeline's POI types (config.POI_TYPES in TDEI-quality-reports), which checks them: add or rename
// a type there and here together.
export const POI_TYPE_OPTIONS = [
    { value: "transit", label: "Transit", description: "bus stops, train and metro stations" },
    { value: "healthcare", label: "Healthcare", description: "hospitals, clinics, doctors and other healthcare" },
    { value: "senior_care", label: "Senior care", description: "senior centers, nursing homes, assisted living" },
    { value: "education", label: "Education", description: "schools and colleges" },
    { value: "childcare", label: "Childcare", description: "child care and preschools" },
    { value: "food", label: "Food", description: "supermarkets, grocery stores, food banks, farmers markets" },
    { value: "shopping", label: "Shopping", description: "shopping malls" },
    { value: "social_services", label: "Social services", description: "social services, shelters, disability services" },
    { value: "community", label: "Community", description: "community centers, places of worship, libraries" },
    { value: "civic", label: "Civic", description: "polling stations and other government services" },
    { value: "leisure", label: "Leisure", description: "parks, nature reserves, recreation grounds, gyms" },
];

export const ALL_POI_TYPES = POI_TYPE_OPTIONS.map((option) => option.value);

/**
 * The body of a quality report request for the chosen options. poi_types is sent only when some
 * types are left out: with every type chosen the report uses all of its types, including any it
 * gains later.
 *
 * With a POI file, the body is a form carrying only that file. The report uses the file in place of
 * the points of interest it would fetch, and the API rejects poi_types sent alongside it, since
 * they choose what to fetch.
 */
export function qualityReportRequestBody(poiTypes, poisFile = null) {
    if (poisFile) {
        const form = new FormData();
        form.append("pois_file", poisFile);
        return form;
    }
    const body = {};
    if (poiTypes.length < ALL_POI_TYPES.length) {
        body.poi_types = ALL_POI_TYPES.filter((type) => poiTypes.includes(type));
    }
    return body;
}

// Where a quality report's points of interest come from: fetched by type, or the user's own file.
export const POI_SOURCE_FETCH = "fetch";
export const POI_SOURCE_FILE = "file";

/**
 * The quality report's points of interest on the Create Job screen: one choice between fetching
 * them by type (every type by default) and uploading the user's own pois.csv. Only the chosen
 * option's controls are shown, and only its values are sent.
 *
 * The caller holds the values, so switching back and forth keeps the types and the file as they
 * were, and passes the file input (its shared Dropzone) in as fileInput.
 */
const QualityReportPoiOptions = ({ poiSource, setPoiSource, poiTypes, setPoiTypes, fileInput }) => {
    const allChosen = poiTypes.length === ALL_POI_TYPES.length;
    const toggle = (value) =>
        setPoiTypes(poiTypes.includes(value) ? poiTypes.filter((type) => type !== value) : [...poiTypes, value]);

    return (
        <fieldset className={`${style.formItem} ${style.poiSection}`}>
            <legend className={`${style.formLabelP} ${style.poiLegend}`}>
                Points of Interest<span style={{ color: "red" }}> *</span>
            </legend>
            <div className="d-flex align-items-start">
                <Form.Text className={style.description}>
                    The destinations the report measures access to, such as walksheds and routes between them.
                    Fetch them, or upload your own.
                </Form.Text>
            </div>

            <Form.Check
                type="radio"
                name="poi-source"
                id="poi-source-fetch"
                className={style.poiSource}
                label="Fetch them from OpenStreetMap and Overture Maps, by type"
                checked={poiSource === POI_SOURCE_FETCH}
                onChange={() => setPoiSource(POI_SOURCE_FETCH)}
            />
            {poiSource === POI_SOURCE_FETCH && (
                <div role="group" aria-label="Types to fetch" className={style.poiChoice}>
                    <Form.Check
                        type="checkbox"
                        id="poi-type-all"
                        label="All types"
                        checked={allChosen}
                        onChange={() => setPoiTypes(allChosen ? [] : ALL_POI_TYPES)}
                    />
                    {POI_TYPE_OPTIONS.map((option) => (
                        <Form.Check
                            key={option.value}
                            type="checkbox"
                            id={`poi-type-${option.value}`}
                            className="ms-3"
                            label={
                                <>
                                    {option.label} <span className="text-muted">({option.description})</span>
                                </>
                            }
                            checked={poiTypes.includes(option.value)}
                            onChange={() => toggle(option.value)}
                        />
                    ))}
                    <div className="d-flex align-items-start mt-2">
                        <Form.Text className={style.description}>Choose at least one.</Form.Text>
                    </div>
                </div>
            )}

            <Form.Check
                type="radio"
                name="poi-source"
                id="poi-source-file"
                className={style.poiSource}
                label="Upload my own pois.csv"
                checked={poiSource === POI_SOURCE_FILE}
                onChange={() => setPoiSource(POI_SOURCE_FILE)}
            />
            {poiSource === POI_SOURCE_FILE && (
                <div className={style.poiChoice}>
                    {fileInput}
                    <div className="d-flex align-items-start mt-2">
                        <Form.Text className={style.description}>
                            Used as-is instead of fetching, for this report only. A CSV in the form of the pois.csv
                            the report writes: lat, lon, category, source and snapped columns, with snapped set to
                            true on every row.
                        </Form.Text>
                    </div>
                </div>
            )}
        </fieldset>
    );
};

export default QualityReportPoiOptions;
