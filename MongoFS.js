import { addnode, removenode, movenode } from './MongoFsManger.js';
import { mongoose } from 'mongoose';


class MongoFS {

    #tofind = undefined;
    #todest = undefined;
    #docid = undefined;
    #model = undefined;
    #doc = undefined;
    #nodes = undefined;
    #filesystemsize = 0;
    #payload = undefined;;
    #options = {};

    constructor(settings) {

        this.#tofind = settings.hasOwnProperty('tofind') ? settings.tofind : undefined;
        this.#todest = settings.hasOwnProperty('todest') ? settings.todest : undefined;
        this.#docid = settings.hasOwnProperty('docid') ? settings.docid : undefined;
        this.#model = settings.hasOwnProperty('model') ? settings.model : undefined;
        this.#payload = settings.hasOwnProperty('payload') ? settings.payload : undefined;
        /* this parameters must be absolutly exist and must be NOT undefined  */
        if (this.#tofind === undefined) { throw 'one need parameter is undefined' }
        if (this.#docid === undefined) { throw 'one need parameter is undefined' }
        if (this.#model === undefined) { throw 'one need parameter is undefined' }





    }
    // constructor(tofind, docid, model, payload) {
    //     this.#tofind = tofind;
    //     this.#todest = todest;
    //     this.#docid = docid;
    //     this.#model = model;
    //     this.#payload = payload;
    // }
    /* getter & setter */
    #setnodes = (nodes) => { this.#nodes = nodes };
    #getnodes = () => { return this.#nodes };
    #setfilesystemsize = (size) => { this.#filesystemsize = size }
    #setoptions = (opt) => { this.#options = opt };
    #getoptions = () => { return this.#options };



    /* public methods */

    init = async () => {
        console.log('Init called !!!');
        this.#doc = await this.#model.aggregate([{ $match: { "_id": new mongoose.Types.ObjectId(this.#docid) } }]);
        this.#setnodes(this.#doc[0].filesystem.nodes);
        this.#setfilesystemsize(this.#doc[0].filesystem.size);
        let opt = { tofind: this.#tofind, todest: this.#todest, docid: this.#docid, nodes: this.#nodes, model: this.#model, payload: this.#payload, fssize: this.#filesystemsize };
        this.#setoptions(opt);
        //console.log('option values  ' + JSON.stringify(this.#getoptions()));
        return this.#doc;
    }

    addfs = async () => {
        /* check if payload */
        return await addnode(this.#getoptions());
    }
    removefs = async () => {
         /* check if payload */
        return await removenode(this.#getoptions());
    }
    movefs = async () => {
        return await movenode(this.#getoptions());

    }

}
export { MongoFS }