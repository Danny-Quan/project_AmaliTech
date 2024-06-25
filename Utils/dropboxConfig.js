const { Dropbox } = require("dropbox");
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken:
    "sl.B32KX_Ar_7q0fryF8-KYVPCYJpEOt-cptXuCVWFap8XzCBZMY5eWfqFjiIXJ1KsCoumuAu5hIWHEu5jtxIYB_BXH7WgqVLFqvvi0NE0uv0e9i-HHDtM7ISithsUsi8hJJP7f-PKd3RuUvUSdUYxJ",
  fetch,
});

module.exports = dbx;
