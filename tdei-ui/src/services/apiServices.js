import axios from "axios";

export const url = process.env.REACT_APP_URL;
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
export async function getServices(searchText, tdei_project_group_id, pageParam = 1, isAdmin) {
  const res = await axios({
    url: `${url}/service`,
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
export async function getService(tdei_service_id, tdei_project_group_id, pageParam = 1) {
  const res = await axios({
    url: `${url}/service`,
    params: {
      tdei_service_id,
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
