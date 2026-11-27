import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Dropzone from "./Dropzone";

jest.mock("../../hooks/useSystemCapabilities", () => () => ({
  data: {
    dataset_upload_limits: {
      osw: { limit_bytes: 2147483648, limit_display: "2 GiB" },
    },
  },
}));

jest.mock("react-responsive", () => ({
  useMediaQuery: () => false,
}));

describe("Dropzone", () => {
  it("accepts a large ZIP without reading it in the browser", async () => {
    const onDrop = jest.fn();
    const file = new File(["zip"], "large.zip", { type: "application/zip" });
    Object.defineProperty(file, "size", { value: 2147483649 });

    render(
      <Dropzone
        onDrop={onDrop}
        accept={{ "application/zip": [".zip"] }}
        format=".zip"
        dataType="osw"
      />
    );

    expect(screen.getByText("Max size: 2 GiB")).toBeInTheDocument();

    fireEvent.drop(screen.getByLabelText("data-file"), {
      dataTransfer: {
        files: [file],
        items: [{ kind: "file", type: file.type, getAsFile: () => file }],
        types: ["Files"],
      },
    });

    await waitFor(() => expect(onDrop).toHaveBeenCalledWith([file]));
  });
});
