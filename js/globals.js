//True if this is the first time hte index page has been opened,
//used for initialization
let FIRST_LOAD = window.sessionStorage.getItem("FIRST_LOAD");
//Storage for every shopping list a user has made
//[[id, "owner", "listName", [itemList], visible?], [...], ...]
let ALL_LISTS = JSON.parse(window.sessionStorage.getItem("ALL_LISTS"));
//Name of the user account
let ACCOUNT = window.sessionStorage.getItem("ACCOUNT");
//Number of lists that have been made (the unique id of a new list)
let MASTER_COUNT = parseInt(window.sessionStorage.getItem("MASTER_COUNT"));
//The shopping list that items are currently being added to
let EDITING_LIST = parseInt(window.sessionStorage.getItem("EDITING_LIST"));
//Name of the location of the store
let LOCATION = window.sessionStorage.getItem("LOCATION");
//Initialize constants and session storage
function initValues(){
    if(FIRST_LOAD === null) {
        ALL_LISTS = [];
        ACCOUNT = "Jimbo Slice";
        MASTER_COUNT = 0;
        EDITING_LIST = -1;
        LOCATION = "Mega Mart";
        window.sessionStorage.setItem("FIRST_LOAD", "0");
        window.sessionStorage.setItem("LOCATION", LOCATION);
        window.sessionStorage.setItem("ALL_LISTS", JSON.stringify(ALL_LISTS));
        window.sessionStorage.setItem("ACCOUNT", ACCOUNT);
        window.sessionStorage.setItem("MASTER_COUNT", MASTER_COUNT);
        window.sessionStorage.setItem("EDITING_LIST", EDITING_LIST);
    }
}
//Returns a shopping list with the name matching the one entered
function listFromName(listName){
    if(listName === null){
        ALL_LISTS.push([MASTER_COUNT, ACCOUNT, "missingno", [], true]);
        window.sessionStorage.setItem("MASTER_COUNT", ""+(MASTER_COUNT+1));
        return ALL_LISTS[MASTER_COUNT++];
    }
    for(let i=0; i<ALL_LISTS.length; ++i)
        if(ALL_LISTS[i][2] === listName)
            return ALL_LISTS[i];

    return null;
}
//Remove a shopping list from ALL_LISTS by id
function removeListById(listId){
    for(let i=0; i<ALL_LISTS.length; ++i)
        if(ALL_LISTS[i][0] === listId) {
            //ALL_LISTS.splice(i, 1);
            ALL_LISTS[i][4] = false;
            window.sessionStorage.setItem("ALL_LISTS", JSON.stringify(ALL_LISTS));
        }

}