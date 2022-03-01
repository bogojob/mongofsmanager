

/** JSON FILE SYSTEM is a class to manage a nested Json structure that emulates a file system.
 * The methods it contains, can perform CRUD operations by updating the size in amount
 * of space occupied by each node (folder)  */
class JSONFS {

    /* ----- Class properties ------ */
    /**determines whether the searched node has been found */
    #nodeFound = false;
    /* Size of node found */
    #nodeSize = 0;
    /** determines whether a directory is encountered. is equivalent to walking a node */
    #directoryReached = false;
    /** determines whether a node's children are being processed */
    #checkingChilds = false;
    /**  walked nodes during the search */
    #walkedNode = [];
    /**  store the size of walked nodes during the search */
    #walkedNodeSize = [];
    /**  last operation done on the node */
    #lastOperation = undefined;
    /** node that must be added or removed */
    #payload = undefined;
    /**Depth level at which the node was found*/
    #pathDeep = 0;

    /** @param {object} payload - Object to be inserted into the structure .*/
    /** @param {string} operation (add,remove, ..)- operation to be carried out on the structure*/
    #rootIndex = 0;
    #rootNodeId = 0;
    #operation = undefined;
    #locatenode = undefined; /* Object Node Located */


    constructor(rootNodeId, operation, payload) {
        this.#rootNodeId = rootNodeId;
        this.#operation = operation;
        this.#payload = payload;

    }



    /** getter and setter method 
     * @private
    */

