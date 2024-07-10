import axios from "axios";

export const url = process.env.REACT_APP_URL;
export const osmUrl = process.env.REACT_APP_OSM_URL;
export const workspaceUrl = process.env.REACT_APP_TDEI_WORKSPACE_URL

const flattenMetadata = (metadata) => {
  return {
    ...metadata.dataset_detail,
    ...metadata.data_provenance,
    ...metadata.dataset_summary,
    ...metadata.maintenance,
    ...metadata.methodology
  };
};
// Helper function to recursively replace empty strings with null
function replaceEmptyStringsWithNull(obj) {
  for (const key in obj) {
    if (obj[key] === "") {
      obj[key] = null;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceEmptyStringsWithNull(obj[key]);
    }
  }
}

export async function postProjectGroupCreation(data) {
  const res = await axios.post(`${url}/project-group`, data);
  return res.data;
}
export async function postProjectGroupUpdate(data) {
  const res = await axios.put(`${url}/project-group`, data);
  return res.data;
}
export async function postProjectGroupDelete(data) {
  const { tdei_project_group_id, status } = data;
  const res = await axios.delete(
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
export async function getProjectGroupRoles({ queryKey }) {
  const [, userId] = queryKey;
  const res = await axios.get(`${url}/project-group-roles/${userId}`);
  return res.data;
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
export async function getProjectGroupLists(searchText, pageParam = 1) {
  const res = await axios({
    url: `${url}/project-group`,
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
export async function getProjectGroupUsers(searchText, tdei_project_group_id, pageParam = 1) {
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
export async function getServices(searchText, tdei_project_group_id, pageParam = 1, isAdmin, service_type) {
  const params = {
    searchText,
    page_no: pageParam,
    page_size: 10,
    tdei_project_group_id: isAdmin ? null : tdei_project_group_id,
  };
  if (service_type !== "") {
    params.service_type = service_type;
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
export async function getService(tdei_service_id, service_type, tdei_project_group_id, pageParam = 1) {
  const res = await axios({
    url: `${url}/service`,
    params: {
      tdei_service_id,
      page_no: pageParam,
      page_size: 10,
      tdei_project_group_id: tdei_project_group_id,
      service_type: service_type
    },
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}
export async function getJobs(tdei_project_group_id, pageParam = 1, isAdmin, job_id, job_type, status) {

  const params = {
    page_no: pageParam,
    page_size: 10,
  };

  // if (isAdmin) {
  //   params.tdei_project_group_id = null;
  // } else {
  //   params.tdei_project_group_id = tdei_project_group_id;
  // }

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
  }
}
export async function getStations(searchText, tdei_project_group_id, pageParam = 1, isAdmin) {
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
export async function getStation(tdei_station_id, tdei_project_group_id, pageParam = 1) {
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
  const res = await axios.post(`${url}/service`, data);
  return res.data;
}
export async function postUpdateService(data) {
  const res = await axios.put(`${url}/service/${data.tdei_project_group_id}`, data);
  return res.data;
}
export async function postUpdateStation(data) {
  const res = await axios.put(`${url}/station/${data.tdei_project_group_id}`, data);
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
    'Content-Type': 'multipart/form-data',
  };

  switch (data[0]) {
    case "osw/convert":
      formData.append('source', data[2]);
      formData.append('target', data[3]);
      formData.append('file', data[1]);
      url = baseUrl;
      break;
    case "osw/confidence":
      formData.append('file', data[1]);
      url = `${baseUrl}/${data[2]}`;
      break;
    case "osw/quality-metric":
      formData.append('tdei_dataset_id', data[2]);
      url = `${baseUrl}/${data[2]}`;
      headers = {
        'Content-Type': 'application/json',
      };
      break;
    case "osw/dataset-bbox":
      url = baseUrl;
      headers = {
        'Content-Type': 'application/json',
      };
      break;
    case "osw/dataset-tag-road":
      params.source_dataset_id = data[2];
      params.target_dataset_id = data[3];
      url = baseUrl
      headers = {
        'Content-Type': 'application/json',
      };
      break;
    default:
      formData.append('dataset', data[1]);
      url = baseUrl;
  }
  console.log(url);
  const config = { headers };
  if (Object.keys(params).length > 0) {
    config.params = params;
  }
  if (data[0] === "osw/quality-metric" && data[3]) {
    const requestBody = JSON.parse(data[3])
    console.log(requestBody);
    response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json"
      },
    });
  } else {
    if (data[0] === "osw/dataset-bbox") {
      const bboxParams = [
        `bbox=${parseFloat(data[4].west)}`,
        `bbox=${parseFloat(data[4].south)}`,
        `bbox=${parseFloat(data[4].east)}`,
        `bbox=${parseFloat(data[4].north)}`
      ];
      url = `${url}?tdei_dataset_id=${data[2]}&file_type=${data[3]}&${bboxParams.join('&')}`;
      response = await axios.post(url);
    } if (data[0] === "osw/dataset-tag-road") {
      response = await axios.post(url, {}, config);
    } else {
      response = await axios.post(url, formData, config);
    }
  }
  return response.data;
}
export async function postUploadDataset(data) {
  const formData = new FormData();
  formData.append('tdei_project_group_id', data[0].tdei_project_group_id);
  formData.append('tdei_service_id', data[0].tdei_service_id);
  formData.append('dataset', data[1].file);
  if (data[2] instanceof File) {
    formData.append('metadata', data[2]);
  } else {
    const metadata = { ...data[2] };
    // Parse datasetArea and customMetadata fields
    try {
      if (typeof metadata.dataset_detail.dataset_area === 'string') {
        metadata.dataset_detail.dataset_area = JSON.parse(JSON.parse(metadata.dataset_detail.dataset_area));
      }
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
      metadata.dataset_detail.dataset_area = null;
    }
    try {
      if (typeof metadata.dataset_detail.custom_metadata === 'string') {
        metadata.dataset_detail.custom_metadata = JSON.parse(JSON.parse(metadata.dataset_detail.custom_metadata));
      }
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
      metadata.dataset_detail.custom_metadata = null;
    }
    replaceEmptyStringsWithNull(metadata);
    if (Array.isArray(metadata.maintenance.official_maintainer) && metadata.maintenance.official_maintainer.length === 0) {
      metadata.maintenance.official_maintainer = null;
    }
    // Convert the metadata object to a JSON string
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });
    formData.append('metadata', file);
  }
  if (data[3] != null) {
    formData.append('changeset', data[3]);
  }
  // Get the endpoint based on the service_type
  const service_type = data[0].service_type;
  const file_end_point = service_type === 'flex' ? 'gtfs-flex' : (service_type === 'pathways' ? 'gtfs-pathways' : 'osw');
  const url = data[1].derived_from_dataset_id ?
    `${osmUrl}/${file_end_point}/upload/${data[0].tdei_project_group_id}/${data[0].tdei_service_id}?derived_from_dataset_id=${data[1].derived_from_dataset_id}` :
    `${osmUrl}/${file_end_point}/upload/${data[0].tdei_project_group_id}/${data[0].tdei_service_id}`;
  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error object:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else if (error.data) {
      throw new Error(error.data);
    } else {
      throw new Error(error);
    }
  }
}
export async function getDatasets(searchText, pageParam = 1, status, dataType, tdei_project_group_id) {
  const params = {
    page_no: pageParam,
    page_size: 10,
  };
  if (status) {
    params.status = status;
  }
  if (searchText) {
    params.name = searchText;
  }
  if (dataType) {
    params.data_type = dataType;
  }
  if (tdei_project_group_id) {
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
export async function getReleasedDatasets(searchText, pageParam = 1, dataType) {
  const params = {
    status: "Publish",
    page_no: pageParam,
    page_size: 10,
  };
  if (searchText) {
    params.name = searchText;
  }
  if (dataType) {
    params.data_type = dataType;
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
  var file_end_point = ''
  var service_type = data.service_type.toLowerCase();
  if (service_type === 'flex') { file_end_point = 'gtfs-flex' }
  else if (service_type === 'pathways') { file_end_point = 'gtfs-pathways' }
  else { file_end_point = 'osw' }
  const res = await axios.post(`${osmUrl}/${file_end_point}/publish/${data.tdei_dataset_id}`, data);
  return res.data;
}

export async function deleteDataset(tdei_dataset_id) {
  const res = await axios.delete(`${osmUrl}/dataset/${tdei_dataset_id}`, tdei_dataset_id);
  return res.data;
}

export async function editMetadata(data) {
  const formData = new FormData();
  if (data.metadata instanceof File) {
    formData.append('file', data.metadata);
  } else {
    let metadata = data.metadata;
    // Parse datasetArea and customMetadata fields
    try {
      if (typeof metadata.dataset_detail.dataset_area === 'string') {
        metadata.dataset_detail.dataset_area = JSON.parse(metadata.dataset_detail.dataset_area);
      }
    } catch (e) {
      console.error("Failed to parse datasetArea: ", e);
    }
    try {
      if (typeof metadata.dataset_detail.custom_metadata === 'string') {
        metadata.dataset_detail.custom_metadata = JSON.parse(metadata.dataset_detail.custom_metadata);
      }
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
    }
    // Replace empty strings with null
    replaceEmptyStringsWithNull(metadata);
    // Convert the metadata object to a JSON string
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });
    formData.append('file', file);
  }
  // Get the endpoint based on the service_type
  const response = await axios.put(`${osmUrl}/metadata/${data.tdei_dataset_id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function cloneDataset(data) {
  const formData = new FormData();
  formData.append('tdei_project_group_id', data.selectedData[0].tdei_project_group_id);
  formData.append('tdei_service_id', data.selectedData[0].tdei_service_id);
  formData.append('tdei_dataset_id', data.tdei_dataset_id);
  if (data.selectedData[1] instanceof File) {
    formData.append('file', data.selectedData[1]);
  } else {
    const metadata = { ...data.selectedData[1] };
    // Parse datasetArea and customMetadata fields
    try {
      if (typeof metadata.dataset_detail.dataset_area === 'string') {
        metadata.dataset_detail.dataset_area = JSON.parse(JSON.parse(metadata.dataset_detail.dataset_area));
      }
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
      metadata.dataset_detail.dataset_area = null;
    }
    try {
      if (typeof metadata.dataset_detail.custom_metadata === 'string') {
        metadata.dataset_detail.custom_metadata = JSON.parse(JSON.parse(metadata.dataset_detail.custom_metadata));
      }
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
      metadata.dataset_detail.custom_metadata = null;
    }
    replaceEmptyStringsWithNull(metadata);
    if (Array.isArray(metadata.maintenance.official_maintainer) && metadata.maintenance.official_maintainer.length === 0) {
      metadata.maintenance.official_maintainer = null;
    }
    // Convert the metadata object to a JSON string
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });

    formData.append('file', file);
  }
  // if (data.selectedData[2] != null) {
  //   formData.append('changeset', data[2]);
  // }

  const response = await axios.post(`${osmUrl}/dataset/clone/${data.tdei_dataset_id}/${data.selectedData[0].tdei_project_group_id}/${data.selectedData[0].tdei_service_id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function downloadDataset(data) {
  var file_end_point = ''
  var service_type = data.data_type
  if (service_type === 'flex') { file_end_point = 'gtfs-flex' }
  else if (service_type === 'pathways') { file_end_point = 'gtfs-pathways' }
  else { file_end_point = 'osw' }
  try {
    const response = await axios.get(`${osmUrl}/${file_end_point}/${data.tdei_dataset_id}`, {
      responseType: 'blob'
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = `${data.tdei_dataset_id}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    console.error('There was a problem with the download operation:', error);
  }
};

export async function getJobDetails(tdei_project_group_id, job_id, isAdmin) {

  const params = {};

  // if (isAdmin) {
  params.tdei_project_group_id = null;
  // } else {
  //   params.tdei_project_group_id = tdei_project_group_id;
  // }
  if (job_id) {
    params.job_id = job_id;
  }

  const res = await axios({
    url: `${osmUrl}/jobs`,
    params: params,
    method: "GET",
  });
  return res.data
}
