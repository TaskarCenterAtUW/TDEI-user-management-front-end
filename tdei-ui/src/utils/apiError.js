const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred";

function describeValidationItem(item, seen) {
  if (item && typeof item === "object" && typeof item.msg === "string") {
    const location = Array.isArray(item.loc) ? item.loc.join(".") : "";
    return location ? `${location}: ${item.msg}` : item.msg;
  }
  return describeValue(item, seen);
}

function describeValue(value, seen = new Set()) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    return value
      .map((item) => describeValidationItem(item, seen))
      .filter(Boolean)
      .join("; ");
  }

  if (typeof value === "object") {
    if (seen.has(value)) return "";
    seen.add(value);

    for (const key of ["detail", "message", "error", "errors"]) {
      const message = describeValue(value[key], seen);
      if (message) return message;
    }

    try {
      const serialized = JSON.stringify(value);
      return serialized !== "{}" ? serialized : "";
    } catch (_) {
      return "";
    }
  }

  return "";
}

export function getApiErrorData(error) {
  return error?.response?.data ?? error?.data ?? error;
}

export function getApiErrorMessage(error, fallback = DEFAULT_ERROR_MESSAGE) {
  return describeValue(getApiErrorData(error)) || fallback;
}

export function toApiError(error, fallback = DEFAULT_ERROR_MESSAGE) {
  if (error?.name === "ApiError") return error;

  const apiError = new Error(getApiErrorMessage(error, fallback));
  apiError.name = "ApiError";
  apiError.status = error?.response?.status ?? error?.status;
  apiError.data = getApiErrorData(error);
  apiError.cause = error;
  return apiError;
}
