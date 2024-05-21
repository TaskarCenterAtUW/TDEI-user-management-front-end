import axios from "axios";

export const url = process.env.REACT_APP_URL;
export const osmUrl = process.env.REACT_APP_OSM_URL;
export const workspaceUrl = process.env.REACT_APP_TDEI_WORKSPACE_URL

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
export async function getService(tdei_service_id, service_type,tdei_project_group_id, pageParam = 1) {
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
export async function getJobs(tdei_project_group_id, pageParam  = 1, isAdmin, job_id, job_type, status) {

  const params = {
    page_no: pageParam,
    page_size: 10,
  };

  if (isAdmin) {
    params.tdei_project_group_id = null;
  } else {
    params.tdei_project_group_id = tdei_project_group_id;
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

export async function getJobReport(job_id){
  const res = await axios({
    url: `${osmUrl}/job/download/${job_id}`,
    method: "GET",
  });
  return {
    data : res.data,
  }
}
export async function getStations(searchText, tdei_project_group_id ,pageParam = 1,isAdmin) {
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
export async function getStation(tdei_station_id, tdei_project_group_id ,pageParam = 1) {
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
  formData.append('dataset', data[1]);

  const response = await axios.post(`${osmUrl}/${data[0]}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('Response: ', response)
  return response.data;
}
export async function postUploadDataset(data) {
  const formData = new FormData();
  formData.append('tdei_project_group_id', data[0].tdei_project_group_id);
  formData.append('tdei_service_id', data[0].tdei_service_id);
  formData.append('dataset', data[1]);
  if (data[2] instanceof File) {
    formData.append('metadata', data[2]);
  } else {
    const metadata = { ...data[2].datasetDetails };
    // Parse datasetArea and customMetadata fields
    try {
      metadata.dataset_area = JSON.parse(metadata.dataset_area);
    } catch (e) {
      console.error("Failed to parse datasetArea: ", e);
      metadata.dataset_area = {};
    }
    try {
      metadata.custom_metadata = JSON.parse(metadata.custom_metadata);
    } catch (e) {
      console.error("Failed to parse customMetadata: ", e);
      metadata.custom_metadata = {};
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
 //get the end point based on the service_type
  var file_end_point = ''
  var service_type = data[0].service_type
  if (service_type === 'flex'){file_end_point = 'gtfs-flex'}
  else if(service_type === 'pathways'){file_end_point = 'gtfs-pathways'}
  else {file_end_point = 'osw'}
  const response = await axios.post(`${osmUrl}/${file_end_point}/upload/${data[0].tdei_project_group_id}/${data[0].tdei_service_id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('Response:', response);
  return response.data;
}
export async function getDatasets(searchText,pageParam = 1,status,dataType,tdei_project_group_id) {
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
  console.log("my datasets", res.data)
  return {
    data: res.data,
    pageParam,
  };
}
export async function getReleasedDatasets(searchText,pageParam = 1,dataType) {
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
  console.log("released datasets", res.data)
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
  console.log('Response:', res.data);
  return res.data;
}

export async function deleteDataset(tdei_dataset_id){
  const res = await axios.delete(`${osmUrl}/dataset/${tdei_dataset_id}`, tdei_dataset_id);
  console.log('Response:', res.data);
  return res.data;
}