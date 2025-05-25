const base_url = 'https://api.football-data.org/v4/';
const api_token = '20688b5692d54b4a92012cc8da88b81b';
const endpoint = `${base_url}competitions/2021/standings`;
const endpoint_jadwal = `${base_url}competitions/2021/matches?status=SCHEDULED&limit=20`;
const endpoint_match = `${base_url}matches/`;

var fetchApi = url => {
  return fetch(url, {
      headers: {
          'X-Auth-Token': '20688b5692d54b4a92012cc8da88b81b'
      }
  });
}

function status(response) {
  if (response.status !== 200) {
    console.log(`Error : ${response.status}`);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log(`Error : ${error}`);
}

function getStanding() {
  if ('caches' in window) {
    caches.match(endpoint).then((response) => {
      if (response) {
        response.json().then((data) => {
          console.log(`Competition Data: ${data}`);
          showStanding(data);
        });
      }
    });
  }
  fetchApi(endpoint)
    .then(status)
    .then(json)
    .then((data) => {
      showStanding(data);
    })
    .catch(error);
}

function getMatchLeague() {
  return new Promise(function (resolve, reject) {
      if ('caches' in window) {
          caches.match(endpoint_jadwal).then(function (response) {
              if (response) {
                  response.json().then(function (data) {
                      resultMatchJSON(data);
                      resolve(data);
                  });
              }
          });
      }
      fetchApi(endpoint_jadwal)
          .then(status)
          .then(json)
          .then(function (data) {
              resultMatchJSON(data);
              resolve(data);
          })
          .catch(error);
  });
}

function getDetailMatchById() {
  return new Promise(function (resolve, reject) {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get("id");
      if ('caches' in window) {
          caches.match(endpoint_match + idParam).then(function (response) {
              if (response) {
                  response.json().then(function (data) {
                      resultDetailMatchJSON(data);
                      resolve(data)
                  });
              }
          });
      }
      fetchApi(endpoint_match + idParam)
          .then(status)
          .then(json)
          .then(function (data) {
              resultDetailMatchJSON(data);
              resolve(data);
          })
          .catch(error);
  });
}
