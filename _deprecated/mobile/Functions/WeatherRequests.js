import axios from "axios";

//simple boilerplate constant that handles basic api requests. This is used multiple places with varying inputs.
//it takes a configuration object, along with 2 references to funtions that triggers in either success or failure scenarios

export const apiHandler = (config, returnMethod, errorMethod) => {
    // send payload
    axios(config)
        .then((response) => {
            returnMethod(response);
        })
        .catch((error) => {
            errorMethod(error);
        });
};
