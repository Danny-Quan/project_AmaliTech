const axios = require("axios");
import * as https from "https";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";

async function refreshAccessToken() {
  // try {
  //   const response = await axios.post(TOKEN_URL, new URLSearchParams({
  //     'grant_type': 'refresh_token',
  //     'refresh_token': REFRESH_TOKEN,
  //     'client_id': CLIENT_ID,
  //     'client_secret': CLIENT_SECRET
  //   }));

  //   if (response.status === 200) {
  //     ACCESS_TOKEN = response.data.access_token;
  //     console.log("Access token refreshed:", ACCESS_TOKEN);
  //   } else {
  //     console.log("Failed to refresh token:", response.data);
  //   }
  // } catch (error) {
  //   console.error("Error refreshing access token:", error);
  // }

  const req = https.request(
    "https://api.dropbox.com/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_KEY}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
    (res) => {
      res.on("data", function (rawdat) {
        console.log(rawdat.toString());
      });
    }
  );
  
  req.write(
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }).toString()
  );
  req.end();
}

{
  /* const dropboxURL="https://www.dropbox.com/oauth2/authorize?client_id=MY_CLIENT_ID&redirect_uri=MY_REDIRECT_URI&response_type=code" */
}
