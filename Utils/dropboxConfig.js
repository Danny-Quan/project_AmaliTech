const axios = require("axios");
require("dotenv").config();

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://api.dropbox.com/oauth2/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: process.env.DROPBOX_REFRESH_TOKEN,
          client_id: process.env.DROPBOX_CLIENT_ID,
          client_secret: process.env.DROPBOX_CLIENT_SECRET,
        },
      }
    );

    const newAccessToken = response.data.access_token;
    // console.log("New access token:", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
};

module.exports = refreshAccessToken
