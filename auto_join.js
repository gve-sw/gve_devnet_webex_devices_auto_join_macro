import xapi from 'xapi';

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

xapi.Event.Bookings.Start.on(bookingID => {
    //console.log(bookingID);
    processBooking(bookingID.Id);
}
)
