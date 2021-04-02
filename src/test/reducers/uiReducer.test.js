import {uiReducer} from "../../reducers/uiReducer";
import { closeModalAction, openModalAction } from '../../actions/ui'


const initState = { 
    modalOpen: false,
}


describe('Pruebas en mi uiReducer', () => {

    test('debe de retonar el estado por defecto', () => {

        const  state = uiReducer(initState, {});
        expect( state ).toEqual( initState );

    })

    test('debe de abrir y cerrar el modal', () => {

        const modalOpen = openModalAction();
        const state = uiReducer( initState, modalOpen );
        
        expect( state ).toEqual({ modalOpen : true });

        const modalClose = closeModalAction();
        const stateClose = uiReducer( state, modalClose );

        expect( stateClose ).toEqual({ modalOpen: false })

    })
    
});
