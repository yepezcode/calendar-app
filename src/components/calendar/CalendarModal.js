import React, { useEffect, useState } from "react";

import moment from 'moment';
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import Swal from 'sweetalert2';

import {useDispatch, useSelector} from "react-redux";

import {closeModalAction} from "../../actions/ui";
import { eventStartAddnewAction, eventClearActiveEventAction, eventStartUpdateAction } from "../../actions/events";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

if ( process.env.NODE_ENV !== 'test'){
    Modal.setAppElement("#root");
}

const now = moment().minutes(0).second(0).add(1, 'hours');
const nowClone = now.clone().add(1, 'hour');

const initState = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowClone.toDate()
}

export const CalendarModal = () => {

    const [dateStart, setDateStart] = useState( now.toDate());
    const [dateFinish, setDateFinish ] = useState( nowClone.toDate());
    const [ titleValid, setTitleValid ] = useState(true);
    
    const dispatch = useDispatch();
    const { modalOpen } = useSelector( state => state.ui );
    const { activeEvent } = useSelector( state => state.calendar );

    const [ formValues , setFormValues  ] = useState(initState);


    useEffect(() => {
        if ( activeEvent ) {
            setFormValues( activeEvent );
        } else { 
            setFormValues( initState );
        }
    }, [ activeEvent, setFormValues ])


    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const { notes, title, start, end } = formValues;

    const closeModal = () => {
        dispatch( closeModalAction() );
        dispatch( eventClearActiveEventAction() );
        setFormValues( initState );
        
    };

    const handleStartDateChange = ( e )  => { 
        setDateStart( e );
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleFinishDateChange = ( e ) => {
        setDateFinish( e );
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if( momentStart.isSameOrAfter( momentEnd )) { 
            return Swal.fire('Error','La fecha fin debe de ser mayor a la fecha de inicio','error')
        }

        if( title.trim().length < 2 ) {
            return setTitleValid(false);
        }


        if (activeEvent) {
            dispatch(eventStartUpdateAction(formValues));
        } else {
            dispatch( eventStartAddnewAction( formValues ) ); 
        }

        setTitleValid(true);
        closeModal();

    }

    return (
        <Modal
            isOpen={ modalOpen }
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
            ariaHideApp={ !process.env.NODE_ENV === 'test'} 
        >
                <h1> { (activeEvent) ? 'Editar evento' : 'Nuevo evento'} </h1>
            <hr />
            <form 
                className="container"
                onSubmit={ handleSubmitForm }
            >
                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker 
                        onChange={ handleStartDateChange }
                        value={ dateStart } 
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                   <DateTimePicker 
                        onChange={ handleFinishDateChange }
                        value={ dateFinish } 
                        minDate={ dateStart }
                        className="form-control"
                   />               
                </div>
                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${ !titleValid && 'is-invalid' }`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value = { title }
                        onChange = { handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        Una descripción corta
                    </small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value = { notes }
                        onChange = { handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">
                        Información adicional
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>
            </form>{" "}
        </Modal>
    );
};
