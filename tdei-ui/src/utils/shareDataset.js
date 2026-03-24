const SHARE_DATASET_ROUTE_PREFIX = "/share-dataset";

export const SHOW_SHARE_DATASET_FLOW = false;

export const DEFAULT_SHARE_REFERRAL_CODE =
  process.env.REACT_APP_DEFAULT_SHARE_REFERRAL_CODE || "";

export function buildShareDatasetPath(dataType, datasetId) {
  const type = String(dataType || "").trim().toLowerCase();
  const id = String(datasetId || "").trim();

  if (!type || !id) return SHARE_DATASET_ROUTE_PREFIX;

  return `${SHARE_DATASET_ROUTE_PREFIX}/${encodeURIComponent(type)}/${encodeURIComponent(id)}`;
}

export function isShareDatasetRoute(pathname = "") {
  const normalizedPath = String(pathname || "")
    .trim()
    .toLowerCase()
    .replace(/\/+$/, "");

  return normalizedPath.startsWith(SHARE_DATASET_ROUTE_PREFIX);
}

export function buildShareDatasetAuthPath(basePath, dataType, datasetId) {
  const normalizedBasePath = String(basePath || "").replace(/\/+$/, "");
  const sharePath = buildShareDatasetPath(dataType, datasetId);

  return `${normalizedBasePath}${sharePath}`;
}
