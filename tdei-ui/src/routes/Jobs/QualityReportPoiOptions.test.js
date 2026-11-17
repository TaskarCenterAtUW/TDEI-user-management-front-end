import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import QualityReportPoiOptions, {
    ALL_POI_TYPES,
    DEFAULT_POI_STATE,
    POI_STATE_OPTIONS,
    qualityReportRequestBody,
} from "./QualityReportPoiOptions";

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
        latest = { poiTypes, poiState };
        return (
            <QualityReportPoiOptions
                poiTypes={poiTypes}
                setPoiTypes={setPoiTypes}
                poiState={poiState}
                setPoiState={setPoiState}
            />
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
});
