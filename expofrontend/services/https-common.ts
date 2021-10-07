import axios from "axios";

export default axios.create({
  baseURL: "https://weather.elcoyote.dk",
  headers: {
    "Content-type": "application/json"
  }
});