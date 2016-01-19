/**
 * Created by michaelumenta on 10/9/15.
 */
document.ready = function() {
    if(sessionStorage.getItem("state") === null){
        sessionStorage.setItem("state", "Login");
        $("#nav-login").text(sessionStorage.getItem("state"));
    }
    if (window.location.pathname == "/login") {
        if (sessionStorage.getItem("username") !== null) {
            sessionStorage.setItem("username", null);
            sessionStorage.setItem("email", null);
            sessionStorage.setItem("state", "Login");
        }
    }
    else {
        $("#nav-login").text(sessionStorage.getItem("state"));
    }
    if(sessionStorage.getItem("state") == "Logout"){
        $("#nav-signup").hide();
        $("#nav-profile").hide();
        changeGravatarPic("#nav-gravatar");
        $("#nav-gravatar").show();
    }
    else {
        $("#nav-signup").show();
        $("#nav-profile").show();
        $("#nav-gravatar").hide();
    }
}

function getGravatarUrl() {
    var gravatar = 'http://www.gravatar.com/avatar/';
    var userGravatar = gravatar + md5(sessionStorage.getItem("email"));
    return userGravatar
}

function changeGravatarPic(id){
    var url = getGravatarUrl()
    $(id).attr("src", url);
}
