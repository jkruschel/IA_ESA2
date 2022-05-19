/**
 * @author Jörn Kreutel
 *
 * this skript defines the data types used by the application and the model operations for handling instances of the latter
 */


import {mwfUtils} from "../Main.js";
import {EntityManager} from "../Main.js";

/*************
 * example entity
 *************/

export class MyEntity extends EntityManager.Entity {

    constructor() {
        super();
    }

}

// TODO-REPEATED: add new entity type declarations here
export class MediaItem extends EntityManager.Entity {

    constructor(title,src,contentType){
        super();
        this.title = title;
        this.src = src;
        this.added = Date.now();
        this.description = "";
        this.srcType = null;
        this.contentType = contentType;
    }
}


