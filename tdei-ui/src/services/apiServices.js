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
