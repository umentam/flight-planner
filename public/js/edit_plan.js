/**
 * Created by michaelumenta on 9/16/15.
 */
var planid;
window.onload = function(){
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    $( "#flight-plan-form" ).validate();
    $("#flight-plan-form").submit(function(e){
        e.preventDefault();
        var form = $(this);
        var data = {};
        data = ConvertFormToJSON(form);
        planid = GetQueryStringParams("id");
        $.post('/v1/user/' + sessionStorage.getItem("username") + '/plans/' + planid + '/edit', data)
            .success(function(response) {
                location.replace('/profile');
            })
            .error(function(response) {
                alert(response.responseJSON.error);
            })
    });
};

function GetQueryStringParams(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}