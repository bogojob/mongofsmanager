# mongofsmanager

## mongo filesystem manager

**manages a filesystem based on mongodb document**

This library is designed to manage a filesystem type structure saved as a document within a mongodb database.

## Structure

of recursive tree type must have the following form:

```json
{
  "_id": "61b8645a684702c3180ac9bf",
  "mail": "maymail@myprovider.com",
  "firstname": "",
  "lastname": "",
  "size": 200000,
  "filesystem": {
    "nodes": [
      {
        "_id": "61bdca6e2aa6c5c6f4313450",
        "name": "cities",
        "type": "directory",
        "mime": "",
        "size": 200000,
        "childs": [
          {
            "_id": "61f826088e67b91c1d492f4b",
            "name": "IMG_20210906_105712.jpg",
            "type": "file",
            "mime": "image/jpeg",
            "size": 100000,
            "childs": []
          },
          {
            "_id": "62264f13293942dd585a5d5b",
            "name": "Venice",
            "type": "directory",
            "mime": "",
            "size": 100000,
            "childs": [
              {
                "_id": "622650c02caf5dffc8714d56",
                "name": "Piazza San Marco",
                "type": "file",
                "mime": "image/jpeg",
                "size": 100000,
                "childs": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

The only mandatory fields are:

1. \_id \<string\>
1. filesystem \<object\>
1. nodes \<array\>
1. type \<string\> values 'directory' \| 'file'
1. childs \<array\>
1. size \<number\>

which must respect the defined type.  
All other fields shown in the example can have other names and be of other types as they are not treated by the library functions.

The subdocuments contained in the _childs_ field in addition to containing **obligatorily** the _type_, _childs_, _size_ fields may contain other fields.


## Available operations

the operations made available by the package, are the classic operations that are carried out on a filesystem that is: 

- insert a new node that can be a directory or a file in any point of the structure
- move the node
- delete the node


*Note: In case the created node is of type _file_, it will be up to the developer to decide where and how to save the content.*


Note: after each operation, all updates to the size fields of the affected nodes are made. This keeps the size of each filesystem directory consistent.

## How to use

**Mongodb [Schema](https://mongoosejs.com/docs/guide.html) example**



```javascript
import mongoose from 'mongoose';
const nodeSchema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        name: String,
        type: { type: String, enum: ['directory', 'file'], default: 'directory' },
        mime: String,
        size: Number,
        childs: []
       
    });

const userSchema = new mongoose.Schema(
    {
        _id: mongoose.Types.ObjectId,
        mail: { type: String, unique: true },
        firstname: String,
        lastname: String,
        filesystem: { nodes: [nodeSchema], size: Number }
    }
);

const userModel = mongoose.model('user', userSchema);
export {
    userModel
   
}
```

---


### example for add operation

```javascript
import { MongoFS as mongofs } from './MongoFS.js';
/* import your mongodb model */
import { yourmodel } from './model.js'
const model = yourmodel;

/* setting variables */
/* document in mongodb on which crud operations will be done  */
const docid = "61b8645a684702c3180ac9bf";
/* node to find: !! must be a directory type !!
use: 000000000000000000000000 for add a node into filesystem root */
const tofind = "622650c02caf5dffc8714d56";

/* object node you want to add */
const payload = {
    "_id": new mongoose.Types.ObjectId(),
    "name": "filename",
    "type": "file",
    "mime": "image/jpeg",
    "size": 100000,
    "childs": []
}


let mfs = undefined;

/**prepare Mongodb connection**/
mongoose.connect(path your mongodb,()=>{
  console.log('mongodb connect: succefully ');
 (async () => {
    try {
        mfs = new mongofs({ tofind: tofind, docid: docid, model: model,payload:payload });
        await mfs.init();
        let n = await mfs.addfs();
        console.log('node: ' + JSON.stringify(n));
        process.exit(1);
    } catch (error) {
        console.log('error from class mongofs:' + error);
        process.exit(0);
    }
})()
})
```
---

### example for remove operation

```javascript
import { MongoFS as mongofs } from './MongoFS.js';
/* import your mongodb model */
import { yourmodel } from './model.js'
const model = yourmodel;

/* setting variables */
/* document in mongodb on which crud operations will be done  */
const docid = "61b8645a684702c3180ac9bf";
/* node to find e that must be removed */
const tofind = "622650c02caf5dffc8714d56";
/* object node that you wont add */
const payload = {
  "_id": new mongoose.Types.ObjectId(tofind)
}


let mfs = undefined;

/**prepare Mongodb connection**/
mongoose.connect(path your mongodb,()=>{
  console.log('mongodb connect: succefully ');
 (async () => {
    try {
        mfs = new mongofs({ tofind: tofind, docid: docid, model: model,payload:payload });
        await mfs.init();
        let n = await mfs.removefs();
        console.log('node: ' + JSON.stringify(n));
        process.exit(1);
    } catch (error) {
        console.log('error from class mongofs:' + error);
        process.exit(0);
    }
})()

})
```
---

### example for move operation

```javascript
import { MongoFS as mongofs } from './MongoFS.js';
/* import your mongodb model */
import { yourmodel } from './model.js'
const model = yourmodel;

/* setting variables */
/* document in mongodb on which crud operations will be done  */
const docid = "61b8645a684702c3180ac9bf";
/* node to find e that must be removed */
const tofind = "622650c02caf5dffc8714d56";
/* tofind will moved into this node. !! todest must be directory type !! */
const todest = "880be54e68a999c20a6b79c8";

let mfs = undefined;

/**prepare Mongodb connection**/
mongoose.connect(path your mongodb,()=>{
  console.log('mongodb connect: succefully ');
 (async () => {
    try {
        mfs = new mongofs({ tofind: tofind, todest:todest,docid: docid, model: model });
        await mfs.init();
        let n = await mfs.movefs();
        console.log('node: ' + JSON.stringify(n));
        process.exit(1);
    } catch (error) {
        console.log('error from class mongofs:' + error);
        process.exit(0);
    }
})()

})
```

---

### table of options ###

| options | meaning |
| ------ | ------ |
| tofind  | node subjected to operation |
| todest | node of type directory that will receive another node in its childs field. Valid for move operation only. |
| docid  | id which identifies the document in the mongodb and which contains the filesystem on which to operate |
| model  | Mongo db Model Schema |
| payload | this is an element that changes depending on the type of operation. (see examples)It is always an object. It is not present in the case of move |


