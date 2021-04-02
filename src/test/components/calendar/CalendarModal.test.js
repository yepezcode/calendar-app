import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import '@testing-library/jest-dom';
import {CalendarModal} from '../../../components/calendar/CalendarModal';
import moment from 'moment';
import {eventStartUpdateAction ,eventClearActiveEventAction, eventStartAddnewAction } from '../../../actions/events';
import {act} from 'react-dom/test-utils';
import Swal from 'sweetalert2';

jest.mock('../../../actions/events', () => ({
    eventStartUpdateAction: jest.fn(),
    eventClearActiveEventAction: jest.fn(),
    eventStartAddnewAction: jest.fn()
}))

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))


const now = moment().minutes(0).second(0).add(1, 'hours');
const nowClone = now.clone().add(1, 'hour');

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Hola Mundo',
            notes: 'Algunas notas',
            start: now.toDate(),
            end: nowClone.toDate()
        }
    },
    auth: {
        uid: '1234'
    },
    ui: {
        modalOpen: true
    }
};
let store = mockStore( initState );

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarModal />
    </Provider>
);



describe('Pruebas en el <CalendarModal />', () => {
    beforeEach( () => {
        jest.clearAllMocks();
    })

    test('Debe de mostrar el modal', () => {

        expect( wrapper.find('Modal').prop('isOpen') ).toBe( true );

    });

    test('debe de llamar la accion de actualizar y cerrar el modal', () => {

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect( eventStartUpdateAction ).toHaveBeenCalledWith( initState.calendar.activeEvent );
        expect( eventClearActiveEventAction ).toHaveBeenCalled();

    });

    test('debe de mostrar error si falta el titulo', () => {

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });


        expect( wrapper.find('input[name="title"]').hasClass('is-invalid') ).toBe(true);
    })
    

    test('debe de crear un nuevo evento', () => {

        const initState = {
            calendar: {
                events: [],
                activeEvent: null
            },
            auth: {
                uid: '1234'
            },
            ui: {
                modalOpen: true
            }
        };
        const store = mockStore(initState);
        store.dispatch = jest.fn();

        const wrapper = mount(
            <Provider store={store}>
                <CalendarModal />
            </Provider>
        );


        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        })

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        })

        expect( eventStartAddnewAction ).toHaveBeenCalledWith({
            end: expect.anything(),
            start: expect.anything(),
            title: 'Hola pruebas',
            notes: ''
        });

        expect( eventClearActiveEventAction ).toHaveBeenCalled();



    })


    test('debe de validar las fechas', () => {

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        })

        
        const hoy = new Date();

        act(() => {
            wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy)
        })

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        })

        expect( Swal.fire ).toHaveBeenCalledWith("Error", "La fecha fin debe de ser mayor a la fecha de inicio", "error")


    })

});
