export function buildWorkspacesHandoffUrl(
  workspaceUrl,
  tdeiRecordId,
  refreshToken
) {
  const baseUrl = new URL('http://localhost:3000/');
  if (!baseUrl.pathname.endsWith("/")) {
    baseUrl.pathname += "/";
  }

  const destination = new URL("workspace/create/tdei", baseUrl);
  destination.searchParams.set("tdeiRecordId", tdeiRecordId);
  destination.hash = new URLSearchParams({ refreshToken }).toString();

  return destination.toString();
}
