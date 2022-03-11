//const MongoFsClass = require('./JsonFsClass');


import { query } from "express";
import { mongoose } from "mongoose";
import { MongoFsClass } from "./MongoFsClass.js";
/**
 *
 * @param {object} :{tofind <string>: _id node to find,
 *  nodes <array>: array nodes of filesystem,
 * filesystemsize <number>: size field of filesystem,
 * docid: <string> _id document
 * payload:<object> node to add
 * }
 * @returns {object} node added
 * 
 */
let updatedDoc = undefined;
const addnode = async (options) => {
  const tofind = options.tofind;
  const nodes = options.nodes;
  const model = options.model;
  const mfs = new MongoFsClass(tofind);
  const filesystemsize = options.fssize;
  const docid = options.docid;
  const payload = options.payload;

  let objPush = {};
  let optSize = {};
  let objSet = {};
  let filter = [];
  let walkedNodeLength = 0;
  let deepPath = 0;
  let pathNode = [];
  let walkedNodeSize = [];
  let deeplevel = 'deeplevel';//name used for query in push in mongoose
  let rootIndex = 0;
  let nodeSize = 0;


  let filesystem = await mfs.locate(tofind, nodes);


  if (tofind !== '000000000000000000000000') {

    pathNode = mfs.getWalkedNode();
    deepPath = mfs.getDeepPath();
    walkedNodeSize = mfs.getWalkedNodeSize();
    nodeSize = mfs.getNodeSize();
    rootIndex = mfs.getRootIndex();
    walkedNodeLength = pathNode.length;

    let nodePointer = 0;
    if (deepPath == 0) { // si tratta di un ramo principale della root
      nodePointer = pathNode.length - 1; // prende l'ultimo elemento sullo stack pathNode che e quello dove e stato trovato il nodo cercato per fare l'inserimento
    }

    let key = deeplevel + nodePointer + '._id';
    let val = pathNode[nodePointer];
    let optionPush = `filesystem.nodes.$[${deeplevel + nodePointer}]`;

    /* $set size */
    let optionSet = `filesystem.nodes.$[${deeplevel + nodePointer}].size`;

    optSize[`${optionSet}`] = walkedNodeSize[nodePointer] + payload.size
    objSet = { ...optSize }

    /* ArrayFilters filter*/
    let opt = {};
    opt[`${key}`] = new mongoose.Types.ObjectId(val);
    filter = [opt];

    if (deepPath >= 1) { // effettua queste operazione solo se il nodo cercato ha una profondità > 1

      for (let index = 1; index < walkedNodeLength; index++) {
        let item = `.childs.$[${deeplevel + index}]`;
        optionPush = optionPush.concat(item);
        key = deeplevel + index + '._id';
        val = pathNode[index];
        let objFilter = {};
        objFilter[`${key}`] = new mongoose.Types.ObjectId(val);
        filter.push(objFilter)
        optSize[`${optionPush}.size`] = walkedNodeSize[index] + payload.size;
        objSet = { ...optSize }
      }
    }
    optSize['filesystem.size'] = filesystemsize + payload.size;
    objSet = { ...optSize }
    objPush[`${optionPush}.childs`] = payload;
    console.log('ObjPush =>' + JSON.stringify(objPush));

  }
  else { // si cercando di inseri l'oggetto nella root del filesystem

    objPush['filesystem.nodes'] = payload;
    optSize['filesystem.size'] = filesystemsize + payload.size;
    objSet = { ...optSize };
    filter = [];
  }

  updatedDoc = await model.findOneAndUpdate(
    { "_id": new mongoose.Types.ObjectId(docid) },
    { $push: objPush, $set: objSet },
    {
      arrayFilters: filter
    }).setOptions({ returnDocument: 'after' }).lean(true);

  
  return payload;/* return node added */

}


/**
 *
 * @param {object} :tofind <string>: _id node to find,
 *  nodes <array>: array nodes of filesystem,
 * filesystemsize <number>: size field of filesystem,
 * docid: <string> _id documentid
 * }
 * @returns {object} node removed
 * 
 */
