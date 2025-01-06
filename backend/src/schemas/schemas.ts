import { 
    getLists, 
    getListById, 
    createList,
    updateList,
    getItemsInList,
    deleteItemInList,
    createItemInList,
    updateItemInList,
    changeListState
} from "./lists";
import { createUser, getUserById } from "./users";
import { getItemById, assignUserToItem } from "./items";

const schemas = {
    lists : {
        getLists : getLists,
        getListById : getListById,
        createList: createList,
        updateList: updateList,
        getItemsInList: getItemsInList,
        createItemInList: createItemInList,
        deleteItemInList: deleteItemInList,
        updateItemInList: updateItemInList,
        changeListState: changeListState
    },
    items : {
        getItemById: getItemById,
        assignUserToItem: assignUserToItem,
    },
    users : {
        getUserById : getUserById,
        createUser : createUser
    }
}

export default schemas;