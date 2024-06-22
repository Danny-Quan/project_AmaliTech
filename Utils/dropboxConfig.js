const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken:
    "sl.B3qbnZ6Q0yF20WPcB99xD4EIO401KCDhJpbdAVdm3Syr1qusAJqInn66NxNjqNuONUOW-Pxgo6fh2uR97Q3cDoypr3ql-b82UILV-aRDrUFEVQmdG9Yt3EkqG-tfggZOit0Hyr9GX_2GBHDmM5xJ",
  fetch,
});

module.exports = dbx;
