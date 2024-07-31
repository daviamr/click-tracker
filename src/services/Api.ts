import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.bigdates.com.br:3350",
  headers: {
    "Content-Type": "application/json"
  },
});