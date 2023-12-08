# GVE DevNet Webex Devices Auto Join Macro

Macro to have a device join a Webex, Zoom, GoogleMeet or Microsoft Teams meeting as soon as it receives the Booking Start event for it assuming the join information for the meeting is correcly reflected in the calendar for the device.

## Contacts

- Gerardo Chaves (gchaves@cisco.com)

## Solution Components

- Webex Collaboration Endpoints
- Javascript
- xAPI

## Installation/Configuration

1. Load the Javascript code included in the auto_join.js file in this repository into a new Macro in the Macro editor of the Cisco Webex device you wish to use.
2. Edit the macro and set the `HANGUP_ON_BOOKING_END` to true (default) if you want the macro to hang up the call when the meeting is scheduled to end.
3. Also set the `VALIDATE_DESTINATION_BEFORE_HANGUP` to true (default) to make sure it hangs up the call that was initiated originally by the macro for the booking that started and not just any call. This validation only works for when the booking destination and the current call connected destination match, if there are any variants, it normalizes them for Webex meetings but not for other platforms. If you find the macro is not disconnecting calls it should, then you can set this to false to not due further validation.
4. Activate the macro

> If you are unfamiliar with Cisco Room device macros, [this](https://help.webex.com/en-us/np8b6m6/Use-of-Macros-with-Room-and-Desk-Devices-and-Webex-Boards) is a good article to get started.

> For some sample code to show you how to automate the deployment of this macro, wallpapers, touch 10 UI controls and others to multiple Webex devices, you can visit [this repository](https://github.com/voipnorm/CE-Deploy)

> For information on deploying the macros, you can read the [Awesome xAPI GitHub repository](https://github.com/CiscoDevNet/awesome-xapi#user-content-developer-tools). In addition to the deployment information, this repository also has tutorials for different macro uses, articles dedicated to different macro capabilities, libraries to help interacting with codecs, code samples illustrating the xAPI capabilities, and sandbox and testing resources for macro applications.

## Usage

Once the macro is running, whenever the time to join a meeting that has been schedule to include the device running the macro, the device will automatically join the meeting.

### LICENSE

Provided under Cisco Sample Code License, for details see [LICENSE](LICENSE.md)

### CODE_OF_CONDUCT

Our code of conduct is available [here](CODE_OF_CONDUCT.md)

### CONTRIBUTING

See our contributing guidelines [here](CONTRIBUTING.md)

#### DISCLAIMER:

<b>Please note:</b> This script is meant for demo purposes only. All tools/ scripts in this repo are released for use "AS IS" without any warranties of any kind, including, but not limited to their installation, use, or performance. Any use of these scripts and tools is at your own risk. There is no guarantee that they have been through thorough testing in a comparable environment and we are not responsible for any damage or data loss incurred with their use.
You are responsible for reviewing and testing any scripts you run thoroughly before use in any non-testing environment.
