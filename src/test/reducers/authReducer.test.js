import {login} from "../../actions/auth";
import {authReducer} from "../../reducers/authReducer";


let initialState = {
    checking: true
}

describe('Pruebas en el authRedcurer ', () => {

    test('Debe de retornar el initialState', () => {

        const state = authReducer( initialState ,  {});

        expect( state ).toEqual(initialState);

    })

    test('debe de retornar un usuario logeado', () => {

        const stateWithDataLogin = { 
            checking: false,
            uid: '1234',
            name: 'test'
        }

        const state = authReducer( initialState, login({uid: '1234', name: 'test'})  );
        expect( state ).toEqual( stateWithDataLogin );
        

    })
        

    
});
