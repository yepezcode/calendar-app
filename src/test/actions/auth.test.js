import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import '@testing-library/jest-dom';
import {startChecking, startLoginAction, startRegisterAction} from '../../actions/auth';
import * as fetchModule from '../../helpers/fetch';
import {types} from '../../types/types';


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};

let store = mockStore( initState );


jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))


Storage.prototype.setItem = jest.fn();
describe('Pruebas en las acciones Auth', () => {
    
    beforeEach( () => {
        store = mockStore(isFinite);
        jest.clearAllMocks();
    })


    test('startLogin correcto ', async () => {

        await store.dispatch( startLoginAction( 'test@gmail.com', '123456' ) )

        const action = store.getActions();

        expect( action[0] ).toEqual({
            type: types.authLogin,
            payload: { 
                uid: expect.any(String),
                name: expect.any(String)
            }
        })

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', expect.any(String));
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number));

    })


    test('startLogin incorrecto ', async () => {

        await store.dispatch( startLoginAction( 'test@gmail.com', '1234567890' ) )
        let action = store.getActions();

        expect(action).toEqual([]);
        expect( Swal.fire ).toHaveBeenCalledWith("Error", "Password incorrecto", "error");

        await store.dispatch( startLoginAction('test@gmail2.com','123456'))
        action = store.getActions();

        expect( Swal.fire ).toHaveBeenCalledWith("Error", "El usuario no existe con ese correo","error")

    })


    test('startRegister correcto', async () => {

        fetchModule.fetchSinToken = jest.fn( () => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'testing',
                    token: 'token1234123'
                }
            }
        }));

        await store.dispatch( startRegisterAction('test2@gmail.com', '123456', 'test') );

        const action = store.getActions();


        expect( action[0] ).toEqual({
            type: types.authLogin,
            payload: {
                    uid: '123',
                    name: 'testing',

            }
        })
         expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'token1234123');
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number))

    })



    test('startChegik correcto', async () => {
        fetchModule.fetchConToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'testing',
                    token: 'token1234123'
                }
            }
        }));

        await store.dispatch(startChecking());

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                    uid: '123',
                    name: 'testing',
            }
        })

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'token1234123')


    })

});
