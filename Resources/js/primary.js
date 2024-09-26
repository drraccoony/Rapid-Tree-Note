import Schema from "../../Code/exe/main.js";
var MainBuffer = new Schema(document.getElementById("source"), document.getElementById("display"), document.getElementById("wrap-tester"));
window.main = MainBuffer;

window.lockout = function () {
    window.main.safeShutdown();
    document.getElementById("source").style.pointerEvents = "none";
    document.getElementById("source").disabled = true;
    document.getElementById("source").hidden = true;
    document.getElementById("display").style.pointerEvents = "all";
    alert("Document is in READ-ONLY mode.\n\nYou are viewing this document on Mobile.\nFor full functionality, please visit this website on a computer.");
}

//enter read-only mode if on mobile
setTimeout(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.lockout();
    }
}, 250);