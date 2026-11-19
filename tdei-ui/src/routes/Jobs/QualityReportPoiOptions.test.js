import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { osmUrl, postCreateJob } from "../../services/apiServices";
import QualityReportPoiOptions, {
    ALL_POI_TYPES,
    DEFAULT_POI_STATE,
    POI_STATE_OPTIONS,
    qualityReportRequestBody,
} from "./QualityReportPoiOptions";

const poisFile = () => new File(["lat,lon,category,source,snapped\n"], "pois.csv", { type: "text/csv" });

describe("qualityReportRequestBody", () => {
    it("leaves poi_types out when every type is chosen, so the report uses all of its types", () => {
        expect(qualityReportRequestBody(ALL_POI_TYPES, "WA")).toEqual({ poi_state: "WA" });
    });

    it("sends the chosen types, in the list's order, and the state", () => {
        expect(qualityReportRequestBody(["leisure", "civic"], "OR")).toEqual({
            poi_types: ["civic", "leisure"],
            poi_state: "OR",
        });
    });

    it("sends a POI file on its own, as a form, whatever types and state are chosen", () => {
        const file = poisFile();
        const body = qualityReportRequestBody(["leisure", "civic"], "OR", file);
        expect(body).toBeInstanceOf(FormData);
        expect([...body.keys()]).toEqual(["pois_file"]);
        expect(body.get("pois_file").name).toBe("pois.csv");
    });

    it("sends the JSON options once the file is removed, which leaves it undefined rather than null", () => {
        expect(qualityReportRequestBody(["civic"], "OR", undefined)).toEqual({
            poi_types: ["civic"],
            poi_state: "OR",
        });
    });
});

describe("postCreateJob for a quality report", () => {
    // Runs the request through axios's own pipeline, stopping short of the network, so the test sees
    // what axios would send rather than what it was handed.
    let sent;
    let defaultAdapter;
    beforeEach(() => {
        sent = [];
        defaultAdapter = axios.defaults.adapter;
        axios.defaults.adapter = (config) => {
            sent.push(config);
            return Promise.resolve({ data: "job-1", status: 202, statusText: "Accepted", headers: {}, config });
        };
    });
    afterEach(() => {
        axios.defaults.adapter = defaultAdapter;
    });

    it("sends the options as JSON", async () => {
        const body = qualityReportRequestBody(["civic"], "OR");
        await expect(postCreateJob(["osw/quality-report/dataset-1", null, body])).resolves.toBe("job-1");
        expect(sent[0].url).toBe(`${osmUrl}/osw/quality-report/dataset-1`);
        expect(sent[0].headers.getContentType()).toBe("application/json");
        expect(JSON.parse(sent[0].data)).toEqual({ poi_types: ["civic"], poi_state: "OR" });
    });

    it("sends a POI file as the form itself, not as JSON", async () => {
        const file = poisFile();
        const body = qualityReportRequestBody(ALL_POI_TYPES, "WA", file);
        await expect(postCreateJob(["osw/quality-report/dataset-1", file, body])).resolves.toBe("job-1");
        expect(sent[0].url).toBe(`${osmUrl}/osw/quality-report/dataset-1`);
        // Marked as JSON, the form would arrive here already turned into a JSON object. Left unmarked,
        // axios's browser adapters drop its placeholder Content-Type for a form, and the browser sets
        // the multipart one with its boundary.
        expect(sent[0].data).toBe(body);
        expect(sent[0].headers.getContentType()).not.toMatch(/json/);
    });
});

describe("the state list", () => {
    it("has the 50 states and DC, and defaults to WA", () => {
        expect(POI_STATE_OPTIONS).toHaveLength(51);
        expect(POI_STATE_OPTIONS.map((o) => o.value)).toContain(DEFAULT_POI_STATE);
        expect(DEFAULT_POI_STATE).toBe("WA");
    });
});

describe("QualityReportPoiOptions", () => {
    let latest;
    const Harness = () => {
        const [poiTypes, setPoiTypes] = useState(ALL_POI_TYPES);
        const [poiState, setPoiState] = useState(DEFAULT_POI_STATE);
        const [poisFileChosen, setPoisFileChosen] = useState(false);
        latest = { poiTypes, poiState };
        return (
            <>
                <button onClick={() => setPoisFileChosen(!poisFileChosen)}>Toggle file</button>
                <QualityReportPoiOptions
                    poiTypes={poiTypes}
                    setPoiTypes={setPoiTypes}
                    poiState={poiState}
                    setPoiState={setPoiState}
                    poisFileChosen={poisFileChosen}
                />
            </>
        );
    };

    it("starts with every type chosen and Washington selected", () => {
        render(<Harness />);
        expect(screen.getByLabelText("All types")).toBeChecked();
        expect(screen.getByLabelText(/^Leisure/)).toBeChecked();
        expect(screen.getByText("Washington (WA)")).toBeInTheDocument();
    });

    it("unchecks a type, and All types follows", () => {
        render(<Harness />);
        fireEvent.click(screen.getByLabelText(/^Leisure/));
        expect(screen.getByLabelText(/^Leisure/)).not.toBeChecked();
        expect(screen.getByLabelText("All types")).not.toBeChecked();
        expect(latest.poiTypes).not.toContain("leisure");
        expect(latest.poiTypes).toHaveLength(ALL_POI_TYPES.length - 1);
    });

    it("clears every type with All types, and picks them all again", () => {
        render(<Harness />);
        fireEvent.click(screen.getByLabelText("All types"));
        expect(latest.poiTypes).toEqual([]);
        expect(screen.getByLabelText(/^Civic/)).not.toBeChecked();
        fireEvent.click(screen.getByLabelText("All types"));
        expect(latest.poiTypes).toEqual(ALL_POI_TYPES);
    });

    it("gives way to a note while a POI file is chosen, and comes back as it was", () => {
        render(<Harness />);
        fireEvent.click(screen.getByLabelText(/^Leisure/));

        fireEvent.click(screen.getByText("Toggle file"));
        expect(screen.queryByLabelText("All types")).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/^Points of Interest State/)).not.toBeInTheDocument();
        expect(screen.getByText(/they don't apply to a file of your own/)).toBeInTheDocument();

        fireEvent.click(screen.getByText("Toggle file"));
        expect(screen.queryByText(/they don't apply to a file of your own/)).not.toBeInTheDocument();
        expect(screen.getByLabelText(/^Leisure/)).not.toBeChecked();
        expect(screen.getByLabelText(/^Civic/)).toBeChecked();
        expect(screen.getByText("Washington (WA)")).toBeInTheDocument();
    });
});
