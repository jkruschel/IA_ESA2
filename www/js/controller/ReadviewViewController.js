/**
 * @author Jörn Kreutel
 */
import {mwf} from "../Main.js";
import {entities} from "../Main.js";

export default class ReadviewViewController extends mwf.ViewController {

    constructor() {
        super();

        console.log("ReadviewViewController()");

        this.viewProxy = null;
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        var mediaItem = this.args.item;
        this.viewProxy =
            this.bindElement("mediaReadviewTemplate",{item: mediaItem},this.root).viewProxy;
        this.viewProxy.bindAction("deleteItem",(() => {
            mediaItem.delete().then(() => {
            this.previousView({deletedItem:mediaItem});
            })
            }));

        this.editMediaItem = this.root.querySelector("#editMediaItem");
        this.editMediaItem.onclick = (() => {
            // this.crudops.create(new entities.MediaItem("m","https://placekitten.com/100/100")).then((created) =>
            //     {
            //     this.addToListview(created);
            //     }
            //     );
            // });

            //this.createNewItem();
            this.nextView("mediaEditview", {item: mediaItem});
        });

        // call the superclass once creation is done
        super.oncreate();
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
        if(!returnValue) return;
        if(returnValue.deletedItem) {
            this.previousView({deletedItem:returnValue.deletedItem});
            return false;
        }
        else this.oncreate();
    }

}

