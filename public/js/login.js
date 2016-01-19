/**
 * Created by michaelumenta on 9/16/15.
 */
$(document).ready(function(){
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    $( "#login-form" ).validate();
    $("#login-form").submit(function(e){
        e.preventDefault();
        var form = $(this);
        var data = {};
        data = ConvertFormToJSON(form);
        $.post('/v1/session', data)
            .success(function(response) {
                sessionStorage.setItem("state", "Logout");
                sessionStorage.setItem("username", response.username);
                sessionStorage.setItem("email", response.primary_email)
                location.replace('/map');
            })
            .error(function(response) {
                alert(response.responseJSON.error);
            })
    });
});