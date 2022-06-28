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

        this.objectOfInterest = null;


    }

    

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        this.addNewMediaItemElement =
            this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = (() => {
            // this.addToListview(new entities.MediaItem("m new","https://placekitten.com/100/100"));
            this.nextView("mediaEditview", {item: new entities.MediaItem()});
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

            //this.createNewItem();
            this.nextView("mediaEditview", {item: new entities.MediaItem()});
        });

        this.prepareCRUDSwitching();

        console.log("oncreate: ", this.root);


        // call the superclass once creation is done
        super.oncreate();
        
    }

    async onresume() {
       await super.onresume();
        let targetObject = document.querySelector(".mwf-listitem[data-mwf-id=\'" + this.objectOfInterest + "\']");
        targetObject.scrollIntoView();

        //Der folgende Codeabschnitt wird als Monument zu studenlangem herumprobieren, um dann zur wahrscheinlich umständlichsten Lösung zu kommen, erhalten.

        /*super.onresume().then( () => {
         if(this.objectOfInterest){
            console.log("Object of Interest: " + this.objectOfInterest);
            console.log("Object of Interest top offset: " + this.objectOfInterest.offsetTop);

            const setView = () => {
            console.log("trying to scroll");
            console.log(this.objectOfInterest);
            let targetObject = document.querySelector(".mwf-listitem[data-mwf-id=\'" + this.objectOfInterest + "\']");
            const rect1 = targetObject.getBoundingClientRect();
            console.log("rect1: " + rect1.top);
            document.querySelector("main").scrollTop = rect1.top;
            }

            const waitABit = setTimeout(setView, 600);
        }
        }
        )*/
    }



    prepareCRUDSwitching() {
        const switchingElement = this.root.querySelector("footer .mwf-img-refresh")
        this.root.querySelector("#datenquelle").innerHTML = `Datenquelle: ${this.application.currentCRUDScope}`;
        switchingElement.onclick = () => {
            if(this.application.currentCRUDScope == "local") {
                this.application.switchCRUD("remote");
            }
            else {
                this.application.switchCRUD("local");
            }
            this.root.querySelector("#datenquelle").innerHTML = `Datenquelle: ${this.application.currentCRUDScope}`;
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
        if(!returnValue){
            this.initialiseListItemsInListView();
            return;
        }
        if(returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
        else if(returnValue.updatedItem){
            this.updateInListview(returnValue.updatedItem.id, returnValue.updatedItem);
            this.objectOfInterest = returnValue.updatedItem._id;
        }
        else if(returnValue.createdItem){
            this.addToListview(returnValue.createdItem);
            this.objectOfInterest = returnValue.createdItem._id;
        }
        this.initialiseListItemsInListView();

    }

    deleteItem(item) {
        // this.crudops.delete(item._id).then(() => {
        //     this.removeFromListview(item._id);
        // });

        // item.delete().then(() => {
        //     this.removeFromListview(item._id);
        //     });
        this.showDialog("mediaItemDeleteDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    this.hideDialog();
                }),
                deleteItem: ((event) => {
                    item.delete().then(() => {
                        this.removeFromListview(item._id);
                        });
                        this.hideDialog();
                })
            }
        })
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
                    //this.hideDialog();
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

    copyItem(item) {
        item.create().then(() => {
            this.addToListview(item)
        });
    }

}

