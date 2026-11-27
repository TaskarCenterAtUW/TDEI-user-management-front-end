import { getApiErrorMessage, toApiError } from "./apiError";

describe("API error handling", () => {
  it.each([
    ["plain response", "plain response"],
    [{ detail: "Dataset exceeds the 2 GiB limit" }, "Dataset exceeds the 2 GiB limit"],
    [{ message: "Invalid ZIP archive" }, "Invalid ZIP archive"],
    [{ error: { message: "Gateway rejected the upload" } }, "Gateway rejected the upload"],
  ])("extracts a readable message from %#", (response, expected) => {
    expect(getApiErrorMessage({ response: { data: response } })).toBe(expected);
  });

  it("formats FastAPI validation details", () => {
    const error = {
      response: {
        data: {
          detail: [
            { loc: ["body", "dataset"], msg: "Field required", type: "missing" },
            { loc: ["body", "file"], msg: "Invalid ZIP archive", type: "value_error" },
          ],
        },
      },
    };

    expect(getApiErrorMessage(error)).toBe(
      "body.dataset: Field required; body.file: Invalid ZIP archive"
    );
  });

  it("uses a safe fallback for an unreadable response", () => {
    const circular = {};
    circular.self = circular;
    expect(getApiErrorMessage(circular, "Upload failed")).toBe("Upload failed");
  });

  it("wraps the original failure without losing status or response data", () => {
    const original = {
      response: {
        status: 413,
        data: { detail: "Dataset exceeds the 2 GiB limit" },
      },
    };

    const error = toApiError(original);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.message).toBe("Dataset exceeds the 2 GiB limit");
    expect(error.status).toBe(413);
    expect(error.data).toEqual(original.response.data);
    expect(error.cause).toBe(original);
  });
});
