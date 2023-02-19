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
  const { org_id, status } = data;
  const res = await axios.delete(
    `${url}/organization/${org_id}/active/${status}`
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

export async function getOrgLists(searchText, pageParam = 1, queryKey) {
  console.log(queryKey);
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

export async function postAssignRoles(data) {
  const res = await axios.post(`${url}/permission`, data);
  return res.data;
}

export async function postCreateService(data) {
  const res = await axios.post(`${url}/service`, data);
  return res.data;
}

export async function postCreateStation(data) {
  const res = await axios.post(`${url}/station`, data);
  return res.data;
}
