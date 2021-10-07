import axios from "axios";

export default axios.create({
  baseURL: "https://weather.elcoyote.dk",
  timeout: 2000,
  headers: {
    "Content-type": "application/json"
  }
});