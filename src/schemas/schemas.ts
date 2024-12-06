import { getLists, getListById } from "./lists";

const schemas = {
    lists : {
        getLists : getLists,
        getListById : getListById
    }
}

export default schemas;