const removenode = async (options) => {
  const tofind = options.tofind;
  const nodes = options.nodes;
  const model = options.model;
  const mfs = new MongoFsClass(tofind);
  const filesystemsize = options.fssize;
  const docid = options.docid;

  let objPull = {};
  let optSize = {};
  let objSet = {};
  let filter = [];
  let walkedNodeLength = 0;
  let deepPath = 0;
  let pathNode = [];
  let walkedNodeSize = [];
  let nodeSize = 0;
  let deeplevel = 'deeplevel';//name used for query in push/pull in mongoose
  let rootIndex = 0;
  let nodeLocate = undefined;

  let filesystem = await mfs.locate(tofind, nodes);

  nodeLocate = mfs.getLocateNode();

  const payload = {
    "_id": new mongoose.Types.ObjectId(tofind)
  }

  if (tofind !== '000000000000000000000000') {

    pathNode = mfs.getWalkedNode();
    deepPath = mfs.getDeepPath();
    walkedNodeSize = mfs.getWalkedNodeSize();
    nodeSize = mfs.getLocateNode().size;
    rootIndex = mfs.getRootIndex();

    if (deepPath == 1) {
      pathNode = [pathNode.shift()];//get first Element
    } else {
      pathNode.pop(); // remove last element
    }
    walkedNodeLength = pathNode.length;

    let nodePointer = 0;

    if (deepPath == 0) { // si tratta di un ramo principale della root
      nodePointer = pathNode.length - 1; // prende l'ultimo elemento sullo stack pathNode che e quello dove e stato trovato il nodo cercato per fare l'inserimento
    }


    let key = deeplevel + nodePointer + '._id';
    let val = pathNode[nodePointer];
    let optionPull = `filesystem.nodes.$[${deeplevel + nodePointer}]`;

    /* $set size */
    let optionSet = `filesystem.nodes.$[${deeplevel + nodePointer}].size`;
    optSize[`${optionSet}`] = walkedNodeSize.length > 0 ? walkedNodeSize[nodePointer] - nodeSize :  nodeSize;
    objSet = { ...optSize }

    /* ArrayFilters filter*/
    let opt = {};
    opt[`${key}`] = new mongoose.Types.ObjectId(val);
    filter = [opt];


    if (deepPath >= 1) { // effettua queste operazione solo se il nodo cercato ha una profondità > 1

      for (let index = 1; index < walkedNodeLength; index++) {
        let item = `.childs.$[${deeplevel + index}]`;
        optionPull = optionPull.concat(item);

        key = deeplevel + index + '._id';
        val = pathNode[index];
        let objFilter = {};
        objFilter[`${key}`] = new mongoose.Types.ObjectId(val);
        filter.push(objFilter)

        optSize[`${optionPull}.size`] = walkedNodeSize[index] - nodeSize;
        objSet = { ...optSize }


      }
    }

    optSize['filesystem.size'] = filesystemsize - nodeSize;
    objSet = { ...optSize }
    objPull[`${optionPull}.childs`] = payload;
    console.log('objPull =>' + JSON.stringify(objPull));
  }
  else { // si cercando di fare l'opearzione sulla root del filesystem
    objPull['filesystem.nodes'] = payload;
    optSize['filesystem.size'] = filesystemsize - nodeSize; // DA TESTARE
    objSet = { ...optSize };
    filter = [];
  }
  /* update document on database */

   updatedDoc = await model.findOneAndUpdate(
    { "_id": new mongoose.Types.ObjectId(docid) },
    { $pull: objPull, $set: objSet },
    {
      arrayFilters: filter
    }).setOptions({ returnDocument: 'after', lean: true });

  return nodeLocate;/* return node removed */

}

/*  */
const movenode = async (options) => {
  const tofind = options.tofind;
  const todest = options.todest;
  const nodes = options.nodes;
  const model = options.model;
  const filesystemsize = options.fssize;
  const docid = options.docid;
  let opt = { tofind: tofind, docid: docid, nodes: nodes, model: model, fssize: filesystemsize }
  const removedNode = await removenode(opt);
  opt = { tofind: todest, docid: docid, nodes: nodes, model: model, fssize: filesystemsize, payload: removedNode }
  const addedNode = await addnode(opt)
  return addedNode;/* return moved node */

}
export {
  updatedDoc,
  addnode,
  removenode,
  movenode
}