function showStanding(data) {
    var standings = '';
    var standingElm = document.getElementById('standings');

    data.standings[0].table.forEach((standing) => {
        standings += `
          <style>
            .teams {
              font-size: 20px;
            }
            img {
              width: 120px;
            }
          </style>
          <table class="z-depth-1">
            <tr class="teams">
              <td></td>
              <td><a class="linked bold-text" href="#team?id=${standing.team.id}">${standing.team.name}</a><p>${standing.won} <span class="green-text">Win</span></p><p>${standing.draw} <span class="grey-text">Draw</span></p><p>${standing.lost} <span class="red-text">Lose</span></p></td>
              <td>Poin : ${standing.points}<br>Posisi ke- ${standing.position}</td>
              <td><img class="responsive-img" src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="Logo Tim"/></td>
            </tr>
          </table>
          <br>
        `;
      });
    
      standingElm.innerHTML = `
      ${standings}
      `;
}
    
function resultMatchJSON(data) {
  var JadwalHTML = ''
  data.matches.forEach(function (match) {
    JadwalHTML += `
        <div class="col s12 m6 l6">
        <div class="card teal lighten-1">
          <div class="card-content">
            <div center-align>
              <h5 class="white-text">Matchday : ${match.matchday}</h5>
              <div class="center-align">Kick Off : ${match.utcDate}</div>
        
              <div class="row" style="margin:20px">
                <div>
                  <span class="white-text text-center"> ${match.homeTeam.name}</span>
                </div>
                  VS
                <div>
                  <span class="white-text text-center"> ${match.awayTeam.name}</span>
                </div>
              </div>
              <div class="center-align">
                <a class="red waves-effect waves-light btn" href="./detail_match.html?id=${match.id}">Lihat Detail</a>
              </div>
            </div>
          </div>
        </div>
      </div>`
  });
  document.getElementById("jadwal-content").innerHTML = JadwalHTML;
}

function resultDetailMatchJSON(data) {
  var matchDay = data.match.matchday;
  var kickOff = data.match.utcDate;
  var homeTeamName = data.match.homeTeam.name;
  var awayTeamName = data.match.awayTeam.name;
  var venue = data.match.venue;
  
  document.getElementById("a-matchDay").innerHTML = `Matchday : ${matchDay}`;
  document.getElementById("a-kickOff").innerHTML = `Kick Off : ${kickOff}`;
  document.getElementById("a-homeTeamName").innerHTML = homeTeamName;
  document.getElementById("a-awayTeamName").innerHTML = awayTeamName;
  document.getElementById("a-venue").innerHTML = `Venue : ${venue}`;
  document.getElementById("a-preloader").innerHTML = '';
}
  
function resultMatchFav(data) {
      var dataMatchFavHtml = ''
      data.forEach(function (match) {
      dataMatchFavHtml += `
      <div class="col s12 m6 l6">
          <div class="card teal lighten-1">
              <div class="card-content text-center">
                  <div center-align>
                      <h5 class="center-align white-text">Matchday : ${match.match.matchday}</h5>
                      <div class="center-align">Kick Off : ${match.match.utcDate}</div>
  
                      <div class="row" style="margin:20px">
                          <div>
                              <span class="white-text">  ${match.match.homeTeam.name}</span>
                          </div>
                            VS
                          <div>
                              <span class="white-text">  ${match.match.awayTeam.name}</span>
                          </div>
                      </div>
                      <div class="center-align">
                          <a class="red waves-effect waves-light btn" href="./detail_match.html?id=${match.id}">Lihat Detail</a>
                      </div>  
                  </div>
              </div>
          </div>
      </div>`
      });    
      document.getElementById("a-favorit-load").innerHTML = dataMatchFavHtml;
}

function databasePromise(idb) {
      var dbPromise = idb.open("premier-league", 1, function (upgradeDb) {
          if (!upgradeDb.objectStoreNames.contains("match_favorit")) {
              var indexFavMatch = upgradeDb.createObjectStore("match_favorit", {
                  keyPath: "id"
              });
              indexFavMatch.createIndex("homeTeam", "match.homeTeam.name", {
                  unique: false
              });
              indexFavMatch.createIndex("awayTeam", "match.awayTeam.name", {
                  unique: false
              });
          }
      });
      return dbPromise;
}

function checkData(storeName, id) {
      return new Promise(function (resolve, reject) {
          databasePromise(idb)
              .then(function (db) {
                  var tx = db.transaction(storeName, "readonly");
                  var store = tx.objectStore(storeName);
                  return store.get(id);
              })
              .then(function (data) {
                  if (data !== undefined) {
                      resolve("Data favorit")
                  } else {
                      reject("Bukan data favorit")
                  }
              });
      });
}

function createDataFav(dataType, data) {
      var storeName = "";
      var dataToCreate = {}
      if (dataType == "match") {
          storeName = "match_favorit"
          dataToCreate = {
              id: data.match.id,
              match: {
                  utcDate: data.match.utcDate,
                  venue: data.match.venue,
                  matchday: data.match.matchday,
                  homeTeam: {
                      name: data.match.homeTeam.name
                  },
                  awayTeam: {
                      name: data.match.awayTeam.name
                  }
              }
          }
      }
  
      databasePromise(idb).then(db => {
          const tx = db.transaction(storeName, 'readwrite');
          tx.objectStore(storeName).put(dataToCreate);
  
          return tx.complete;
      }).then(function () {
          console.log('Team berhasil disimpan.');
          document.getElementById("iconFav").classList.add('fas');
          document.getElementById("iconFav").classList.add('fa-star');
          document.getElementById("iconFav").innerHTML = " Favorit";
          M.toast({
              html: 'Berhasil Ditambahkan ke Favorit!'
          });
      }).catch(function () {
          M.toast({
              html: 'Terjadi Kesalahan'
          });
      });
}

function deleteDatafav(storeName, data) {
      databasePromise(idb).then(function (db) {
          var tx = db.transaction(storeName, 'readwrite');
          var store = tx.objectStore(storeName);
          store.delete(data);
          return tx.complete;
      }).then(function () {
          console.log('Item deleted');
          document.getElementById("iconFav").classList.remove('fas');
          document.getElementById("iconFav").classList.add('far');
          document.getElementById("iconFav").classList.add('fa-star');
          document.getElementById("iconFav").innerHTML = " Tambah Ke Favorit";
          M.toast({
              html: 'Data berhasil dihapus dari Favorit!'
          });
      }).catch(function () {
          M.toast({
              html: 'Terjadi Kesalahan'
          });
      });
}

function getSavedDataById(dataType) {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = Number(urlParams.get("id"));

    if  (dataType == "player") {
        getDataById("player_favorit", idParam).then(function (player) {
            resultDetailPlayerJSON(player);
        });
    } else if (dataType == "match") {
        getDataById("match_favorit", idParam).then(function (match) {
            resultDetailMatchJSON(match);
        });
    }
}

function getDataById(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.get(id);
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function getAllData(storeName) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.getAll();
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function readDataFavHtml(dataType) {
    if (dataType == "match") {
        getAllData("match_favorit").then(function (data) {
            resultMatchFav(data);
        });
    }
}