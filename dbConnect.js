const mongoose = require("mongoose");
// const dotenv = require('dotenv');
// dotenv.config({ path: './config/config.env' });
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODBURL;
db.user = require('./user').userModel;
module.exports = db;