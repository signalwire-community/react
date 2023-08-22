# About this script

This script will fetch a new SignalWire access token, either by directing you to an OAuth flow in the browser, or by using a refresh token.
Use this if you have not already set up OAuth flow in your application or need a SignalWire token.

Create a `.env` file (or rename the `env.sample` file from this folder) with values for `CLIENT_ID` and `REDIRECT_URI`.
The `REDIRECT_URI` will be what you set when you set up the Fabric application in your SignalWire space, and you should
have received the `CLIENT_ID` after Fabric was successfully installed in your space.

To use this script, first run `npm install` in this folder to install the necessary dependencies.
Then, calling `node index.js` for the first time should open a browser window.
Finish the authorization flow. You should be redirected to `<REDIRECT_URI>?code=<authorization_code>`.
(Check the browser's console if the page doesn't appear to redirect anywhere.)
Copy the `<authorization_code>` part and paste it into the console. The script will then get an access token
and a refresh token.

To avoid having to open the browser everytime, paste the refresh token into `.env` file with key `REFRESH_TOKEN`.
With this set in the `.env` file, the script will automatically get a new token using the refresh token.
