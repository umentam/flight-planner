/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';

var User = require('../models/user');

import React from 'react';

/*************************************************************************/

export default class RegisterView extends React.Component {
    constructor(props) {
        super(props);
        this.user = new User();
        this.state = this.user.toJSON();
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    handleEmailChange(e) {
        this.props.dispatcher.trigger('set:email', e.target.value);
        this.setState({ primary_email: e.target.value});
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
        console.log(self.state);
        this.user.save(this.state).then(
            function(response) {
                //$.post('/v1/user/' + self.state.username, self.state)
                //    .success(function(response) {
                //        sessionStorage.setItem("state", "Logout");
                //        sessionStorage.setItem("username", response.username);
                //        sessionStorage.setItem("email", response.primary_email)
                //        self.props.router.navigate('profile/' + self.user.get('username'), { trigger: true });
                //    })
                //    .error(function(response) {
                //        alert(response.responseJSON.error)
                //    })
                sessionStorage.setItem("state", "Logout");
                sessionStorage.setItem("username", response.username);
                sessionStorage.setItem("email", response.primary_email)
                self.props.router.navigate('profile/' + self.user.get('username'), { trigger: true });
            },
            function(err) {
                console.log('Error: ' + err.responseJSON.error);
            }
        );
    }

    //onRegister(ev) {
    //    var self = this;
    //    ev.preventDefault();
    //    this.user.save(this.state).then(
    //        function() {
    //            console.log(self.user);
    //            self.props.router.navigate('profile/' + self.user.get('username'), { trigger: true });
    //        },
    //        function(err) {
    //            console.log('Error: ' + err.responseJSON.error);
    //        }
    //    );
    //}


    render() {
        return <form className="form-horizontal well" id="signup-form">
            <div className="form-group">
                <label htmlFor="usernamee" className="col-sm-3 control-label">Username:</label>
                <div className="col-sm-9">
                    <input
                        name="usernamee"
                        type="text"
                        placeholder="Usernamee"
                        className="form-control"
                        value={this.state.usernamee}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="username" className="col-sm-3 control-label">Username:</label>
                <div className="col-sm-9">
                    <input
                        name="username"
                        id="username"
                        type="text"
                        placeholder="Username"
                        className="form-control"
                        value={this.state.username}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="password" className="col-sm-3 control-label">Password:</label>
                <div className="col-sm-9">
                    <input
                        name="password"
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="form-control"
                        value={this.state.password}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="primary_email" className="col-sm-3 control-label">Email Address:</label>
                <div className="col-sm-9">
                    <input
                        name="primary_email"
                        type="email"
                        placeholder="Email Address"
                        className="form-control"
                        value={this.state.primary_email}
                        onChange={this.handleEmailChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="first_name" className="col-sm-3 control-label">First Name:</label>
                <div className="col-sm-9">
                    <input
                        name="first_name"
                        type="text"
                        placeholder="First Name"
                        className="form-control"
                        value={this.state.first_name}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="last_name" className="col-sm-3 control-label">Last Name:</label>
                <div className="col-sm-9">
                    <input
                        name="last_name"
                        type="text"
                        placeholder="Last Name"
                        className="form-control"
                        value={this.state.last_name}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="dob" className="col-sm-3 control-label">DOB:</label>
                <div className="col-sm-9">
                    <input
                        name="dob"
                        type="text"
                        placeholder="DOB"
                        className="form-control"
                        value={this.state.dob}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="address_street" className="col-sm-3 control-label">Address Street:</label>
                <div className="col-sm-9">
                    <input
                        name="address_street"
                        type="text"
                        placeholder="Address Street"
                        className="form-control"
                        value={this.state.address_street}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="address_city" className="col-sm-3 control-label">Address City:</label>
                <div className="col-sm-9">
                    <input
                        name="address_city"
                        type="text"
                        placeholder="Address City"
                        className="form-control"
                        value={this.state.address_city}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="address_zip" className="col-sm-3 control-label">Address Zip:</label>
                <div className="col-sm-9">
                    <input
                        name="address_zip"
                        type="text"
                        placeholder="Address Zip"
                        className="form-control"
                        value={this.state.address_zip}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="primary_phone" className="col-sm-3 control-label">Primary Phone#:</label>
                <div className="col-sm-9">
                    <input
                        name="primary_phone"
                        type="text"
                        placeholder="Phone"
                        className="form-control"
                        value={this.state.primary_phone}
                        onChange={this.handleFormChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                    <button className="btn btn-primary" onClick={this.onRegister}>Register</button>
                </div>
            </div>
            <script src="http://jqueryvalidation.org/files/dist/jquery.validate.min.js"></script>
            <script src="js/form-methods.js"></script>
            <script src="js/signup.js"></script>
        </form>;
    }
}

RegisterView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};