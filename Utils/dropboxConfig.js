const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken: process.env.TOKEN,
  fetch,
});

module.exports = dbx;
