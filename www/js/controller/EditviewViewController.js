/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";
import { MediaItem } from "../model/MyEntities.js";

export default class EditviewViewController extends mwf.ViewController {

    constructor() {
        super();

        console.log("EditviewViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        console.log("oncreate: ", this.args);
        const myitem = this.args ? this.args.item : new MediaItem();


        // TODO: do databinding, set listeners, initialise the view
        this.viewProxy = this.bindElement("mediaEditviewTemplate", {item:myitem}, this.root).viewProxy;
        this.viewProxy.bindAction("saveItem", (evt) => {
            evt.original.preventDefault();
            this.createOrUpdateMediaItem(myitem);
        });

        const editviewForm = document.getElementById("mediaEditviewForm");
        const uploadElement = editviewForm.uploadimg;
        const previewElement = this.root.querySelector("main form img");
        uploadElement.onchange = () => {
            const imgsrc = URL.createObjectURL(uploadElement.files[0]);
            previewElement.src = imgsrc;
        }

        // call the superclass once creation is done
        super.oncreate();
    }

    createOrUpdateMediaItem(item){
        if(item.created){
            //update
            item.update().then(() => {
                this.previousView({updatedItem: item});
            })
        }
        else{
            //create
            item.create().then(() => {
                this.previousView({createdItem: item});
            })
        }
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    bindListItemView(listviewid, itemview, itemobj) {
        // TODO: implement how attributes of itemobj shall be displayed in itemview
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

}

