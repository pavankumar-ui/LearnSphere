require("dotenv").config();
const { Video } = require("@mux/mux-node");

//MUX configuration//
const muxClient = new Video({
  TokenID: process.env.MUX_TOKEN_ID,
  TokenSecret: process.env.MUX_TOKEN_SECRET,
});

module.exports = muxClient;
