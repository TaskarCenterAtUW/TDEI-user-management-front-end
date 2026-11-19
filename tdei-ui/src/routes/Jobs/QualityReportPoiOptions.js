import React from "react";
import Select from "react-select";
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

const US_STATES = [
    ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
    ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"],
    ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
    ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"],
    ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
    ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
    ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
    ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"],
    ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
    ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
    ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];

export const POI_STATE_OPTIONS = US_STATES.map(([code, name]) => ({ value: code, label: `${name} (${code})` }));

export const DEFAULT_POI_STATE = "WA";

/**
 * The body of a quality report request for the chosen options. poi_types is sent only when some
 * types are left out: with every type chosen the report uses all of its types, including any it
 * gains later.
 *
 * With a POI file, the body is a form carrying only that file. The report uses the file in place of
 * the points of interest it would fetch, and the API rejects poi_types or poi_state sent alongside
 * it, since those choose what to fetch.
 */
export function qualityReportRequestBody(poiTypes, poiState, poisFile = null) {
    if (poisFile) {
        const form = new FormData();
        form.append("pois_file", poisFile);
        return form;
    }
    const body = { poi_state: poiState };
    if (poiTypes.length < ALL_POI_TYPES.length) {
        body.poi_types = ALL_POI_TYPES.filter((type) => poiTypes.includes(type));
    }
    return body;
}

/**
 * The quality report's point-of-interest options on the Create Job screen: which kinds of POIs to
 * look for (all by default) and the state that Overture places must be in (WA by default).
 *
 * While a POI file is chosen there is nothing to fetch, so the options give way to a note saying
 * why. Their values live with the caller, so removing the file brings them back as they were.
 */
const QualityReportPoiOptions = ({ poiTypes, setPoiTypes, poiState, setPoiState, poisFileChosen = false }) => {
    if (poisFileChosen) {
        return (
            <div className={`${style.formItem} ${style.poiSection}`}>
                <p className={style.formLabelP}>Points of Interest</p>
                <div className="d-flex align-items-start mt-2">
                    <Form.Text className={style.description}>
                        Taken from the Points of Interest File below. Types and state choose which points of
                        interest to fetch, so they don't apply to a file of your own. Remove the file to choose
                        them again.
                    </Form.Text>
                </div>
            </div>
        );
    }

    const allChosen = poiTypes.length === ALL_POI_TYPES.length;
    const toggle = (value) =>
        setPoiTypes(poiTypes.includes(value) ? poiTypes.filter((type) => type !== value) : [...poiTypes, value]);

    return (
        <>
            <fieldset className={`${style.formItem} ${style.poiSection}`}>
                <legend className={`${style.formLabelP} ${style.poiLegend}`}>
                    Points of Interest<span style={{ color: "red" }}> *</span>
                </legend>
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
                    <Form.Text className={style.description}>
                        The destinations the report measures access to, such as walksheds and routes between them.
                        Choose at least one.
                    </Form.Text>
                </div>
            </fieldset>
            <div className={`${style.formItem} ${style.poiSection}`}>
                <label htmlFor="poi-state-selectInput" className={style.formLabelP}>
                    Points of Interest State<span style={{ color: "red" }}> *</span>
                </label>
                <Select
                    inputId="poi-state-selectInput"
                    className={style.selectFieldCommon}
                    options={POI_STATE_OPTIONS}
                    value={POI_STATE_OPTIONS.find((option) => option.value === poiState)}
                    onChange={(option) => setPoiState(option.value)}
                />
                <div className="d-flex align-items-start mt-2">
                    <Form.Text className={style.description}>
                        Points of interest from Overture Maps must have an address in this state. Those from
                        OpenStreetMap are limited to the dataset's area instead.
                    </Form.Text>
                </div>
            </div>
        </>
    );
};

export default QualityReportPoiOptions;
