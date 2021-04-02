import Swal from "sweetalert2";
import {fetchConToken} from "../helpers/fetch";
import {prepareEvents} from "../helpers/prepareEvents";
import {types} from "../types/types";



export const eventStartAddnewAction = ( event ) =>{
    return async (dispatch, getState ) => {

        const { uid , name } = getState().auth;
            
        try {
            const resp = await fetchConToken('events', event, 'POST');
            const body = await resp.json();

            console.log(body);
            if (body.ok) {

                event.id = body.msg.id;
                event.user = {
                    _id: uid,
                    name: name
                }
                dispatch( eventAddNewAction( event ) )
            }
        } catch (error) {
            console.log(error);
        }



    }
}

 const eventAddNewAction = ( event ) => (
    {
        type: types.eventAddNew,
        payload: event
    }
);


export const eventSetActiveAction = ( event ) => (
    {
        type: types.eventSetActive,
        payload: event
    }
)

export const eventClearActiveEventAction = () => (
    {
        type: types.eventClearActiveEvent
    }
)

export const eventStartUpdateAction = ( event ) => {
    return async ( dispatch ) =>  {
    

        try {

            const resp = await fetchConToken(`events/${ event.id }`, event , 'PUT');
            const body = await resp.json();

            if( body.ok ) {
                dispatch( eventUpdatedAction( event ) );
            } else {
                Swal.fire('Error', body.msg ,'error')
            }

        } catch (error) {
            console.log(error);
        }

    }
}


const eventUpdatedAction = ( event ) => (
    {
        type: types.eventUpdated,
        payload: event
    }
)
        
const eventDeletedAction = () => (
    {
        type: types.eventDeleted,
    }
)

export const eventStartDeleteAction = () => {
    return async (dispatch, getState ) => {


        const { id } = getState().calendar.activeEvent;

        try {

            const resp = await fetchConToken(`events/${ id }`,{}, 'DELETE');
            const body = await resp.json();

            if (body.ok) {
                dispatch(eventDeletedAction());
            } else {
                Swal.fire('Error', body.msg, 'error')
            }

        } catch (error) {
            console.log(error);
        }

    }
}

export const eventStartLoadingAction = () => {
    return async (dispatch) => {

        try { 

            const resp = await fetchConToken('events');
            const body = await resp.json();

            const events = prepareEvents( body.eventos ); 
    
            dispatch( eventLoaded( events ) )

        } catch ( error ) {
            console.log( error );
        }
    }
}

const eventLoaded = ( events ) => (
    {
        type: types.eventLoaded,
        payload: events
    }
)

export const eventLogout = () => (
    {
        type: types.eventLogout
    }
)
