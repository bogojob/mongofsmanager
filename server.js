const express = require('express')
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const db = require('./dbConnect');
const httpServer = require('http').createServer(app);
dotenv.config({ path: './config.env' });


// const JSONFS = require('./JsonFsClass');
// const JSONFS = require('./MongoFsManager');

import {addnode, removenode, movenode} from './MongoFsManger';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// const getFirstLast = (ar) => {

//   let arr = [];
//   arr.push(ar[0]);
//   arr.push(ar[ar.length - 1]);
//   return arr;
// }


// const nodeToAdd = {
//    "_id": new mongoose.Types.ObjectId(),
//   "name": "----- PALERMO ---",
//   "type": "file",
//   "mime": "image/jpeg",
//   "size": 200000,
//   "childs": [],
//   "parts": ['yyyy', 'oooo', 'ppppp'],

// }



// const nodeToAdd = {
//   "_id": new mongoose.Types.ObjectId(),
//  "name": "----- PC COLLECTIONS ---",
//  "type": "directory",
//  "mime": "",
//  "size": 0,
//  "childs": []

// }




//  const nodeToAdd = {

//   "_id": new mongoose.Types.ObjectId(),
//   "name": "----- piazza centrale bella ---",
//   "type": "file",
//   "mime": "image/jpeg",
//   "size": 100000,
//   "childs": [],
//   "parts": ['MMM', 'MMMM', 'MMMMMMM'],
// }


/* for remove node only */
// const nodeToAdd = {

//   "_id": new mongoose.Types.ObjectId('620fdea905f00caae46f7cbd')
// }


//const OPERATION = 'REMOVE';


// const nodeToAdd = {

//   "name": "--FOTOSALERNO--",
//   "type": "directory",
//   "mime": "",
//   "size": 0,
//   "childs": [],
//   "parts": []
// }



db.mongoose.connect(process.env.MONGODBURL, () => { console.log('mongodb connect: succefully') })
httpServer.listen(process.env.PORT, () => {
  console.log(`server listen on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
}
);


const userModel = db.user;






const k = 0;

app.get('/add', async (req, res) => {

  const toFind = req.body.nodeid;
  const userid = req.body.userid;
  console.log('id target=>' + toFind)
  console.log('userid target=>' + req.body.userid)

  //const doc = await userModel.aggregate([{ $project: { "filesystem.nodes": true, "filesystem.size": true } }, { $match: { "_id": new mongoose.Types.ObjectId(userid) } }]);
  const doc = await userModel.aggregate([{ $match: { "_id": new mongoose.Types.ObjectId(userid) } }]);
  const nodes = doc[0].filesystem.nodes;
  const filesystemsize = doc[0].filesystem.size;
  const jfs = new JSONFS(toFind);
  const payload = {
    "_id": new mongoose.Types.ObjectId(),
    "name": "----- piazza centrale bella ---",
    "type": "file",
    "mime": "image/jpeg",
    "size": 100000,
    "childs": [],
    "parts": ['MMM', 'MMMM', 'MMMMMMM'],
  }
  const options = { tofind: toFind, userid: userid, jsonfs: jfs, nodes: nodes, fssize: filesystemsize, payload: payload }


   addnode(options);
  /* DA ATTIVARE DOPO REMOVEFROMDB */
  // performance.mark('start add');

  // filesystem = await jfs.add(toFind, nodes, payload);

  // performance.mark('end add');
  // performance.measure("misurazione add", "start add", "end add");

  // // Log the marks and measures
  // var marks = ['start add', 'end add'];
  // for (var i = 0; i < marks.length; i++)
  //   console.log("... Created mark = " + marks[i]);
  // var measures = ["misurazione add"];
  // for (var i = 0; i < measures.length; i++)
  //   console.log("... Created measure = " + measures[i]);

  // var entries = performance.getEntries();
  // var j = 0;
  // for (var i = 0; i < entries.length; i++) {
  //   if (entries[i].entryType == "measure") {
  //     if (j == 0) { console.log("= getEntries()"); j++ }
  //     console.log("... [" + i + "] = " + entries[i].name);
  //     console.log("... [" + i + "] = " + entries[i].duration);
  //   }
  // }
  // performance.clearMeasures();

  // doc[0].filesystem.size += payload.size;
  // console.log(JSON.stringify(filesystem));

  res.send("document modified succefull!!!");




});





app.get('/remove', async (req, res) => {

  const toFind = req.body.nodeid;
  const userid = req.body.userid;
  console.log('id target=>' + toFind)
  console.log('userid target=>' + req.body.userid)

  const doc = await userModel.aggregate([{ $project: { "filesystem.nodes": true, "filesystem.size": true } }, { $match: { "_id": new mongoose.Types.ObjectId(userid) } }]);
  const nodes = doc[0].filesystem.nodes;
  const filesystemsize = doc[0].filesystem.size;
  const jfs = new JSONFS(toFind);
  const options = { tofind: toFind, userid: userid, jsonfs: jfs, nodes: nodes, fssize: filesystemsize }


  removenode(options);
 


  res.send("node removed  succefull!!");



});


app.get('/move', async (req, res) => {

  const toFind = req.body.nodeid; /*  node that needs to be moved */
  const toDest = req.body.nodedest; /*  destination node */
  const userid = req.body.userid;
  console.log('node to move =>' + toFind)
  console.log('destination node =>' + toDest)
  console.log('userid target=>' + req.body.userid)

  const doc = await userModel.aggregate([{ $match: { "_id": new mongoose.Types.ObjectId(userid) } }]);
  const nodes = doc[0].filesystem.nodes;
  const filesystemsize = doc[0].filesystem.size;
  const options = { tofind: toFind, toDest: toDest, userid: userid, nodes: nodes, fssize: filesystemsize }

  movenode(options);

  res.send("Move node completed succefull!!");

});