    getOperation = () => { return this.#operation }
    setOperation = (op) => { this.#operation = op }
    getPayload = () => { return this.#payload }
    setPayLoad = (pl) => { this.#payload = pl }

    getLocateNode = () => { return this.#locatenode }
    setLocateNode = (node) => { this.#locatenode = node }

    isNodeFound = () => { return this.#nodeFound }

    setNodeFound = (status) => { this.#nodeFound = status }

    setDirectoryReached = (status) => { this.#directoryReached = status }

    isDirectoryReached = () => { return this.#directoryReached }

    setCheckChilds = (status) => { this.#checkingChilds = status }
    isCheckingChilds = () => { return this.#checkingChilds }

    getRootNodeId = () => { return this.#rootNodeId }

    getNodeSize = () => { return this.#nodeSize }
    setNodeSize = (size) => { this.#nodeSize = size }

    getWalkedNode = () => { return this.#walkedNode }
    setWalkedNode = (value) => { this.#walkedNode.push(value) }
    resetWalkedNode = () => { this.#walkedNode = [] }

    getWalkedNodeSize = () => { return this.#walkedNodeSize }
    setWalkedNodeSize = (value) => { this.#walkedNodeSize.push(value) }
    resetWalkedNodeSize = () => { this.#walkedNodeSize = [] }

    getDeepPath = () => { return this.#pathDeep }
    setDeepPath = (deep) => { this.#pathDeep = deep }
    incDeepPath = (inc) => { this.#pathDeep += inc }
    decDeepPath = (dec) => { this.#pathDeep -= dec }

    setRootIndex = (index) => { this.#rootIndex = index }
    getRootIndex = () => { return this.#rootIndex }


    getLastOperation = () => { return this.#lastOperation }
    setLastOperation = (operation) => { this.#lastOperation = operation }

    // setPayLoadNode = (payload) => { this.#payLoadNode = payload }
    // getPayLoadNode = () => { return this.#payLoadNode }


    /**
     * @private
     * @param {string}  toSearch - node id to search.
     * @param {object} jsonStructure - Object Json where make operation
     
     * @returns {object} jsonStructure
     * 
     */
    locate = async (toSearch, jsonStructure) => {
        console.log("------------------nodelocalte init-----------------------------");

        if (Object.prototype.toString.call(jsonStructure) === '[object Object]') {
            console.log('analyzing oject ...');

            /* cerca l'id dell'ooggeto sul nodo attuale */
            Object.entries(jsonStructure).forEach(([key, value]) => {
                //console.log('processed key :' + key + '-  valore : ' + value);
                if (key === 'type' && value === 'directory') {
                    this.setDirectoryReached(true);
                }
                if (key === 'type' && value === 'file') {
                    this.setDirectoryReached(false);
                }
                if (key === '_id' && this.isDirectoryReached()) {
                    this.setWalkedNode(value._id.valueOf());
                }
                if (key === 'size' && this.isDirectoryReached()) {
                    this.setWalkedNodeSize(value);
                }


                //_______________ 

                if (key === 'name') { console.log('analizing... ' + value); }
                if (key === '_id') { console.log('id_... ' + value); }

                //_______________ 


                if (key === '_id' && value._id.valueOf() === toSearch) {
                    console.log('trovato ! => ' + value._id.valueOf());
                    if (key === '_id' && !this.isDirectoryReached()) {
                        setWalkedNode(value._id.valueOf());
                    }
                    if (this.getOperation() === undefined) { this.setLocateNode(jsonStructure) }
                    this.setNodeSize(jsonStructure.size);
                    console.log('node size  => ' + this.getNodeSize());;
                    this.setNodeFound(true);

                }
            });

            /* se l'id non estato trovato nell'oggetto corrente, allora prova a vedere se ci sono figli nel comapo childs
             * se esistono si precede la ricerca all'interno dei figli */
            if (!this.isNodeFound()) {
                if (jsonStructure.childs.length > 0) { // yes it's have chindrens!
                    this.incDeepPath(1);
                    /* every time you go down a level, the <checkingChilds> variable must be set to true */
                    this.setCheckChilds(true);
                    console.log('levelDeep => ' + this.getDeepPath());
                    await this.locate(toSearch, jsonStructure.childs);
                }
                else { // No! it's haven't chindrens

                }
            }
            else {
                console.log('node name found :' + jsonStructure.name);

                /* make operation on jsonStructure */
                switch (this.getOperation()) {

                    case 'add':
                        console.log('current operation add');
                        (jsonStructure.childs).push(this.getPayload());
                        break;
                    case 'remove':
                        console.log('current operation remove');
                        let jsochilds = jsonStructure.childs;
                        let jsoFiltered = jsochilds.filter(item => {
                            console.log('item.id' + item._id);
                            return item._id.valueOf() !== this.#rootNodeId;
                        });
                        jsonStructure.childs = jsoFiltered;
                        break;

                    case 'update':
                        console.log('current operation: update');
                        if (this.getLastOperation() === 'add') {
                            jsonStructure.size += (this.getPayload()).size;
                        }
                        else if (this.getLastOperation() === 'remove') {
                            jsonStructure.size -= (this.getPayload()).size;
                        }
                        break;

                }
            }
        }


        else if (Object.prototype.toString.call(jsonStructure) === '[object Array]') {
            //console.log('Si e un array');
            for (let i = 0; i < jsonStructure.length; i++) {
                if (this.isNodeFound()) { break }

                if (this.isCheckingChilds()) {
                    console.log('\t analyzing childs ... ' + (i + 1) + '/' + jsonStructure.length);
                }
                else {
                    this.setRootIndex(i);
                    console.log('rootIndex : ' + this.getRootIndex());
                }
                await this.locate(toSearch, jsonStructure[i]);

            }
            if (this.isCheckingChilds() && !this.isNodeFound()) {
                this.decDeepPath(1);
                /* every time you go up a level, the <checkingChilds> variable must be set to false */
                this.setCheckChilds(false);
                this.resetWalkedNode();
                this.resetWalkedNodeSize();
            }
        }

        return jsonStructure;
    }


    /**
    * @description Inserts a new node into the structure. Updates the size value of all parent nodes
    * @public
    * @param {object}  toSearch - node id to search.
    * @param {object} jsonObject - Object Json where make operation.
    * @param {object} payload - Object to be inserted and/or removed from the structure.
    * 
    * @returns {object} jsonStructure.
    * 
    */
    add = async (nodeTarget, jsonObject, payLoad) => {

        if (nodeTarget !== this.getRootIndex()) {
            this.setPayLoad(payLoad);
            this.setOperation('add');
            this.setLastOperation('add');
            await this.locate(nodeTarget, jsonObject);
            /* Update size of node walked */
            await this.updateNode(jsonObject);


        } else {
            this.setNodeSize(payLoad.size);
            jsonObject.push(this.getPayload());
        }
        return await jsonObject;

    }

    /**
    * @description remove a new node from the structure. Updates the size value of all parent nodes
    * @public
    * @param {object}  toSearch - node id to search for to be removed.
    * @param {object} jsonObject - Object Json where make operation.
    * 
    * @returns {object} jsonStructure.
    * 
    */
    remove = async (toSearch, jsonObject) => {
        await this.locate(toSearch, jsonObject);
        let ar = this.getWalkedNode();
        let nodeParent = ar[ar.length - 2];
        this.reset();
        this.setOperation('remove');
        this.setLastOperation('remove');
        await this.locate(nodeParent, jsonObject);
        await this.updateNode(jsonObject);
        this.reset();
        return await jsonObject;
    }

    /**
        * @description move a node into the structure. Updates the size value of all parent nodes
        * @public
        * @param {object}  toSearch - node id to search for to be removed.
        * @param {object} jsonObject - Object Json where make operation.
        * 
        * @returns {object} jsonStructure.
        * 
        */
    move = async (toSearch, toDest, jsonObject) => {
        await this.locate(toSearch, jsonObject);
        const payload = this.getLocateNode();
        this.setPayLoad(payload);
        let ar = this.getWalkedNode();
        let nodeParent = ar[ar.length - 2];
        this.reset();
        this.setOperation('remove');
        this.setLastOperation('remove');

        await this.locate(nodeParent, jsonObject);
        await this.updateNode(jsonObject);
        this.reset();

        await this.add(toDest, jsonObject, payload)

        return await jsonObject;
    }







    /**
    * @description increase/decrease the size of each node involved in the operation
    * @private
    * @param {object} jsonObject - Object Json where make operation.
    * 
    * @returns {object} jsonStructure.
    * 
    */
    updateNode = async (jsonObject) => {
        const ar = this.getWalkedNode();
        //const ars = this.getWalkedNodeSize();

        this.setOperation('update');

        for (let ij = 0; ij < ar.length; ij++) {
            this.reset();
            //this.#nodeSize = ars[ij];
            await this.locate(ar[ij], jsonObject);
        }

        // ar.forEach(async item => {
        //     this.reset();
        //     await this.locate(item, jsonObject, this.getPayLoadNode(), 'updatesize');
        // })

        //const k = jsonObject.reduce((prev, current) => prev + current.size, 0);
        //console.log('TOTALE FS :' + k);
        return await jsonObject;
    }

    /**
    * @description Reset all class properties
    * @private
    */
    reset = () => {
        this.setDeepPath(0);
        this.setNodeFound(false);
        this.setDirectoryReached(false);
        this.setCheckChilds(false);
        this.#walkedNode = [];
        this.#walkedNodeSize = [];
        this.setNodeSize(0);
    }
}

/**
 * JSONFS.
 * @module JSONFS
 */

module.exports = JSONFS;
//export default JSONFS;






