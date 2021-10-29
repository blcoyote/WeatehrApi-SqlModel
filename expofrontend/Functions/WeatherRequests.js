export async function apiContent(configuration, returnMethod, errorMethod) {
  console.log(configuration);
  const response = await fetch(configuration.url, configuration);
  const json = await response
    .json()
    .then((response) => {
      returnMethod(response);
    })
    .catch((error) => {
      errorMethod(error);
    });
}
