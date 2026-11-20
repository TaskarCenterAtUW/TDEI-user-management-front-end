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

describe("the Quality Report form's points of interest", () => {
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

    const fetchChoice = () => screen.getByLabelText(/^Fetch them/);
    const uploadChoice = () => screen.getByLabelText("Upload my own pois.csv");
    const chooseFile = async () => {
        const file = new File(["lat,lon,category,source,snapped\n"], "pois.csv", { type: "text/csv" });
        fireEvent.change(screen.getByLabelText("data-file"), { target: { files: [file] } });
        await screen.findByRole("button", { name: "Remove file" });
        return file;
    };
    const create = () => fireEvent.click(screen.getByRole("button", { name: "Create" }));
    const atLeastOneType = /Choose at least one type of point of interest/;
    const needsAFile = /Upload a pois.csv for the Quality Report job/;

    it("offers fetching by type or uploading a file, one or the other, fetching first", () => {
        expect(fetchChoice()).toBeChecked();
        expect(uploadChoice()).not.toBeChecked();
        expect(screen.getByRole("group", { name: "Types to fetch" })).toBeInTheDocument();
        expect(screen.queryByLabelText("data-file")).not.toBeInTheDocument();

        fireEvent.click(uploadChoice());
        expect(fetchChoice()).not.toBeChecked();
        expect(screen.queryByRole("group", { name: "Types to fetch" })).not.toBeInTheDocument();
        expect(screen.queryByLabelText("All types")).not.toBeInTheDocument();
    });

    it("takes a CSV when uploading, and says what the file must hold", () => {
        fireEvent.click(uploadChoice());
        expect(screen.getByText("Allowed format .csv")).toBeInTheDocument();
        expect(screen.getByLabelText("data-file")).toHaveAttribute("accept", "text/csv,.csv");
        expect(screen.getByText(/a CSV with lat and lon columns/)).toBeInTheDocument();
    });

    it("needs a file when uploading, but no types, and sends only the file", async () => {
        fireEvent.click(screen.getByLabelText("All types"));
        fireEvent.click(uploadChoice());
        create();
        expect(screen.getByText(needsAFile)).toBeInTheDocument();
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

    it("sends the types, not a file chosen earlier, after switching back to fetching", async () => {
        fireEvent.click(screen.getByLabelText(/^Leisure/));
        fireEvent.click(uploadChoice());
        await chooseFile();
        fireEvent.click(fetchChoice());

        // The types are as they were
        expect(screen.getByLabelText(/^Leisure/)).not.toBeChecked();
        expect(screen.getByLabelText(/^Civic/)).toBeChecked();

        create();
        expect(mutate.mock.calls[0][0][2]).toEqual({
            poi_types: ALL_POI_TYPES.filter((type) => type !== "leisure"),
        });
    });

    it("keeps the file when switching to fetching and back", async () => {
        fireEvent.click(uploadChoice());
        await chooseFile();
        fireEvent.click(fetchChoice());
        fireEvent.click(uploadChoice());
        expect(screen.getByRole("button", { name: "Remove file" })).toBeInTheDocument();
    });

    it("needs at least one type when fetching, even with a file chosen earlier", async () => {
        fireEvent.click(uploadChoice());
        await chooseFile();
        fireEvent.click(fetchChoice());
        fireEvent.click(screen.getByLabelText("All types"));
        create();
        expect(screen.getByText(atLeastOneType)).toBeInTheDocument();
        expect(mutate).not.toHaveBeenCalled();
    });
});
