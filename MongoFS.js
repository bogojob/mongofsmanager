import { addnode, removenode, movenode } from './MongoFsManger.js';
import { mongoose } from 'mongoose';
/*
 * Filename: MongoFS.js
 * Project: mongofsmanager
 * Created Date: 01 feb 2022
 *
 * Author: Natale Paolo Santo Stefano
 * Licence: MIT
 * Copyright (c) 2022 Natale Paolo Santo Stefano
*/

class MongoFS {

    /*id node subjet to operation  */
    #tofind = undefined;
    /* id node soject operation move */
    #todest = undefined;
    /* docuemnt id into mongo database */
    #docid = undefined;

    /* mongo database Schema */
    #model = undefined;
    /* mongodb document found */
    #doc = undefined;
    /* field node of mondodb document */
    #nodes = undefined;
    /* variable will contains field size of filesystem */
    #filesystemsize = 0;
    /* object will use in operation add/remove */
    #payload = undefined;
    #options = {};

    constructor(settings) {
        /* check for correct class initialization */
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

    /* getter & setter */
    #setnodes = (nodes) => { this.#nodes = nodes };
    #setfilesystemsize = (size) => { this.#filesystemsize = size }
    #setoptions = (opt) => { this.#options = opt };
    #getoptions = () => { return this.#options };

    /* public methods */

    init = async () => {

        this.#doc = await this.#model.aggregate([{ $match: { "_id": new mongoose.Types.ObjectId(this.#docid) } }]);
        this.#setnodes(this.#doc[0].filesystem.nodes);
        this.#setfilesystemsize(this.#doc[0].filesystem.size);
        let opt = { tofind: this.#tofind, todest: this.#todest, docid: this.#docid, nodes: this.#nodes, model: this.#model, payload: this.#payload, fssize: this.#filesystemsize };
        this.#setoptions(opt);
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