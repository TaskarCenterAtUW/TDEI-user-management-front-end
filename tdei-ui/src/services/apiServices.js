import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
export const url = process.env.REACT_APP_URL;
export const osmUrl = process.env.REACT_APP_OSM_URL;
export const workspaceUrl = process.env.REACT_APP_TDEI_WORKSPACE_URL;

const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024;

// Calculate the byte length of the JSON string
function calculatePayloadSize(payload) {
  const jsonString = JSON.stringify(payload);
  return new Blob([jsonString]).size;
}
async function checkPayloadSizeAndSendRequest(
  url,
  requestBody,
  headers,
  method = "post"
) {
  const payloadSize = calculatePayloadSize(requestBody);

  if (payloadSize > MAX_PAYLOAD_SIZE) {
    return Promise.reject(
      new AxiosError("Payload size exceeds the maximum allowed limit of 100kb.")
    );
  }
  // Perform the request based on the method
  if (method.toLowerCase() === "post") {
    return axios.post(url, requestBody, { headers });
  } else if (method.toLowerCase() === "put") {
    return axios.put(url, requestBody, { headers });
  } else {
    return Promise.reject(new AxiosError("Unsupported request method."));
  }
}

// Helper function to recursively replace empty strings with null
function replaceEmptyStringsWithNull(obj) {
  for (const key in obj) {
    if (obj[key] === "") {
      obj[key] = null;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      replaceEmptyStringsWithNull(obj[key]);
    }
  }
}
// Helper function to remove null or undefined values from an object
const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined));

// Helper function to extract filename from Content-Disposition header
const getFilename = (disposition, fallback = "feedbacks.csv") => {
  if (!disposition) return fallback;
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(disposition);
  try {
    return decodeURIComponent((match && (match[1] || match[2])) || fallback);
  } catch {
    return fallback;
  }
};

export async function postProjectGroupCreation(data) {
  const res = await axios.post(`${url}/project-group`, data);
  return res.data;
}
export async function postProjectGroupUpdate(data) {
  const res = await axios.put(`${url}/project-group`, data);
  return res.data;
}
export async function updateActivateDeleteProjectGroup(data) {
  const { tdei_project_group_id, status } = data;
  const res = await axios.put(
    `${url}/project-group/${tdei_project_group_id}/active/${status}`
  );
  return res.data;
}
export async function postServiceDelete(data) {
  const { tdei_service_id, status, tdei_project_group_id } = data;
  const res = await axios.delete(
    `${url}/service/${tdei_project_group_id}/${tdei_service_id}/active/${status}`
  );
  return res.data;
}
export async function postStationDelete(data) {
  const { tdei_station_id, status, tdei_project_group_id } = data;
  const res = await axios.delete(
    `${url}/station/${tdei_project_group_id}/${tdei_station_id}/active/${status}`
  );
  return res.data;
}

export async function postAssignPoc(data) {
  const res = await axios.post(`${url}/poc`, data);
  return res.data;
}

export async function getRoles() {
  const res = await axios.get(`${url}/roles`);
  return res.data;
}

export async function getApiKey({ queryKey }) {
  const [, userId] = queryKey;
  const res = await axios.get(`${url}/user-profile?user_name=${userId}`);
  return res.data;
}
export async function getProjectGroupRoles(
  userId,
  pageParam = 1,
  queryText = ""
) {
  const params = {
    page_no: pageParam,
    page_size: 10,
  };
  if (queryText.trim()) {
    params.searchText = queryText;
  }

  const res = await axios.get(`${url}/project-group-roles/${userId}`, {
    params,
  });

  return {
    data: res.data,
    pageParam,
  };
}

