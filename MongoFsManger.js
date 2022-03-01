//const JSONFS = require('./JsonFsClass');

import {JSONFS} from './JsonFsClass';
/**
 *
 * @param {object} :{tofind <string>: _id node to find,
 *  nodes <array>: array nodes of filesystem,
 * filesystemsize <number>: size field of filesystem,
 * userid: <string> _id user
 * payload:<object> node to add
 * }
 * @returns {object} node added
 * 
 */
 const addnode = async (options) => {
    const tofind = options.tofind;
    const nodes = options.nodes;
    const jfs = new JSONFS(tofind);
    //const jfs = options.jsonfs;
    const filesystemsize = options.fssize;
    const userid = options.userid;
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
  
  
    filesystem = await jfs.locate(tofind, nodes);
  
  
    if (tofind !== '000000000000000000000000') {
  
      pathNode = jfs.getWalkedNode();
      deepPath = jfs.getDeepPath();
      walkedNodeSize = jfs.getWalkedNodeSize();
      nodeSize = jfs.getNodeSize();
      rootIndex = jfs.getRootIndex();
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
  
    await userModel.findOneAndUpdate(
      { "_id": new mongoose.Types.ObjectId(userid) },
      { $push: objPush, $set: objSet },
      {
        arrayFilters: filter
      });
  
    return payload;/* return node added */
  
  }
  
  
  /**
   *
   * @param {object} :tofind <string>: _id node to find,
   *  nodes <array>: array nodes of filesystem,
   * filesystemsize <number>: size field of filesystem,
   * userid: <string> _id user
   * }
   * @returns {object} node removed
   * 
   */
  const removenode = async (options) => {
    const tofind = options.tofind;
    const nodes = options.nodes;
    const jfs = new JSONFS(tofind);
    const filesystemsize = options.fssize;
    const userid = options.userid;
  
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
  
    filesystem = await jfs.locate(tofind, nodes);
  
    nodeLocate = jfs.getLocateNode();
  
    const payload = {
      "_id": new mongoose.Types.ObjectId(tofind)
    }
  
    if (tofind !== '000000000000000000000000') {
  
      pathNode = jfs.getWalkedNode();
      deepPath = jfs.getDeepPath();
      walkedNodeSize = jfs.getWalkedNodeSize();
      nodeSize = jfs.getLocateNode().size;
      rootIndex = jfs.getRootIndex();
  
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
      optSize[`${optionSet}`] = walkedNodeSize[nodePointer] - nodeSize;
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
    await userModel.findOneAndUpdate(
      { "_id": new mongoose.Types.ObjectId(userid) },
      { $pull: objPull, $set: objSet },
      {
        arrayFilters: filter
      });
  
    return nodeLocate;
  
  }
  
  /*  */
  const movenode = async (options) => {
    const toFind = options.tofind;
    const toDest = options.toDest;
    const nodes = options.nodes;
  
    //const jfs = options.jsonfs;
    const filesystemsize = options.fssize;
    const userid = options.userid;
  
    let opt = { tofind: toFind, userid: userid, nodes: nodes, fssize: filesystemsize }
    const removedNode = await removeFromDb(opt);
  
    opt = { tofind: toDest, userid: userid, nodes: nodes, fssize: filesystemsize, payload: removedNode }
    const addedNode = await addToDb(opt)
  
    return addedNode;
  
  }
  export default {
    addnode,
    removenode,
    movenode
  }