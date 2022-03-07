//const mongoose = require("mongoose");
import { mongoose } from 'mongoose';
import { userModel } from './user.js'
// const dotenv = require('dotenv');
// dotenv.config({ path: './config/config.env' });
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODBURL;
db.user = userModel;

export { db }