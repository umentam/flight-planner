/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';

var User = require('../models/user');

import React from 'react';

/*************************************************************************/

export default class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.toggleEditButton = this.toggleEditButton.bind(this);
        this.goToEditMode = this.goToEditMode.bind(this);
        this.changeGravatarPic = this.changeGravatarPic.bind(this);
        this.getGravatarUrl = this.getGravatarUrl.bind(this);
        this.createPlan = this.createPlan.bind(this);
        this.loadPlans = this.loadPlans.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    componentDidMount() {
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
            this.changeGravatarPic("#nav-gravatar");
            $("#nav-gravatar").show();
        }
        else {
            $("#nav-signup").show();
            $("#nav-profile").show();
            $("#nav-gravatar").hide();
        }
        var username = sessionStorage.getItem("username");
        this.changeGravatarPic("#gravatar-profile");
        this.toggleEditButton();
        this.loadPlans();
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


    handleFormChange(e) {
        switch(e.target.getAttribute('name')) {
            case 'username': this.setState({ username: e.target.value}); break;
            case 'password': this.setState({ password: e.target.value}); break;
            case 'first_name': this.setState({ first_name: e.target.value}); break;
            case 'last_name': this.setState({ last_name: e.target.value}); break;
            case 'dob': this.setState({ dob: e.target.value}); break;
            case 'address_street': this.setState({ address_street: e.target.value}); break;
            case 'address_city': this.setState({ address_city: e.target.value}); break;
            case 'address_zip': this.setState({ address_zip: e.target.value}); break;
            case 'primary_phone': this.setState({ primary_phone: e.target.value}); break;
        }
    }

    onRegister(ev) {
        var self = this;
        ev.preventDefault();
        this.user.save(this.state).then(
            function() {
                self.props.router.navigate('profile/' + self.user.get('username'), { trigger: true });
            },
            function(err) {
                console.log('Error: ' + err.responseJSON.error);
            }
        );
    }

    toggleEditButton() {
        var username = sessionStorage.getItem("username");
        if (username) {
            $("#edit-prof").show();
            $("#edit-plan").show();
        }
        else {
            $("#edit-prof").hide();
            $("#edit-plan").hide();
        }
    }

    goToEditMode() {
        location.replace('/edit');
    }

    createPlan() {
        location.replace('/plan.html?username=' + sessionStorage.getItem("username"));
    }

    getGravatarUrl() {
        var gravatar = 'http://www.gravatar.com/avatar/';
        var userGravatar = gravatar + md5(sessionStorage.getItem("email"));
        return userGravatar
    }

    changeGravatarPic(id){
        var url = this.getGravatarUrl()
        $(id).attr("src", url);
    }

    loadPlans() {
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

    render() {
        return <div>
            <h3 className="col-sm-offset-2">User Profile</h3>
            <h3 className="col-sm-offset-2">User Profile</h3>
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 id="panel-title" className="panel-title">First Name Last Name</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div align="center" className="col-md-3 col-lg-3"><img id="gravatar-profile" alt="User Pic" src="" className="img-circle img-responsive"/>
                                        <button id="edit-prof" onclick="goToEditMode()" className="edit-btn">Edit Profile</button>
                                    </div>
                                    <div className="col-md-9 col-lg-9">
                                        <table className="table table-user-information">
                                            <tbody>
                                            <tr>
                                                <td id="prof_username">Username:</td>
                                            </tr>
                                            <tr>
                                                <td id="prof_dob">DOB:</td>
                                            </tr>
                                            <tr>
                                                <td id="prof_street">Address Street:</td>
                                            </tr>
                                            <tr>
                                                <td id="prof_city">Address City:</td>
                                            </tr>
                                            <tr>
                                                <td id="prof_state">Address State:</td>
                                            </tr>
                                            <tr>
                                                <td id="prof_zip">Address ZipCode:</td>
                                            </tr>
                                            <tr>
                                                <td id="prof_phone">Phone:</td>
                                            </tr>
                                            <tr>
                                                <td id="prof_email">Email:</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title">Active Flight Plans</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div align="center" className="col-md-3 col-lg-3">
                                        <button id="edit-plan" onclick="createPlan()" className="edit-btn">Create New Flight Plan</button>
                                    </div>
                                    <div className="col-md-9 col-lg-9">
                                        <table className="table table-user-information">
                                            <tbody id="planHolder"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

ProfileView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};