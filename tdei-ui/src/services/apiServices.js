import axios from "axios";

export const url =
  "https://tdei-usermanagement-ts-dev.azurewebsites.net/api/v1";

export async function postOrganisationCreation(data) {
  const res = await axios.post(`${url}/organization`, data);
  return res.data;
}

export async function postOrganisationUpdate(data) {
  const res = await axios.put(`${url}/organization`, data);
  return res.data;
}

export async function postOrganisationDelete(data) {
  const { tdei_org_id, status } = data;
  const res = await axios.delete(
    `${url}/organization/${tdei_org_id}/active/${status}`
  );
  return res.data;
}

export async function postServiceDelete(data) {
  const { tdei_service_id, status,tdei_org_id } = data;
  const res = await axios.delete(
    `${url}/service/${tdei_org_id}/${tdei_service_id}/active/${status}`
  );
  return res.data;
}

export async function postStationDelete(data) {
  const { tdei_station_id, status, tdei_org_id } = data;
  const res = await axios.delete(
    `${url}/station/${tdei_org_id}/${tdei_station_id}/active/${status}`
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

export async function getOrgRoles({ queryKey }) {
  const [, userId] = queryKey;
  const res = await axios.get(`${url}/org-roles/${userId}`);
  return res.data;
}

export async function getOrgList(searchText, page_no) {
  const res = await axios({
    url: `${url}/organization`,
    params: {
      searchText,
      page_no,
      page_size: 10,
    },
    method: "GET",
  });
  return res.data;
}

export async function getOrgLists(searchText, pageParam = 1) {
  const res = await axios({
    url: `${url}/organization`,
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

export async function getOrgUsers(searchText, tdei_org_id, pageParam = 1) {
  const res = await axios({
    url: `${url}/organization/${tdei_org_id}/users`,
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

export async function getServices(searchText, tdei_org_id, pageParam = 1) {
  const res = await axios({
    url: `${url}/service`,
    params: {
      searchText,
      page_no: pageParam,
      page_size: 10,
      tdei_org_id: tdei_org_id,
    },
    method: "GET",
  });
  return {
    data: res.data,
    pageParam,
  };
}

export async function getStations(searchText, tdei_org_id, pageParam = 1) {
  const res = await axios({
    url: `${url}/station`,
    params: {
      searchText,
      page_no: pageParam,
      page_size: 10,
      tdei_org_id: tdei_org_id,
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
  const res = await axios.put(`${url}/service/${data.tdei_org_id}`, data);
  return res.data;
}

export async function postUpdateStation(data) {
  const res = await axios.put(`${url}/station/${data.tdei_org_id}`, data);
  return res.data;
}

export async function postCreateStation(data) {
  const res = await axios.post(`${url}/station`, data);
  return res.data;
}
