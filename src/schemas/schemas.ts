import { 
    getLists, 
    getListById, 
    createList,
    updateList,
    getItemsInList,
    deleteItemInList,
    createItemInList
} from "./lists";

const schemas = {
    lists : {
        getLists : getLists,
        getListById : getListById,
        createList: createList,
        updateList: updateList,
        getItemsInList: getItemsInList,
        createItemInList: createItemInList,
        deleteItemInList: deleteItemInList
    }
}

export default schemas;