import axios from "axios";
const https = require("https");

//simple boilerplate constant that handles basic api requests. This is used multiple places with varying inputs.
//it takes a configuration object, along with 2 references to funtions that triggers in either success or failure scenarios

const httpsAgent = new https.Agent({
  maxVersion: "TLSv1.2",
  minVersion: "TLSv1.2",
});

export const apiHandler = (config, returnMethod, errorMethod) => {
  // send payload
  axios(config, httpsAgent)
    .then((response) => {
      returnMethod(response);
    })
    .catch((error) => {
      errorMethod(error);
    });
};
