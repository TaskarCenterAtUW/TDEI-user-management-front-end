import { buildWorkspacesHandoffUrl } from "./workspaces";

describe("buildWorkspacesHandoffUrl", () => {
  it("puts the dataset in the query and the encoded token in the fragment", () => {
    const result = buildWorkspacesHandoffUrl(
      "https://workspaces.test/",
      "dataset-1",
      "refresh+token/value"
    );
    const url = new URL(result);

    expect(url.pathname).toBe("/workspace/create/tdei");
    expect(url.searchParams.get("tdeiRecordId")).toBe("dataset-1");
    expect(url.searchParams.has("refreshToken")).toBe(false);
    expect(new URLSearchParams(url.hash.slice(1)).get("refreshToken")).toBe(
      "refresh+token/value"
    );
  });

  it("preserves a configured base path", () => {
    const result = buildWorkspacesHandoffUrl(
      "https://example.test/apps/workspaces",
      "dataset-1",
      "refresh-token"
    );

    expect(new URL(result).pathname).toBe(
      "/apps/workspaces/workspace/create/tdei"
    );
  });
});
