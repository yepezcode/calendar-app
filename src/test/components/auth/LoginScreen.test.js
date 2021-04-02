import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import '@testing-library/jest-dom';
import {LoginScreen} from '../../../components/auth/LoginScreen';
import {startLoginAction, startRegisterAction} from '../../../actions/auth';

import Swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))

jest.mock('../../../actions/auth', () => ({
    startLoginAction: jest.fn(),
    startRegisterAction: jest.fn()
}))


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
let store = mockStore( initState );

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <LoginScreen />
    </Provider>
);




describe('Pruebas en <LoginScreen />', () => {

    beforeEach( () => {
        jest.resetAllMocks()
    })

    test('debe de  mostrarse correctamente', () => {

        expect( wrapper ).toMatchSnapshot();

    })
    
    test('debe de llamar el dispatch del login', () => {

        wrapper.find('input[name="lEmail"]').simulate('change', {
            target: {
                name: 'lEmail',
                value: 'test@gmail.com'
            }
        });
        wrapper.find('input[name="lPassword"]').simulate('change', {
            target: {
                name: 'lPassword',
                value: '123456'
            }
        });

        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault(){}
        })

        expect( startLoginAction ).toHaveBeenCalledWith('test@gmail.com', '123456')
    })

    test('No hay registro si las contrasenas son diferentes', () => {

        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '123456'
            }
        });
        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '1234567'
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        })

        expect( startRegisterAction ).not.toHaveBeenCalled();
        expect( Swal.fire ).toHaveBeenCalledWith('Error','Las contraseñas deben de ser iguales','error')

    })

    test('Registro con contraseñas iguales ', () => {

        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '123456'
            }
        });
        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '123456'
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        })

        expect( Swal.fire ).not.toHaveBeenCalled();
        expect( startRegisterAction ).toHaveBeenCalledWith("","123456","");

    })});
