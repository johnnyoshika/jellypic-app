# Jellypic Client

Jellypic is a sample app to demonstrate the capabilities of Progressive Web Apps, including:
* Offline first readonly in:
  * Chrome, Firefox, Opera
  * Edge on Windows 10 1803+
  * Safari 11.1+ (iOS 11.3+ and macOS 10.13.4+)
* Saving changes with intermittent internet will be attempted 5 times, but committing changes will require online access
* Push notifications on:
  * Chrome on Android
  * Chrome on Windows
  * Chrome on macOS

Project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and uses the following technologies:
* Service Worker
* Push API
* React.js
* Apollo Client (for GraphQL requests)
* CSS Grid

## Setup
* `git clone {repository url}`
* `cd` into new directory
* use Node version 8.X (e.g. 8.17.0)
* `npm install`

## Development
* Make sure [Backend Server](https://github.com/johnnyoshika/jellypic) is running
* `npm start`
* Navigate to: [http://localhost:3000/](http://localhost:3000/)

## HTTPS and Facebook Login
* Facebook only allows login from HTTPS pages.
* To serve pages over HTTPS, start server after [setting HTTPS environment variable](https://create-react-app.dev/docs/using-https-in-development/):
  * Windows (cmd.exe): `set HTTPS=true&&npm start`
  * Windows (Powershell): `($env:HTTPS = "true") -and (npm start)`
  * Linux, macOS (Bash): `HTTPS=true npm start`
* Server will use a self-signed certificate, so web browser will almost definitely display a warning
* Once you log in with Facebook and proper authentication cookie has been set by the API, then you can revert back to non-secure HTTP. Remember that you need to close the shell and start a new session to clear out the env variable.

## Build for Production
* `npm run build`

## Remote Debugging with Android Device
* Follow instructions here to connect my Samsung S7 with my desktop's Chrome Dev Tools: https://developers.google.com/web/tools/chrome-devtools/remote-debugging/
* I had trouble getting Chrome's Dev Tools to recognize my device. I installed and uninstalled Samsung's USB Driver for Windows from here: http://developer.samsung.com/galaxy/others/android-usb-driver-for-windows and then it started working. I documented this here: https://stackoverflow.com/a/48625119/188740
* Set device USB options and select:
  * `Connecting MIDI devices`
* In the `Remote devices` tab of Chrome Dev Tools, add this port forwarding rule:
  * `3000` --> `localhost:3000`
* Now our Samsung S7 device can run our app with url `http://localhost:3000`

## Deployment
Coming soon...