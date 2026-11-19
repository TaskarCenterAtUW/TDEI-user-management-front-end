import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../store";
import { AuthContext } from "../../context";
import useCreateJob from "../../hooks/jobs/useCreateJob";
import CreateJob from "./CreateJob";
import { ALL_POI_TYPES } from "./QualityReportPoiOptions";

// Shipped only as ES modules, which Jest does not transform from node_modules here. It reaches this
// screen through the shared utils, and nothing on the screen uses it.
jest.mock("referral-codes", () => ({}));
jest.mock("../../hooks/jobs/useCreateJob");
// The dropzone looks up upload limits from the API; a POI file has none to look up.
jest.mock("../../hooks/useSystemCapabilities", () => () => ({ data: undefined }));

describe("the Quality Report form's POI file", () => {
    let mutate;

    beforeEach(() => {
        mutate = jest.fn();
        useCreateJob.mockReturnValue({ isLoading: false, mutate });
        render(
            <Provider store={store}>
                <AuthContext.Provider value={{ user: {} }}>
                    <MemoryRouter>
                        <CreateJob />
                    </MemoryRouter>
                </AuthContext.Provider>
            </Provider>
        );
        fireEvent.keyDown(screen.getByLabelText(/^Job Type/), { key: "ArrowDown" });
        fireEvent.click(screen.getByText("Quality Report"));
        fireEvent.change(screen.getByLabelText(/^Tdei Dataset Id/), { target: { value: "dataset-1" } });
    });

    const chooseFile = async () => {
        const file = new File(["lat,lon,category,source,snapped\n"], "pois.csv", { type: "text/csv" });
        fireEvent.change(screen.getByLabelText("data-file"), { target: { files: [file] } });
        await screen.findByRole("button", { name: "Remove file" });
        return file;
    };
    const removeFile = () => fireEvent.click(screen.getByRole("button", { name: "Remove file" }));
    const create = () => fireEvent.click(screen.getByRole("button", { name: "Create" }));
    const atLeastOneType = /Choose at least one type of point of interest/;

    it("is labelled optional, takes a CSV, and says what the file must hold", () => {
        expect(screen.getByText("Points of Interest File (optional)")).toBeInTheDocument();
        expect(screen.getByText("Allowed format .csv")).toBeInTheDocument();
        expect(screen.getByLabelText("data-file")).toHaveAttribute("accept", "text/csv,.csv");
        expect(screen.getByText(/lat, lon, category, source and snapped columns/)).toBeInTheDocument();
    });

    it("hides the POI types and state while a file is chosen, and says why", async () => {
        expect(screen.getByLabelText("All types")).toBeInTheDocument();
        await chooseFile();
        expect(screen.queryByLabelText("All types")).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/^Leisure/)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/^Points of Interest State/)).not.toBeInTheDocument();
        expect(screen.getByText(/Taken from the Points of Interest File below/)).toBeInTheDocument();
    });

    it("lifts the at-least-one-type rule while a file is chosen, and sends only the file", async () => {
        fireEvent.click(screen.getByLabelText("All types"));
        create();
        expect(screen.getByText(atLeastOneType)).toBeInTheDocument();
        expect(mutate).not.toHaveBeenCalled();

        const file = await chooseFile();
        create();
        expect(mutate).toHaveBeenCalledTimes(1);
        const [path, , body] = mutate.mock.calls[0][0];
        expect(path).toBe("osw/quality-report/dataset-1");
        expect(body).toBeInstanceOf(FormData);
        expect([...body.keys()]).toEqual(["pois_file"]);
        expect(body.get("pois_file").name).toBe(file.name);
    });

    it("brings the POI options back as they were when the file is removed", async () => {
        fireEvent.click(screen.getByLabelText(/^Leisure/));
        fireEvent.keyDown(screen.getByLabelText(/^Points of Interest State/), { key: "ArrowDown" });
        fireEvent.click(screen.getByText("Oregon (OR)"));

        await chooseFile();
        removeFile();

        expect(screen.queryByText(/Taken from the Points of Interest File below/)).not.toBeInTheDocument();
        expect(screen.getByLabelText(/^Leisure/)).not.toBeChecked();
        expect(screen.getByLabelText(/^Civic/)).toBeChecked();
        expect(screen.getByText("Oregon (OR)")).toBeInTheDocument();

        create();
        expect(mutate.mock.calls[0][0][2]).toEqual({
            poi_types: ALL_POI_TYPES.filter((type) => type !== "leisure"),
            poi_state: "OR",
        });
    });

    it("applies the at-least-one-type rule again once the file is removed", async () => {
        fireEvent.click(screen.getByLabelText("All types"));
        await chooseFile();
        removeFile();
        create();
        expect(screen.getByText(atLeastOneType)).toBeInTheDocument();
        expect(mutate).not.toHaveBeenCalled();
    });
});
