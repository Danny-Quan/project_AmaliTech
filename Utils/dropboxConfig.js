const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken: process.env.ACCESS_TOKEN,
  fetch,
});

module.exports = dbx;
