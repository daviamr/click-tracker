import axios from "axios";

export const aws = 'https://cdn-encurtador.bigdates.com.br/';

export const api = axios.create({
  baseURL: "https://api.bigdates.com.br:3350",
  headers: {
    "Content-Type": "application/json"
  },
});