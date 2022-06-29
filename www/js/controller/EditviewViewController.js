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
        const backupTitle = myitem.title;
        const backupImg = myitem.src;
        const backupDesc = myitem.desciption;


        // TODO: do databinding, set listeners, initialise the view
        this.viewProxy = this.bindElement("mediaEditviewTemplate", {item:myitem}, this.root).viewProxy;

        const editviewForm = document.getElementById("mediaEditviewForm");
        const uploadElement = editviewForm.uploadimg;
        const urlInput = document.getElementById("url");


        this.viewProxy.bindAction("saveItem", (evt) => {
            evt.original.preventDefault();
            if(uploadElement.files[0]) {
                const formdata = new FormData();
                formdata.append("imgdata", uploadElement.files[0]);
                const xhreq = new XMLHttpRequest();
                xhreq.open("POST", "api/upload");
                xhreq.send(formdata);
                xhreq.onreadystatechange = () => {
                    if(xhreq.readyState === 4 && xhreq.status === 200) {
                       const responseData = JSON.parse(xhreq.responseText);
                       const uploadedDataPath = window.location.href + responseData.data.imgdata;
                       myitem.src = uploadedDataPath;
                       alert(myitem.src);
                       this.createOrUpdateMediaItem(myitem);
                    }
                }
                
            }
            else{
                this.createOrUpdateMediaItem(myitem);
            }
        });

        const deleteButton = this.root.querySelector("#deleteItem");
        deleteButton.onclick = () => {
            myitem.delete().then(() => {
                this.previousView({deletedItem:myitem});
                })
        }

        
        uploadElement.onchange = () => {
            const imgsrc = URL.createObjectURL(uploadElement.files[0]);
            myitem.contentType = uploadElement.files[0].type;
            this.viewProxy.update({item: myitem});
            let previewElement;
            if(myitem.mediaType == "image"){
                previewElement = this.root.querySelector("main form img");
            }
            else{ 
                previewElement = this.root.querySelector("main form video");
            }
            previewElement.src = imgsrc;
            myitem.src = imgsrc;
            document.getElementById("url").value = imgsrc;
        }

        urlInput.onchange = () => {
            const xhreq = new XMLHttpRequest();
                xhreq.open("HEAD", urlInput.value, true);
                xhreq.send();
                xhreq.onreadystatechange = () => {
                    if(xhreq.readyState === 4 && xhreq.status === 200) {
                       let type = xhreq.getResponseHeader("Content-Type");
                       myitem.contentType = type;
                       this.viewProxy.update({item: myitem});
                    }
                }
                
            }

        const defaultValueButton = this.root.querySelector("#defaultItem");
        defaultValueButton.onclick = () => {
            const defaultImage = "http://placekitten.com/200";
            this.root.querySelector("#url").value = defaultImage;
            previewElement.src = defaultImage;
            myitem.src = defaultImage;
        };

        const backButton = this.root.querySelector("#backButton");
        backButton.onclick = () => {
            myitem.title = backupTitle;
            myitem.src = backupImg;
            myitem.desciption = backupDesc;
            this.previousView();
        }


        // call the superclass once creation is done
        super.oncreate();
        if(this.application.currentCRUDScope == "local") {
            document.getElementById("uploadElement").style.visibility="hidden";
        }
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

    // onback() {
    //     alert(this.args.item.title + "Backup: " +  this.args.backupItem.title);
    //     this.args.item = this.args.backupItem;
    //     super.onback();
    // }

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

