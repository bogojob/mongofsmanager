import { addnode, removenode, movenode } from './MongoFsManger.js';
import { mongoose } from 'mongoose';


class MongoFS {

    #tofind = '';
    #docid = '';
    #model = undefined;
    #doc = undefined;
    #nodes = [];
    #filesystemsize = 0;

    #payload = {};
    #options = {};


    constructor(tofind, docid, model, payload) {
        this.#tofind = tofind;
        this.#docid = docid;
        this.#model = model;
        this.#payload = payload;
    }
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
        let opt = { tofind: this.#tofind, docid: this.#docid, nodes: this.#nodes, model: this.#model, payload: this.#payload, fssize: this.#filesystemsize };
        this.#setoptions(opt);
        console.log('option values  ' + JSON.stringify(this.#getoptions()));
        return this.#doc;
    }

    addfs = async () => {
        return await addnode(this.#getoptions());
    }
    removefs = async () => {
        return await removenode(this.#getoptions());
    }
    movefs = async () => {


    }

}
export { MongoFS }