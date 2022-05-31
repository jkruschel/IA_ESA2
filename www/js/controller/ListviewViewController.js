/**
 * @author Jörn Kreutel
 */
import { mwf } from "../Main.js";
import { entities } from "../Main.js";

export default class ListviewViewController extends mwf.ViewController {

    constructor() {
        super();

        console.log("ListviewViewController()");

        this.items = [];

        this.addNewMediaItemElement = null;


    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement =
            this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = (() => {
            this.addToListview(new entities.MediaItem("m new","https://placekitten.com/100/100"));
            });
        
        this.initialiseListview(this.items);

        // this.crudops.readAll().then((items) => {
        //     this.initialiseListview(items);
        //     });

        entities.MediaItem.readAll().then((items) => {
            this.initialiseListview(items);
            });

        this.addNewMediaItemElement.onclick = (() => {
            // this.crudops.create(new entities.MediaItem("m","https://placekitten.com/100/100")).then((created) =>
            //     {
            //     this.addToListview(created);
            //     }
            //     );
            // });

            this.createNewItem();
        });

        this.prepareCRUDSwitching();

        console.log("oncreate: ", this.root);
        // call the superclass once creation is done
        super.oncreate();
    }

    prepareCRUDSwitching() {
        const switchingElement = this.root.querySelector("footer .mwf-img-refresh")
        switchingElement.onclick = () => {
            if(this.application.currentCRUDScope == "local") {
                this.application.switchCRUD("remote");
                alert(this.application.currentCRUDScope);
            }
            else {
                this.application.switchCRUD("local");
                alert(this.application.currentCRUDScope);
            }
            this.initialiseListItemsInListView();
        }
    }

    initialiseListItemsInListView() {
        entities.MediaItem.readAll().then((items) => {
            this.initialiseListview(items);
            });
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    // bindListItemView(listviewid, itemview, itemobj) {
    //     // TODO: implement how attributes of itemobj shall be displayed in itemview
    //     itemview.root.getElementsByTagName("img")[0].src =
    //         itemobj.src;
    //     itemview.root.getElementsByTagName("h2")[0].textContent =
    //         itemobj.title + itemobj._id;
    //     itemview.root.getElementsByTagName("h3")[0].textContent =
    //         itemobj.added;
    // }

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
        super.onListItemMenuItemSelected(menuitemview, itemobj, listview);
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
        if (nextviewid == "mediaReadview" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
    }

    deleteItem(item) {
        // this.crudops.delete(item._id).then(() => {
        //     this.removeFromListview(item._id);
        // });

        item.delete().then(() => {
            this.removeFromListview(item._id);
            });
    }
    editItem(item) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        this.updateInListview(item._id, item);
                    });
                    this.hideDialog();
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item);
                    this.hideDialog();
                })
            }
        });
    }

    createNewItem() {
        var newItem = new
            entities.MediaItem("","https://placekitten.com/100/100");
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    newItem.create().then(() => {
                        this.addToListview(newItem)
                    });
                    this.hideDialog();
                })
            }
        });
        // newItem.create().then(() => {
        //     this.addToListview(newItem);
        // });
    }

}

