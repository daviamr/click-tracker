import axios from "axios";

export const api = axios.create({
  baseURL: "http://api.bigdates.com.br:3350",
  headers: {
    "Content-Type": "application/json"
  },
});