

import { mongoose } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { MongoFS as mongofs } from './MongoFS.js';
import { model } from './modelSchema.js';



const todest = "61bdca6e2aa6c5c6f4313450";
//const tofind = "622650c02caf5dffc8714d56";
const tofind = "61f826088e67b91c1d492f4b";

// const todest = "62264f13293942dd585a5d5b";
// const tofind = "622650c02caf5dffc8714d56";
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







mongoose.connect(process.env.MONGODBURL, () => {
    console.log('mongodb connect: succefully ');
    (async () => {
        try {
            

            /* --- using for add ----
            mfs = new mongofs({ tofind: tofind, docid: docid, model: model, payload:payload });
            await mfs.init();
            let node = await mfs.addfs();
            */
            
            /* --- using for move --- */
            const mfs = new mongofs({ tofind: tofind, todest: todest, docid: docid, model: model })
            await mfs.init();
            let node = await mfs.movefs();
          
            /* --- using for remove --- 
            const mfs = new mongofs({ tofind: tofind, docid: docid, model: model,payload:payload })
            await mfs.init();
            let node = await mfs.removefs();
          */
            
            console.log('doc updated: ' + JSON.stringify(node));
            process.exit(1);
        } catch (error) {
            console.log('error from class mongofs:' + error);
            process.exit(0);
        }
    })()

});





