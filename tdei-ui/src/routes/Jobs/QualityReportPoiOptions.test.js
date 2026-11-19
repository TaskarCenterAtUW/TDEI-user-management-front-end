import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { osmUrl, postCreateJob } from "../../services/apiServices";
import QualityReportPoiOptions, {
    ALL_POI_TYPES,
    POI_SOURCE_FETCH,
    POI_SOURCE_FILE,
    qualityReportRequestBody,
} from "./QualityReportPoiOptions";

const poisFile = () => new File(["lat,lon,category,source,snapped\n"], "pois.csv", { type: "text/csv" });

describe("qualityReportRequestBody", () => {
    it("leaves poi_types out when every type is chosen, so the report uses all of its types", () => {
        expect(qualityReportRequestBody(ALL_POI_TYPES)).toEqual({});
    });

    it("sends the chosen types, in the list's order", () => {
        expect(qualityReportRequestBody(["leisure", "civic"])).toEqual({ poi_types: ["civic", "leisure"] });
    });

    it("sends a POI file on its own, as a form, whatever types are chosen", () => {
        const file = poisFile();
        const body = qualityReportRequestBody(["leisure", "civic"], file);
        expect(body).toBeInstanceOf(FormData);
        expect([...body.keys()]).toEqual(["pois_file"]);
        expect(body.get("pois_file").name).toBe("pois.csv");
    });

    it("sends the JSON options once the file is removed, which leaves it undefined rather than null", () => {
        expect(qualityReportRequestBody(["civic"], undefined)).toEqual({ poi_types: ["civic"] });
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
        const body = qualityReportRequestBody(["civic"]);
        await expect(postCreateJob(["osw/quality-report/dataset-1", null, body])).resolves.toBe("job-1");
        expect(sent[0].url).toBe(`${osmUrl}/osw/quality-report/dataset-1`);
        expect(sent[0].headers.getContentType()).toBe("application/json");
        expect(JSON.parse(sent[0].data)).toEqual({ poi_types: ["civic"] });
    });

    it("sends a POI file as the form itself, not as JSON", async () => {
        const file = poisFile();
        const body = qualityReportRequestBody(ALL_POI_TYPES, file);
        await expect(postCreateJob(["osw/quality-report/dataset-1", file, body])).resolves.toBe("job-1");
        expect(sent[0].url).toBe(`${osmUrl}/osw/quality-report/dataset-1`);
        // Marked as JSON, the form would arrive here already turned into a JSON object. Left unmarked,
        // axios's browser adapters drop its placeholder Content-Type for a form, and the browser sets
        // the multipart one with its boundary.
        expect(sent[0].data).toBe(body);
        expect(sent[0].headers.getContentType()).not.toMatch(/json/);
    });
});

describe("QualityReportPoiOptions", () => {
    let latest;
    const Harness = () => {
        const [poiSource, setPoiSource] = useState(POI_SOURCE_FETCH);
        const [poiTypes, setPoiTypes] = useState(ALL_POI_TYPES);
        latest = { poiSource, poiTypes };
        return (
            <QualityReportPoiOptions
                poiSource={poiSource}
                setPoiSource={setPoiSource}
                poiTypes={poiTypes}
                setPoiTypes={setPoiTypes}
                fileInput={<input aria-label="the file input" />}
            />
        );
    };

    it("starts by fetching every type, with the file input hidden", () => {
        render(<Harness />);
        expect(screen.getByLabelText(/^Fetch them/)).toBeChecked();
        expect(screen.getByLabelText("All types")).toBeChecked();
        expect(screen.getByLabelText(/^Leisure/)).toBeChecked();
        expect(screen.queryByLabelText("the file input")).not.toBeInTheDocument();
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

    it("shows only the chosen option's controls, and keeps the types as they were", () => {
        render(<Harness />);
        fireEvent.click(screen.getByLabelText(/^Leisure/));

        fireEvent.click(screen.getByLabelText("Upload my own pois.csv"));
        expect(latest.poiSource).toBe(POI_SOURCE_FILE);
        expect(screen.getByLabelText("the file input")).toBeInTheDocument();
        expect(screen.queryByLabelText("All types")).not.toBeInTheDocument();

        fireEvent.click(screen.getByLabelText(/^Fetch them/));
        expect(latest.poiSource).toBe(POI_SOURCE_FETCH);
        expect(screen.queryByLabelText("the file input")).not.toBeInTheDocument();
        expect(screen.getByLabelText(/^Leisure/)).not.toBeChecked();
        expect(screen.getByLabelText(/^Civic/)).toBeChecked();
    });
});
