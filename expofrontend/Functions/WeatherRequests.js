import axios from "axios";

export const apiHandler = (config, returnMethod, errorMethod) => {
  axios(config)
    .then((response) => {
      returnMethod(response);
    })
    .catch((error) => {
      errorMethod(error);
    });
};
