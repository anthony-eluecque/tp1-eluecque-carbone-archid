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
    }
}

export default schemas;