/*
Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*
*

*
* Macro Author:      	Gerardo Chaves
*                    	Technical Solutions Architect
*                    	gchaves@cisco.com
*                    	Cisco Systems
*

*    As a macro, the features and functions implemented here are not supported by Cisco TAC
* 
*    Hardware and Software support are provided by their respective manufacturers 
*      and the service agreements they offer
*    
*    Should you need assistance with this macro, reach out to your Cisco sales representative
*    so they can engage the GVE DevNet team. 
*/

import xapi from 'xapi';

const HANGUP_ON_BOOKING_END = true;
const VALIDATE_DESTINATION_BEFORE_HANGUP = true;

function compareWebexURICallbacks(first, second) {
    if (first == second) {
        return true
    }

    let domains = {
        Webex_1: {
            First: /\.webex\.com/gm.test(first),
            Second: /\.webex\.com/gm.test(second)
        }
    }

    if (!domains.Webex_1.First) {
        let split = first.split('.')
        let newAddress = `${split[0]}@${split[1].split('@')[0]}.webex.com`
        if (newAddress == second) {
            return true
        }
    }

    if (!domains.Webex_1.Second) {
        let split = second.split('.')
        let newAddress = `${split[0]}@${split[1].split('@')[0]}.webex.com`
        if (newAddress == first) {
            return true
        }
    }

    return false
}

async function processBooking(bookingID) {
    console.log("Dialing into booking")
    let theBooking = await xapi.Command.Bookings.Get({ Id: bookingID });
    //console.log(theBooking)
    console.log(`Joining ${theBooking.Booking.MeetingPlatform} meeting with Booking ID ${bookingID} and URL: ${theBooking.Booking.DialInfo.Calls.Call[0].Number}`)
    if (theBooking.Booking.MeetingPlatform == "GoogleMeet" || theBooking.Booking.MeetingPlatform == "MSTeams")
        xapi.Command.WebRTC.Join(
            { Type: theBooking.Booking.MeetingPlatform, Url: theBooking.Booking.DialInfo.Calls.Call[0].Number });
    else if (theBooking.Booking.MeetingPlatform == "Zoom")
        xapi.Command.Zoom.Join(
            { BookingID: bookingID });
    else
        xapi.Command.Dial({ BookingID: bookingID, Number: theBooking.Booking.DialInfo.Calls.Call[0].Number })

}

async function hangupOnEndBooking(bookingID) {
    console.log("Evaluate ending call when booking ends")
    if (VALIDATE_DESTINATION_BEFORE_HANGUP) {
        let theBooking = await xapi.Command.Bookings.Get({ Id: bookingID });
        //console.log(`theBooking: ${theBooking}`)
        let theBookingDestination = theBooking.Booking.DialInfo.Calls.Call[0].Number
        const currentCallURL = await xapi.Status.Call.RemoteNumber.get()
        console.log(`CurrentCall URL: ${currentCallURL}`)
        const callBack = await xapi.Status.Call.CallbackNumber.get()
        console.log(`Callback number: ${callBack}`)
        let correctedCallback = callBack.substring(callBack.length - theBookingDestination.length);

        if (compareWebexURICallbacks(correctedCallback, theBookingDestination)) {
            console.log(`Ending call to ${theBooking.Booking.MeetingPlatform} meeting with Booking ID ${bookingID} and URL: ${theBooking.Booking.DialInfo.Calls.Call[0].Number}`)
            xapi.Command.Call.Disconnect();
        } else {
            console.log(`Mismatch between current desination: ${correctedCallback} and URL of booking that ended: ${theBookingDestination}`)
        }
    }
    else {
        console.log(`Just disconnecting current call....`)
        xapi.Command.Call.Disconnect();
    }
}


xapi.Event.Bookings.Start.on(bookingID => {
    //console.log(bookingID);
    processBooking(bookingID.Id);
});

xapi.Event.Bookings.End.on(endBookingID => {
    //console.log(endBookingID)
    if (HANGUP_ON_BOOKING_END) hangupOnEndBooking(endBookingID.Id);
});