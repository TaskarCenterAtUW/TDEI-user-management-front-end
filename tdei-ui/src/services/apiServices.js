import axios from 'axios';

let url = 'https://tdei-usermanagement-ts-dev.azurewebsites.net/api/v1';

export async function postOrganisationCreation(data) {
    const res = await axios.post(`${url}/organization`, data);
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
