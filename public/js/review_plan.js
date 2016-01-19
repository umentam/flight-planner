/**
 * Created by michaelumenta on 9/19/15.
 */
var planid;
window.onload = function() {
    planid = GetQueryStringParams("id");
    $.get( '/v1/user/' + sessionStorage.getItem("username") + '/plans/' + planid, function( data ) {
            populateFlightPlan(data);
    })
        .error(function(response) {
            alert(response.responseJSON.error);
        });
}
function populateFlightPlan(object) {
    var keys = Object.keys(object);
    for(var i = 0; i < keys.length; i++) {
        $("#review_" + keys[i]).text(object[keys[i]]);
    }
}

function editPlan(){
    $("form").submit(function(e) {
        e.preventDefault();
        location.replace('/edit_plan.html?id=' + planid);
    });
}

function completePlan(){
    $("form").submit(function(e) {
        e.preventDefault();
        $.post('/v1/user/' + sessionStorage.getItem("username") + '/plans/' + planid + '/edit', {active: false})
            .success(function(response) {
                location.replace('/profile');
            })
            .error(function(response) {
                alert(response.responseJSON.error);
            })
    });
}

function deletePlan(){

    $("form").submit(function(e) {
        e.preventDefault();
        $.get('/v1/user/' + sessionStorage.getItem("username") + '/plans/' + planid + '/delete')
            .success(function(response) {
                location.replace('/profile');
            })
            .error(function(response) {
                alert(response.responseJSON.error);
            })
    });
}

