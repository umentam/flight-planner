/* Copyright G. Hemingway, 2015 - All rights reserved */
'use strict';

import React from 'react';

/*************************************************************************/

export default class PlanView extends React.Component {

    constructor(props) {
        super(props);
        this.GetQueryStringParams = this.GetQueryStringParams.bind(this);
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
        //jQuery.validator.setDefaults({
        //    debug: true,
        //    success: "valid"
        //});
        //$( "#flight-plan-form" ).validate();
        $("#flight-plan-form").submit(function(e){
            e.preventDefault();
            var form = $(this);
            var data = {};
            data = ConvertFormToJSON(form);
            var username = GetQueryStringParams("username");
            data.param = username;
            $.post('/v1/plan', data)
                .success(function(response) {
                    location.replace(' /review_plan.html?id=' + response.planid);
                })
                .error(function(response) {
                    alert(response.responseJSON.error);
                })
        });
    }


    render() {
        return <div styles="margin:20px" className="fplan">
            <form id="flight-plan-form" role="form">
                <div id="t1" className="row0 fplan"><img id="faa" src="http://ops.fhwa.dot.gov/Weather/resources/publications/tcmintegration/images/fhwa_shield.jpg"/>               FLIGHT PLAN
                    <p className="text-small">U.S DEPARTMENT OF TRANSPORTATION FEDERAL AVIATION ADMINISTRATION</p>
                </div>
                <div id="t2" className="row0 fplan silver"><span>(FAA USE ONLY)</span><span id="sp2">PILOT BRIEFING</span><span id="sp3">VNR</span><span id="sp4">STOPOVER</span></div>
                <div id="t3" className="row0 fplan text-small silver">TIME STARTED</div>
                <div id="t4" className="row0 fplan text-small silver">SPECIALIST INITIALS</div>
                <div id="q1" className="row1 fplan">1. TYPE
                    <input id="type" type="text" name="type" required="" className="field"/>
                </div>
                <div id="q2" className="row1 fplan text-small">2. AIRCRAFT IDENTIFICATION
                    <input id="ident" styles="margin-top:14px" type="text" name="ident" required="" className="field"/>
                </div>
                <div id="q3" className="row1 fplan text-small">3. AIRCRAFT TYPE/SPECIAL EQUIPMENT
                    <input id="special_equip" type="text" name="special_equip" required="" className="field"/>
                </div>
                <div id="q4" className="row1 fplan text-small">4. TRUE AIRSPEED
                    <input id="true_airspeed" type="text" name="true_airspeed" required="" className="field"/>
                </div>
                <div id="q5" className="row1 fplan text-small">5. DERPARTURE POINT
                    <input id="departure" type="text" name="departure" required="" className="field"/>
                </div>
                <div id="q6" className="row1 fplan text-small">6. DERPARTURE TIME</div>
                <div id="q61" className="row1 fplan text-small">PROPOSED(Z)
                    <input id="dept_time_proposed" type="text" name="dept_time_proposed" required="" className="field"/>
                </div>
                <div id="q62" className="row1 fplan text-small">ACTUAL(Z)
                    <input id="dept_time_actual" type="text" name="dept_time_actual" required="" className="field"/>
                </div>
                <div id="q7" className="row1 fplan text-small">7. CRUISING ALTITUDE
                    <input id="cruise_alt" type="text" name="cruise_alt" required="" className="field"/>
                </div>
                <div className="row2 fplan text-small-left">8. ROUTE OF FLIGHT
                    <input id="route" type="text" name="route" required="" className="field"/>
                </div>
                <div id="q9" className="row3 fplan text-small-left">9. DESTINATION (Name of airport and city)
                    <input id="dst" type="text" name="dst" required="" className="field"/>
                </div>
                <div id="q10" className="row3 fplan text-small">10. EST. TIME ENROUTE</div>
                <div id="q101" className="row3 fplan text-small">HOURS
                    <input id="ete" type="text" name="ete" required="" className="field"/>
                </div>
                <div id="q102" className="row3 fplan text-small">MINUTES
                    <input type="text" name="ete_min" className="field"/>
                </div>
                <div id="q11" className="row3 fplan text-small-left">11. REMARKS
                    <input id="remarks" type="text" name="remarks" required="" className="field"/>
                </div>
                <div id="q12" className="row4 fplan text-small">12. FUEL ON BOARD</div>
                <div id="q121" className="row4 fplan text-small">HOURS
                    <input id="fuel" type="text" name="fuel" required="" className="field"/>
                </div>
                <div id="q122" className="row4 fplan text-small">MINUTES
                    <input type="text" name="fuel_min" className="field"/>
                </div>
                <div id="q13" className="row4 fplan text-small-left">13. ALTERNATE AIRPORTS(S)
                    <input id="alt_airports" type="text" name="alt_airports" required="" className="field"/>
                </div>
                <div id="q14" className="row4 fplan text-small-left">14. PILOT'S NAME, ADDRESS and TELEPHONE NUMBER and AIRCRAFT HOME BASE
                    <input id="name" type="text" name="name" required="" className="field"/>
                </div>
                <div id="q15" className="row4 fplan text-small-left">15. NUMBER ABOARD
                    <input id="num_aboard" type="text" name="num_aboard" required="" className="field"/>
                </div>
                <div id="q16" className="row5 fplan text-small-left">16. COLOR OF AIRCRAFT
                    <input id="color" type="text" name="color" required="" className="field"/>
                </div>
                <div id="q17" className="row4 fplan text-small-left">17. DESTINATION CONTACT/TELEPHONE (OPTIONAL)
                    <input id="dst_contact" type="text" name="dst_contact" required="" className="field"/>
                </div>
                <div id="q18" className="row5 fplan text-med-left">
                    CIVIL AIRCRAFT PILOTS. FAR Part 91 requires you file an IFR flight plan to operate under instrument flight rules in
                    controlled airspace. Failure to file could result in a civil penalty not to exceed $1,000 for each violation (Section 901 of the
                    Federal Aviation Act of 1958, as amended). Filing of a VFR flight plan is recommended as a good operating practice. See
                    also Part 99 for requirements concerning DVFR flight plans.
                </div>
                <div className="row6 fplan">
                    <input id="submit" type="submit" className="btn btn-default"/>
                </div>
            </form>
        </div>;
    }
}

PlanView.propTypes = {
    router: React.PropTypes.object.isRequired,
    dispatcher: React.PropTypes.object.isRequired
};