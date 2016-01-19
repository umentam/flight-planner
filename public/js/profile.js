var username;
window.onload = function() {
    //if(!/[?&]username=/.test(location.href)){
    //    location.replace('/profile?username=' + sessionStorage.getItem("username"));
    //}
    changeGravatarPic("#gravatar-profile");
    toggleEditButton();
    username = GetQueryStringParams("username");
    loadPlans();
    $.get( "/v1/user/" + username, function( data ) {
        $("#prof_username").text($("#prof_username").text() + " " + data.username);
        $("#panel-title").text(data.first_name + " " + data.last_name);
        $("#prof_dob").text($("#prof_dob").text() + " " + data.dob);
        $("#prof_street").text($("#prof_street").text() + " " + data.address_street);
        $("#prof_city").text($("#prof_city").text() + " " + data.address_city);
        $("#prof_zip").text($("#prof_zip").text() + " " + data.address_zip);
        $("#prof_phone").text($("#prof_phone").text() + " " + data.primary_phone);
        $("#prof_email").text($("#prof_email").text() + " " + data.primary_email);


    })
        .error(function(response) {
            console.log(response.responseJSON.error);
        });

}

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

function goToEditMode() {
    location.replace('/edit');
}


function createPlan() {
    location.replace('/plan.html?username=' + sessionStorage.getItem("username"));
}

function toggleEditButton() {
    var username = GetQueryStringParams("username");
    if (username == sessionStorage.getItem("username")) {
        $("#edit-prof").show();
        $("#edit-plan").show();
    }
    else {
        $("#edit-prof").hide();
        $("#edit-plan").hide();
    }
}

function getProfile(){
    location.replace('/profile/' + sessionStorage.getItem("username"));
}

function loadPlans() {
    $.ajax({
        url: "/v1/user/" + sessionStorage.getItem("username") + "/plans",
        type: "GET",
        success: function (plans) {
            var tmpl = _.template("<% _.each(plans, function(plan) { %><tr><td><p>Date: <a href='review_plan.html?id=<%= plan._id %>'><%= plan.date %></a></p><% %><p>From: <%= plan.departure %></p><% %><p>To: <%= plan.dst %></p></td></tr><%});%>");
            var data = tmpl({ plans: plans });
            $('#planHolder').append(data);
        },
        error: function (err) {
            console.log('Error: ' + JSON.stringify(err.responseJSON));
        }
    });
}


