/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';

import React from 'react';

/*************************************************************************/

export default class ReviewPlanView extends React.Component {

    constructor(props) {
        super(props);
        this.GetQueryStringParams = this.GetQueryStringParams.bind(this);
        this.populateFlightPlan = this.populateFlightPlan.bind(this);
        this.editPlan = this.editPlan.bind(this);
        this.completePlan = this.completePlan.bind(this);
        this.deletePlan = this.deletePlan.bind(this);
        this.state = {planid: ''};
    }


    GetQueryStringParams(sParam)
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


    componentDidMount(){
        this.state.planid = this.GetQueryStringParams("id");
        $.get( '/v1/user/' + sessionStorage.getItem("username") + '/plans/' + this.state.planid, function( data ) {
            populateFlightPlan(data);
        })
            .error(function(response) {
                alert(response.responseJSON.error);
            });
    }

    populateFlightPlan(object) {
        var keys = Object.keys(object);
        for(var i = 0; i < keys.length; i++) {
            $("#review_" + keys[i]).text(object[keys[i]]);
        }
    }

    editPlan(){
        $("form").submit(function(e) {
            e.preventDefault();
            location.replace('/edit_plan.html?id=' + this.state.planid);
        });
    }

    completePlan(){
        $("form").submit(function(e) {
            e.preventDefault();
            $.post('/v1/user/' + sessionStorage.getItem("username") + '/plans/' + this.state.planid + '/edit', {active: false})
                .success(function(response) {
                    location.replace('/profile');
                })
                .error(function(response) {
                    alert(response.responseJSON.error);
                })
        });
    }

    deletePlan(){

        $("form").submit(function(e) {
            e.preventDefault();
            $.get('/v1/user/' + sessionStorage.getItem("username") + '/plans/' + this.state.planid + '/delete')
                .success(function(response) {
                    location.replace('/profile');
                })
                .error(function(response) {
                    alert(response.responseJSON.error);
                })
        });
    }

    render() {
        return <div class="fplan" styles="margin:20px">
            <form role="form" action="/file_plan" method="post">
                <div class=" row0 fplan" id="t1">
                    <img id="faa" src="http://ops.fhwa.dot.gov/Weather/resources/publications/tcmintegration/images/fhwa_shield.jpg"/>
                    FLIGHT PLAN
                    <p class="text-small">U.S DEPARTMENT OF TRANSPORTATION FEDERAL AVIATION ADMINISTRATION</p>
                </div>
                <div class=" row0 fplan silver" id="t2">
                    <span>(FAA USE ONLY)</span>
                    <span id="sp2">PILOT BRIEFING</span>
                    <span id="sp3">VNR</span>
                    <span id="sp4">STOPOVER</span>
                </div>
                <div class=" row0 fplan text-small silver" id="t3">
                    TIME STARTED
                </div>
                <div class=" row0 fplan text-small silver" id="t4">
                    SPECIALIST INITIALS
                </div>
                <div class="row1 fplan" id="q1">
                    1. TYPE
                    <h5 id="review_type"></h5>
                </div>
                <div class="row1 fplan text-small" id="q2">
                    2. AIRCRAFT IDENTIFICATION
                    <h5 id="review_ident"></h5>
                </div>
                <div class="row1 fplan text-small" id="q3">
                    3. AIRCRAFT TYPE/SPECIAL EQUIPMENT
                    <h5 id="review_special_equip"></h5>
                </div>
                <div class="row1 fplan text-small" id="q4">
                    4. TRUE AIRSPEED
                    <h5 id="review_true_airspeed"></h5>
                </div>
                <div class="row1 fplan text-small" id="q5">
                    5. DERPARTURE POINT
                    <h5 id="review_departure"></h5>
                </div>
                <div class="row1 fplan text-small" id="q6">
                    6. DERPARTURE TIME
                </div>
                <div class="row1 fplan text-small" id="q61">
                    PROPOSED(Z)
                    <h5 id="review_dept_time_proposed"></h5>
                </div>
                <div class="row1 fplan text-small" id="q62">
                    ACTUAL(Z)
                    <h5 id="review_dept_time_actual"></h5>
                </div>
                <div class="row1 fplan text-small" id="q7">
                    7. CRUISING ALTITUDE
                    <h5 id="review_cruise_alt"></h5>
                </div>
                <div class="row2 fplan text-small-left">
                    8. ROUTE OF FLIGHT
                    <h5 id="review_route"></h5>
                </div>
                <div class="row3 fplan text-small-left" id="q9">
                    9. DESTINATION (Name of airport and city)
                    <h5 id="review_dst"></h5>
                </div>
                <div class="row3 fplan text-small" id="q10">
                    10. EST. TIME ENROUTE
                </div>
                <div class="row3 fplan text-small" id="q101">
                    HOURS
                    <h5 id="review_ete"></h5>
                </div>
                <div class="row3 fplan text-small" id="q102">
                    MINUTES
                    <h5 id="review_ete_min">00</h5>
                </div>
                <div class="row3 fplan text-small-left" id="q11">
                    11. REMARKS
                    <h5 id="review_remarks"></h5>
                </div>
                <div class="row4 fplan text-small" id="q12">
                    12. FUEL ON BOARD
                </div>
                <div class="row4 fplan text-small" id="q121">
                    HOURS
                    <h5 id="review_fuel"></h5>
                </div>
                <div class="row4 fplan text-small" id="q122">
                    MINUTES
                    <h5 id="review_fuel_min">00</h5>
                </div>
                <div class="row4 fplan text-small-left" id="q13">
                    13. ALTERNATE AIRPORTS(S)
                    <h5 id="review_alt_airports"></h5>
                </div>
                <div class="row4 fplan text-small-left" id="q14">
                    14. PILOT'S NAME, ADDRESS and TELEPHONE NUMBER and AIRCRAFT HOME BASE
                    <h5 id="review_name"></h5>
                </div>
                <div class="row4 fplan text-small-left" id="q15">
                    15. NUMBER ABOARD
                    <h5 id="review_num_aboard"></h5>
                </div>
                <div class="row5 fplan text-small-left" id="q16">
                    16. COLOR OF AIRCRAFT
                    <h5 id="review_color"></h5>
                </div>
                <div class="row4 fplan text-small-left" id="q17">
                    17. DESTINATION CONTACT/TELEPHONE (OPTIONAL)
                    <h5 id="review_dst_contact"></h5>
                </div>
                <div class="row5 fplan text-med-left" id="q18">
                    CIVIL AIRCRAFT PILOTS. FAR Part 91 requires you file an IFR flight plan to operate under instrument flight rules in
                    controlled airspace. Failure to file could result in a civil penalty not to exceed $1,000 for each violation (Section 901 of the
                    Federal Aviation Act of 1958, as amended). Filing of a VFR flight plan is recommended as a good operating practice. See
                    also Part 99 for requirements concerning DVFR flight plans.
                </div>

                <div class="plan-buttons">
                    <button id="edit" onclick='editPlan()' name="button3id" class="btn btn-success">Edit Plan</button>
                    <button id="complete" onclick='completePlan()' name="button1id" class="btn btn-success">Complete Plan</button>
                    <button id="delete" onclick='deletePlan()' name="button2id" class="btn btn-danger">Delete Plan</button>
                </div>
            </form>
        </div>;
    }
}

ReviewPlanView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};