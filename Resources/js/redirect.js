/* PRIMARY MIRROR REDIRECT - IF THE PRIMARY MIRROR IS ONLINE, REDIRECT THERE INSTEAD */
var primaryMirror = "https://snailien.ddns.net/RTN/";
var alreadyOnPrimary = (-1 != window.location.href.indexOf(primaryMirror.replace(/^(?:https?)?(?::\/\/)?(?:www\.)?/gm, "")));
if (!alreadyOnPrimary) { //if we are already on the primary mirror, we don't need to move
    async function checkAndRedirect(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.debug(`Primary Mirror ${url} appears to be ONLINE (returned status ${response.status}).`);
                redirectToPrimary(url);
            } else {
                console.debug(`Primary Mirror ${url} appears to be OFFLINE (returned status ${response.status}).`);
            }
        } catch (error) {
            console.debug(`An error occurred accessing Primary Mirror ${url}.`, error);
        }
    }

    function redirectToPrimary(url) {
        alert(`You are not using the primary copy of this site. You will now be redirected to the same document on the official site.\n\nThe primary copy of the RTN is hosted at ${url}.\n\nIn the event of the primary copy going offline, this redirect will not occur.`);
        var payload = window.location.href.split("?")[1];
        var redir = url + "program.html";
        if (payload) // add url data only if there is some, otherwise leave blank for landing page
        {
            redir += "?" + payload;
        }
        window.location.replace(redir);
    }
    checkAndRedirect(primaryMirror);
}