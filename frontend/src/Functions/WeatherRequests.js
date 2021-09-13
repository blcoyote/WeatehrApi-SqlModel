import axios from 'axios'


function GetWeather(url, successCallback, errorCallback  ) {
    console.log('test');
    axios.get(url)
        .then(response => {
            console.error('succes');
            successCallback(response.json())
        })
        .catch(error => {
            console.error('There was an error!', error);
            errorCallback(error);

        });
}

export default GetWeather;