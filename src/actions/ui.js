import {types} from "../types/types";



export const openModalAction = () => (
    {
        type: types.uiOpenModal
    }
);

export const closeModalAction = () => (
    {
        type: types.uiCloseModal
    }
);