export async function getProjectGroupList(searchText, page_no) {
  const res = await axios({
    url: `${url}/project-group`,
    params: {
      searchText,
      page_no,
      page_size: 10,
    },
    method: "GET",
  });
  return res.data;
}
export async function getProjectGroupLists(searchText, pageParam = 1, signal, showInactive) {
  const res = await axios({
    url: `${url}/project-group`,
    params: {
      searchText,
      page_no: pageParam,
      page_size: 10,
      show_inactive: showInactive,
    },
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}
export async function getProjectGroupUsers(
  searchText,
  tdei_project_group_id,
  pageParam = 1
) {
  const res = await axios({
    url: `${url}/project-group/${tdei_project_group_id}/users`,
    params: {
      searchText,
      page_no: pageParam,
      page_size: 10,
    },
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}
export async function getServices(searchText, tdei_project_group_id, pageParam = 1, isAdmin, service_type, showInactive, fromCloneDataset) {
  const params = {
    searchText,
    page_no: pageParam,
    page_size: 10,
    tdei_project_group_id:
      isAdmin && !fromCloneDataset ? null : tdei_project_group_id,
  };
  if (service_type !== "") {
    params.service_type = service_type;
  }
  if (showInactive !== null) {
    params.show_inactive = showInactive;
  }
  const res = await axios({
    url: `${url}/service`,
    params,
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}
export async function getService(
  tdei_service_id,
  service_type,
  tdei_project_group_id,
  pageParam = 1
) {
  const res = await axios({
    url: `${url}/service`,
    params: {
      tdei_service_id,
      page_no: pageParam,
      page_size: 10,
      tdei_project_group_id: tdei_project_group_id,
      service_type: service_type,
    },
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}
export async function getJobs(tdei_project_group_id, pageParam = 1, isAdmin, job_id, job_type, status, job_show) {

  const params = {
    page_no: pageParam,
    page_size: 10,
  };

  if (!isAdmin) {
    params.tdei_project_group_id = tdei_project_group_id;
  }
  if (job_show == "all") {
    params.show_group_jobs = true;
  }

  if (job_type) {
    params.job_type = job_type;
  }

  if (job_id) {
    params.job_id = job_id;
  }

  if (status) {
    params.status = status;
  }

  const res = await axios({
    url: `${osmUrl}/jobs`,
    params: params,
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}

export async function getJobReport(job_id) {
  const res = await axios({
    url: `${osmUrl}/job/download/${job_id}`,
    method: "GET",
  });
  return {
    data: res.data,
  };
}
export async function getStations(
  searchText,
  tdei_project_group_id,
  pageParam = 1,
  isAdmin
) {
  const res = await axios({
    url: `${url}/station`,
    params: {
      searchText,
      page_no: pageParam,
      page_size: 10,
      tdei_project_group_id: isAdmin ? null : tdei_project_group_id,
    },
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}
export async function getStation(
  tdei_station_id,
  tdei_project_group_id,
  pageParam = 1
) {
  const res = await axios({
    url: `${url}/station`,
    params: {
      tdei_station_id,
      page_no: pageParam,
      page_size: 10,
      tdei_project_group_id: tdei_project_group_id,
    },
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}

export async function postAssignRoles(data) {
  const res = await axios.post(`${url}/permission`, data);
  return res.data;
}

export async function postRevokePermission(data) {
  const res = await axios.put(`${url}/permission/revoke`, data);
  return res.data;
}

export async function postCreateService(data) {
  const token = localStorage.getItem("accessToken");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const res = await checkPayloadSizeAndSendRequest(
    `${url}/service`,
    data,
    headers
  );
  return res.data;
}
export async function postUpdateService(data) {
  const token = localStorage.getItem("accessToken");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const res = await checkPayloadSizeAndSendRequest(`${url}/service/${data.tdei_project_group_id}`, data, headers, 'put');
  return res.data;
}
export async function postUpdateStation(data) {
  const res = await axios.put(
    `${url}/station/${data.tdei_project_group_id}`,
    data
  );
  return res.data;
}

export async function postCreateStation(data) {
  const res = await axios.post(`${url}/station`, data);
  return res.data;
}
export async function postCreateJob(data) {
  const formData = new FormData();
  let url;
  let response;
  const params = {};
  const baseUrl = `${osmUrl}/${data[0]}`;
  let headers = {
    "Content-Type": "multipart/form-data",
  };
  try {
    switch (data[0]) {
      case "osw/convert":
        formData.append("source_format", data[2]);
        formData.append("target_format", data[3]);
        formData.append("file", data[1]);
        url = baseUrl;
        break;
      case "osw/confidence":
        formData.append("file", data[1]);
        url = `${baseUrl}/${data[2]}`;
        break;
      case "osw/quality-metric/ixn":
        if (data[1]) {
          formData.append('file', data[1]);
        }
        formData.append("tdei_dataset_id", data[2]);
        // formData.append('algorithm', data[3]);
        url = `${baseUrl}/${data[2]}`;
        break;
      case "osw/dataset-bbox":
        url = baseUrl;
        headers = {
          "Content-Type": "application/json",
        };
        break;
      case "osw/dataset-tag-road":
        params.source_dataset_id = data[2];
        params.target_dataset_id = data[3];
        url = baseUrl;
        headers = {
          "Content-Type": "application/json",
        };
        break;
      case "osw/quality-metric/tag":
        formData.append("tdei_dataset_id", data[2]);
        formData.append("file", data[1]);
        url = `${baseUrl}/${data[2]}`;
        break;
      case "osw/spatial-join":
        let requestBody;
        if (data[2]) {
          url = baseUrl;
          try {
            requestBody = JSON.parse(data[2]);
          } catch (e) {
            return Promise.reject(new AxiosError(e));
          }
          headers = { "Content-Type": "application/json" };
          response = await checkPayloadSizeAndSendRequest(
            url,
            requestBody,
            headers
          );
          if (response) return response.data;
          return;
        }
        break;
      case "osw/union":
        const unionRequestBody = {
          tdei_dataset_id_one: data[2],
          tdei_dataset_id_two: data[3],
          proximity: data[4],
        };
        url = baseUrl;
        headers = {
          'Content-Type': 'application/json',
        };
        response = await axios.post(url, unionRequestBody, { headers });
        return response.data;
      default:
        formData.append("dataset", data[1]);
        url = baseUrl;
    }

    const config = { headers };
    if (Object.keys(params).length > 0) {
      config.params = params;
    }

    if (data[0] === "osw/quality-metric" && data[3]) {
      response = await axios.post(url, formData, headers);
    } else if (data[0] === "osw/dataset-bbox") {
      const bboxParams = [
        `bbox=${parseFloat(data[4].west)}`,
        `bbox=${parseFloat(data[4].south)}`,
        `bbox=${parseFloat(data[4].east)}`,
        `bbox=${parseFloat(data[4].north)}`,
      ];
      url = `${url}?tdei_dataset_id=${data[2]}&file_type=${
        data[3]
      }&${bboxParams.join("&")}`;
      response = await axios.post(url);
    } else if (data[0] === "osw/dataset-tag-road" || data[0] === "osw/union") {
      response = await axios.post(url, {}, config);
    } else {
      response = await axios.post(url, formData, config);
    }

    return response.data;
  } catch (error) {
    throw error.response.data ?? error;
  }
}
export async function postUploadDataset(data) {
  const formData = new FormData();
  formData.append("tdei_project_group_id", data[0].tdei_project_group_id);
  formData.append("tdei_service_id", data[0].tdei_service_id);
  formData.append("dataset", data[1].file);
  if (data[2] instanceof File) {
    formData.append("metadata", data[2]);
  } else {
    const metadata = { ...data[2] };
    // Parse datasetArea and customMetadata fields
    try {
      if (typeof metadata.dataset_detail.dataset_area === "string") {
        metadata.dataset_detail.dataset_area = JSON.parse(
          JSON.parse(metadata.dataset_detail.dataset_area)
        );
      }
    } catch (e) {
      if (metadata.dataset_detail.dataset_area !== "") {
        return Promise.reject(new AxiosError(e));
      }
    }
    try {
      if (typeof metadata.dataset_detail.custom_metadata === "string") {
        metadata.dataset_detail.custom_metadata = JSON.parse(
          JSON.parse(metadata.dataset_detail.custom_metadata)
        );
      }
    } catch (e) {
      if (metadata.dataset_detail.custom_metadata !== "") {
        return Promise.reject(new AxiosError(e));
      }
    }
    replaceEmptyStringsWithNull(metadata);
    if (
      Array.isArray(metadata.maintenance.official_maintainer) &&
      metadata.maintenance.official_maintainer.length === 0
    ) {
      metadata.maintenance.official_maintainer = null;
    }
    // Convert the metadata object to a JSON string
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const file = new File([blob], "metadata.json", {
      type: "application/json",
    });
    formData.append("metadata", file);
  }
  if (data[3] != null) {
    formData.append("changeset", data[3]);
  }
  // Get the endpoint based on the service_type
  const service_type = data[0].service_type;
  const file_end_point =
    service_type === "flex"
      ? "gtfs-flex"
      : service_type === "pathways"
      ? "gtfs-pathways"
      : "osw";
  const url = data[1].derived_from_dataset_id
    ? `${osmUrl}/${file_end_point}/upload/${data[0].tdei_project_group_id}/${data[0].tdei_service_id}?derived_from_dataset_id=${data[1].derived_from_dataset_id}`
    : `${osmUrl}/${file_end_point}/upload/${data[0].tdei_project_group_id}/${data[0].tdei_service_id}`;
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error object:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else if (error.data) {
      throw new Error(error.data);
    } else {
      throw new Error(error);
    }
  }
}
export async function getDatasets(
  searchText,
  searchDatasetId,
  pageParam = 1,
  isAdmin,
  status,
  dataType,
  validFrom,
  validTo,
  tdei_service_id,
  selectedProjectGroupId,
  tdei_project_group_id,
  sortField = 'uploaded_timestamp',
  sortOrder = 'DESC'
) {
  const params = {
    page_no: pageParam,
    page_size: 10,
    sort_field: sortField,
    sort_order: sortOrder,
  };

  if (status) {
    params.status = status;
  }

  if (searchText) {
    params.name = searchText;
  }
  if (searchDatasetId) {
    params.tdei_dataset_id = searchDatasetId;
  }

  if (dataType) {
    params.data_type = dataType;
  }

  if (validFrom) {
    params.valid_from = validFrom;
  }

  if (validTo) {
    params.valid_to = validTo;
  }

  if (tdei_service_id) {
    params.tdei_service_id = tdei_service_id;
  }

  //Project ID if the user is admin
  if (isAdmin && selectedProjectGroupId) {
    params.tdei_project_group_id = selectedProjectGroupId;
  } else if (!isAdmin) {
    params.tdei_project_group_id = tdei_project_group_id;
  }

  const res = await axios({
    url: `${osmUrl}/datasets`,
    params: params,
    method: "GET",
  });

  return {
    data: res.data,
    pageParam,
  };
}
export async function getReleasedDatasets(searchText, searchDatasetId, pageParam = 1, dataType, projectId, validFrom, validTo, tdeiServiceId, sortField = 'uploaded_timestamp',
  sortOrder = 'DESC') {
  const params = {
    status: "Publish",
    page_no: pageParam,
    page_size: 10,
    sort_field: sortField,
    sort_order: sortOrder,
  };
  if (searchText) {
    params.name = searchText;
  }
  if (searchDatasetId) {
    params.tdei_dataset_id = searchDatasetId;
  }
  if (dataType) {
    params.data_type = dataType;
  }
  if (projectId) {
    params.tdei_project_group_id = projectId;
  }
  if (validFrom) {
    params.valid_from = validFrom;
  }
  if (validTo) {
    params.valid_to = validTo;
  }
  if (tdeiServiceId) {
    params.tdei_service_id = tdeiServiceId;
  }

  const res = await axios({
    url: `${osmUrl}/datasets`,
    params: params,
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}

export async function postPublishDataset(data) {
  var file_end_point = "";
  var service_type = data.service_type.toLowerCase();
  if (service_type === "flex") {
    file_end_point = "gtfs-flex";
  } else if (service_type === "pathways") {
    file_end_point = "gtfs-pathways";
  } else {
    file_end_point = "osw";
  }
  const res = await axios.post(
    `${osmUrl}/${file_end_point}/publish/${data.tdei_dataset_id}`,
    data
  );
  return res.data;
}

export async function deleteDataset(tdei_dataset_id) {
  const res = await axios.delete(
    `${osmUrl}/dataset/${tdei_dataset_id}`,
    tdei_dataset_id
  );
  return res.data;
}

export async function editMetadata(data) {
  const formData = new FormData();
  if (data.metadata instanceof File) {
    formData.append("file", data.metadata);
  } else {
    let metadata = data.metadata;
    // Parse datasetArea and customMetadata fields
    try {
      if (typeof metadata.dataset_detail.dataset_area === "string") {
        metadata.dataset_detail.dataset_area = JSON.parse(
          metadata.dataset_detail.dataset_area
        );
      }
    } catch (e) {
      if (metadata.dataset_detail.dataset_area !== "") {
        return Promise.reject(new AxiosError(e));
      }
    }
    try {
      if (typeof metadata.dataset_detail.custom_metadata === "string") {
        metadata.dataset_detail.custom_metadata = JSON.parse(
          metadata.dataset_detail.custom_metadata
        );
      }
    } catch (e) {
      if (metadata.dataset_detail.custom_metadata !== "") {
        return Promise.reject(new AxiosError(e));
      }
    }
    // Replace empty strings with null
    replaceEmptyStringsWithNull(metadata);
    // Convert the metadata object to a JSON string
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const file = new File([blob], "metadata.json", {
      type: "application/json",
    });
    formData.append("file", file);
  }
  // Get the endpoint based on the service_type
  const response = await axios.put(
    `${osmUrl}/metadata/${data.tdei_dataset_id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function cloneDataset(data) {
  const formData = new FormData();
  formData.append(
    "tdei_project_group_id",
    data.selectedData[0].tdei_project_group_id
  );
  formData.append("tdei_service_id", data.selectedData[1].tdei_service_id);
  formData.append("tdei_dataset_id", data.tdei_dataset_id);
  if (data.selectedData[1] instanceof File) {
    formData.append("file", data.selectedData[2]);
  } else {
    const metadata = { ...data.selectedData[2] };
    // Parse datasetArea and customMetadata fields
    try {
      if (typeof metadata.dataset_detail.dataset_area === "string") {
        metadata.dataset_detail.dataset_area = JSON.parse(
          JSON.parse(metadata.dataset_detail.dataset_area)
        );
      }
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
      metadata.dataset_detail.dataset_area = null;
    }
    try {
      if (typeof metadata.dataset_detail.custom_metadata === "string") {
        metadata.dataset_detail.custom_metadata = JSON.parse(
          JSON.parse(metadata.dataset_detail.custom_metadata)
        );
      }
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
      metadata.dataset_detail.custom_metadata = null;
    }
    replaceEmptyStringsWithNull(metadata);
    if (
      Array.isArray(metadata.maintenance.official_maintainer) &&
      metadata.maintenance.official_maintainer.length === 0
    ) {
      metadata.maintenance.official_maintainer = null;
    }
    // Convert the metadata object to a JSON string
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const file = new File([blob], "metadata.json", {
      type: "application/json",
    });

    formData.append("file", file);
  }
  // if (data.selectedData[2] != null) {
  //   formData.append('changeset', data[2]);
  // }

  const response = await axios.post(
    `${osmUrl}/dataset/clone/${data.tdei_dataset_id}/${data.selectedData[0].tdei_project_group_id}/${data.selectedData[1].tdei_service_id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function downloadDataset(data) {
  var file_end_point = "";
  const params = {};
  var service_type = data.data_type
  if (service_type === 'flex') { file_end_point = 'gtfs-flex' }
  else if (service_type === 'pathways') { file_end_point = 'gtfs-pathways' }
  else { file_end_point = 'osw' }
  if (service_type === 'osw') {
    if (data.format) {
      params.format = data.format;
    }
    if (data.file_version) {
      params.file_version = data.file_version;
    }
  }
  try {
    const response = await axios.get(`${osmUrl}/${file_end_point}/${data.tdei_dataset_id}`, {
      responseType: 'blob', params: params
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = `${data.tdei_dataset_id}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    return Promise.reject(new AxiosError(error));
    console.error("There was a problem with the download operation:", error);
  }
}

export async function getJobDetails(tdei_project_group_id, job_id, isAdmin) {
  const params = {};

  if (!isAdmin) {
    params.tdei_project_group_id = tdei_project_group_id;
  }
  if (job_id) {
    params.job_id = job_id;
  }
  params.show_group_jobs = true;
  const res = await axios({
    url: `${osmUrl}/jobs`,
    params: params,
    method: "GET",
  });
  return res.data;
}
export async function downloadJob(jobId) {
  try {
    const response = await axios.get(`${osmUrl}/job/download/${jobId}`, {
      responseType: "blob",
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = `${jobId}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    console.error('There was a problem with the download operation:', error);
    if (error.status === 404) {
      return Promise.reject(new AxiosError("Download File Not Found!"));
    }
    return Promise.reject(new AxiosError(error));
  }
}

export async function postResetPassword(data) {
  console.log(data);
  const res = await axios.post(`${url}/reset-credentials`, data);
  return res.data;
}

export async function createInclinationJob(tdei_dataset_id) {
  const res = await axios.post(
    `${osmUrl}/osw/dataset-inclination/${tdei_dataset_id}`
  );
  return res.data;
}

export async function updateServiceStatus(data) {
  const { tdei_service_id, status, tdei_project_group_id } = data;
  const res = await axios.put(
    `${url}/service/${tdei_project_group_id}/${tdei_service_id}/active/${status}`
  );
  return res.data;
}
export async function downloadUsers() {
   try {
    const res = await axios.get(`${url}/users/download`, {
      responseType: "blob",
      headers: { Accept: "text/csv" },
    });
    const disposition = res.headers && res.headers["content-disposition"];
    const filename = getFilename(disposition, "tdei-active-users.csv");
    return { blob: res.data, filename };
  } catch (err) {
    const status = (err && err.response && err.response.status) || err && err.status;
    if (status === 404) {
      throw new Error("Download file not found.");
    }
    const msg =
      (err && err.response && err.response.data && err.response.data.message) ||
      (err && err.message) ||
      "Failed to download Active Users CSV.";
    throw new Error(msg);
  }
}
export async function regenerateApiKey() {
  const res = await axios.post(`${osmUrl}/regenerate-api-key`);
  return res.data;
}

/**
 * Dataviewer API functions
 */

export async function updateProjectGroupDatasetViewerSettings(
  projectGroupId,
  data
) {
  const res = await axios.post(
    `${url}/project-group/${projectGroupId}/dataset-viewer`,
    data
  );
  return res.data;
}

export async function updateDataviewerPreferenceForDataset(
  tdei_dataset_id,
  allow_viewer_access = false
) {
  const res = await axios.post(
    `${osmUrl}/osw/dataset-viewer/${tdei_dataset_id}`,
    {
      allow_viewer_access,
    }
  );
  return res.data;
}

export async function searchFeedback(
  tdei_project_group_id,
  tdei_dataset_id,
  from_date,
  to_date,
  sort_by,
  sort_order,
  page_no,
  page_size,
  status) {
  const params = {
    tdei_project_group_id,
    tdei_dataset_id,
    from_date,
    to_date,
    sort_by,
    sort_order,
    page_no,
    page_size,
  };
  if(status != null && status !== undefined && status !== "") {
    params.status = status;
  }
  const res = await axios.get(`${osmUrl}/osw/dataset-viewer/feedbacks`, { params });
  console.log("Feedback response:", res);
  return { data: res.data, pageParam: page_no };

}

export async function getFeedbackSummary(tdei_project_group_id) {
  const params = {tdei_project_group_id}
  const res = await axios.get(`${osmUrl}/osw/dataset-viewer/feedbacks/metadata`,{params});
  return res.data;
}

export async function downloadPGFeedbacksCSV({
  tdei_project_group_id,
  tdei_dataset_id,
  from_date,
  to_date,
  status,
  sort_by = "created_at",
  sort_order = "desc",
  page_no,
  page_size,
  format, // "csv" or "geojson"
} = {}) {
  if (!tdei_project_group_id) {
    throw new Error("tdei_project_group_id is required to download feedbacks.");
  }
  const chosenFormat = (format || "csv").toLowerCase();
  const isGeoJSON = chosenFormat === "geojson";

  const params = compact({
    tdei_dataset_id,
    from_date,
    to_date,
    status,
    sort_by,
    sort_order,
    page_no,
    page_size,
    format: chosenFormat,
  });

  const res = await axios.get(
    `${osmUrl}/osw/dataset-viewer/feedbacks/download/${tdei_project_group_id}`,
    {
      responseType: "blob",
      params,
      headers: {
        Accept: isGeoJSON ? "application/geo+json, application/json" : "text/csv",
      },
    }
  );
  const fallbackName = isGeoJSON
    ? `PG_${tdei_project_group_id}_feedbacks.geojson`
    : `PG_${tdei_project_group_id}_issues.csv`;

  const filename = getFilename(res.headers["content-disposition"], fallbackName);

  return { blob: res.data, filename };
}

export function saveBlobAsFile(blob, filename) {
  const href = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(href);
}
export async function downloadStatsExport(variables = {}) {
  const { __rangeLabel, ...params } = variables;

  const cleaned = { ...params };
  replaceEmptyStringsWithNull(cleaned);
  const finalParams = compact(cleaned); 

  const res =  await axios.get(`${osmUrl}/download-stats/export`, {
    responseType: "blob",
    params: finalParams,
    headers: { Accept: "text/csv" },
  });

  const disposition = res.headers?.["content-disposition"];
  const fallback = buildFallbackName(finalParams, variables.__rangeLabel);
  const filename = getFilename(disposition, fallback);

  return { blob: res.data, filename };
}

export function buildFallbackName(params = {}, rangeLabel = "") {
  const { from_date, to_date } = params || {};
  const fmt = (v) => (v && dayjs(v).isValid() ? dayjs(v).format("YYYY-MM-DD") : null);
  const f = fmt(from_date);
  const t = fmt(to_date);

  if (f && t) return `download_stats_${f}_${t}.csv`;

  switch (rangeLabel) {
    case "LAST_7":  return "download_stats_last_7_days.csv";
    case "LAST_30": return "download_stats_last_30_days.csv";
    case "LAST_90": return "download_stats_last_90_days.csv";
    case "ALL":     return "download_stats_all.csv";
    default:        return `download_stats_${dayjs().format("YYYY-MM-DD")}.csv`;
  }
}

export async function getReferralCodes({
  projectGroupId,
  page = 1,
  name,
  type,   
  code,
  pageSize = 10
}) {
  if (!projectGroupId) {
    throw new Error("projectGroupId is required");
  }
  const params = {
    page_no: page,
    page_size: pageSize,
  };
  if (code) params.code = code;
  if (name) params.name = name;
  if (type !== undefined && type !== null) params.type = type;

  const res = await axios.get(
    `${osmUrl}/project-group/${projectGroupId}/referral-codes`,
    { params }
  );

  // Expecting: { total_items, per_page, current_page, total_pages, data: [...] }
  return {
    page,
    data: res.data,
  };
}

export async function createReferralCode(projectGroupId,data) {
  const res = await axios.post(
    `${osmUrl}/project-group/${projectGroupId}/referral-codes`,
    data
  );
  return res.data;
}
export async function updateReferralCode(projectGroupId,code_id,data) {
  const res = await axios.put(
    `${osmUrl}/project-group/${projectGroupId}/referral-codes/${code_id}`,
    data
  );
  return res.data;
}
export async function deleteReferralCode(projectGroupId,code_id) {
  const res = await axios.delete(
    `${osmUrl}/project-group/${projectGroupId}/referral-codes/${code_id}`);
  return res.data;
}