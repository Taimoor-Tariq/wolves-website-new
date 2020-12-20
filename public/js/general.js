function openNav() {
    document.getElementById("mNav").style.height = "100%";
    document.getElementById("headerBar").style.display = "none";
}

function closeNav() {
    document.getElementById("mNav").style.height = "0%";
    document.getElementById("headerBar").style.display = "block";
}

function openShop() {
    window.open("https://sectorsixapparel.com/collections/wichita-wolves", "_blank")
}

function openUrl(url) {
    window.open(url, "_blank")
}