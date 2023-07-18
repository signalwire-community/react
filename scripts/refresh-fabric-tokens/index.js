import "dotenv/config";
import config from "./config.js";
import Axios from "axios";
import open from "open";
import readline from "readline";
import { spawn } from "child_process";
import os from "os";

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  if (config.refresh_token) {
    console.log("Refresh token found, refreshing access token.");
    const out = await Axios.post(
      "https://id.fabric.signalwire.com/oauth/token",
      {
        client_id: config.client_id,
        redirect_uri: config.redirect_uri,
        grant_type: "refresh_token",
        refresh_token: config.refresh_token,
      }
    );
    console.log(out.data.access_token);
    pbcopy(out.data.access_token);
  } else {
    console.log(
      `
No refresh token found. Opening browser. 
Log into the app, then get the auth code. 
The auth code appears as <redirect_uri>?code=<auth code>.
Paste the <auth code> part here. 
If your redirect_uri is not understood by the browser, 
copy the code from the browser console window, 
where the URL will appear as an error.`
    );
    open(
      `https://id.fabric.signalwire.com/login/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&code_challenge=${config.code_challenge}`
    );

    input.question("Paste the output code here\n- ", async (name) => {
      console.log(`The code you pasted: "${name}"`);
      input.close();
      const out = await Axios.post(
        "https://id.fabric.signalwire.com/oauth/token",
        {
          client_id: config.client_id,
          redirect_uri: config.redirect_uri,
          grant_type: "authorization_code",
          refresh_token: config.refresh_token,
          code_verifier: config.code_verifier,
          code: name,
        }
      );
      console.log(out.data.access_token, "\n");
      pbcopy(out.data.access_token);

      console.log(
        `
Add the following entry in your .env file to
not have to open the browser and login every time you need new tokens.

REFRESH_TOKEN=${out.data.refresh_token}
      `
      );
    });
  }
}
main();

function pbcopy(data) {
  if (os.platform() === "darwin") {
    var proc = spawn("pbcopy");
    proc.stdin.write(data);
    proc.stdin.end();
    console.log("Access token copied");
  }
}
