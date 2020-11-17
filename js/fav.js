document.addEventListener("DOMContentLoaded", () => {
    let urlParams = new URLSearchParams(window.location.search);
    let id = Number(urlParams.get("id"));
    let isFavorit = false
    checkData("match_favorit", id).then((msg) => {
        console.log("statusData: resolve = " + msg)
        document.getElementById("iconFav").innerHTML = " Favorit"
        getSavedDataById("match")
        isFavorit = true
    }).catch((msg) => {
        console.log("statusData: reject = " + msg)
        document.getElementById("iconFav").innerHTML = " Tambah Ke Favorit"
        getDetailMatchById()
        isFavorit = false
    })
    

    let iconFav = document.getElementById("iconFav");

    iconFav.onclick = function () {
        console.log("Tombol Favorit di klik.");
        if (isFavorit) {
            deleteDatafav("match_favorit", id);
            isFavorit = false
        } else {
            items = getDetailMatchById();
            items.then(function (match) {
                createDataFav("match", match);
            });
            isFavorit = true
        }
    };
});