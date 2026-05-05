import axios from "axios";

const API_BASE = "http://localhost:5000";

export const apiGet = async (url, token) => {
  return axios
    .get(API_BASE + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};


export const apiPost = async (url, data, token) => {
  return axios
    .post(API_BASE + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const apiPut = async (url, data, token) => {
  return axios
    .put(API_BASE + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
