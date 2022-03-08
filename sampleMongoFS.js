
//const mongoose = require("mongoose");
import { mongoose } from 'mongoose';
import dotenv from 'dotenv';
//const dotenv = require('dotenv');
import { db } from './dbConnect.js';
//const db = require('./dbConnect');
dotenv.config({ path: './config.env' });
//(const mfs = require('./MongoFS').MongoFS;
import { MongoFS as mongofs } from './MongoFS.js';





const userModel = db.user;
const todest = "62264f13293942dd585a5d5b";
const tofind = "622650c02caf5dffc8714d56";
//const todest = "620be54e68a888c20a6b79af";
//const tofind = "6226498f44a860c3e4da0d44";/* id of the internal node of the document object of the operation */
const docid = "61b8645a684702c3180ac9bf";/* document in mongodb on which crud operations will be done  */

// const payload = {
//     "_id": new mongoose.Types.ObjectId(),
//     "name": "----- piazza centrale bella ---",
//     "type": "file",
//     "mime": "image/jpeg",
//     "size": 100000,
//     "childs": [],
//     "parts": ['part1', 'part2', 'part3', 'part4'],
// }

// const payload = {
//     "_id": new mongoose.Types.ObjectId(),
//     "name": "Venice",
//     "type": "directory",
//     "mime": "",
//     "size": 0,
//     "childs": [],
//     "parts": [],
// }



/* for remove node only */
// const payload = {

//   "_id": new mongoose.Types.ObjectId(tofind)
// }




let mfs = undefined;
db.mongoose.connection
    .on('error', err => {
        console.error(err);
    })
    .on('connecting', err => {
        console.log(`connecting ...`);
    })

    .on('connected', err => {
        console.log(`DB connected`);
        //  const f = async()=>{
        //       const doc = await userModel.aggregate([{ $match: { "_id": new mongoose.Types.ObjectId(userid) } }]); 
        //     console.log('userid: '+doc.mail);
        // }

        (async () => {
            console.log('i\'m into function auto');
            try {
                //mfs = new mongofs({ tofind: tofind, todest: todest, docid: docid, model: userModel });
                mfs = new mongofs({ tofind: tofind, todest: todest, docid: docid, model: userModel });


                //mfs = new mongofs(tofind, todest,docid, userModel, payload);
                await mfs.init();
                //let kj = await mfs.addfs();
                 let kj = await mfs.movefs();
                //let kj = await mfs.removefs();
                console.log('doc updated: ' + JSON.stringify(kj));
                process.exit(1);
            } catch (error) {
                console.log('error from class mongofs:' + error);
                process.exit(0);
            }
        })()




        // f();

        //kkk(tofind, userid, userModel, payload);


        // mfs.addfs();
    })

db.mongoose.connect(process.env.MONGODBURL, () => {
    console.log('mongodb connect: succefully ');

});

//const k = new mfs(tofind, userid, userModel, payload);




