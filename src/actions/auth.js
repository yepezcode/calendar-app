import Swal from "sweetalert2";
import {fetchConToken, fetchSinToken} from "../helpers/fetch";
import {types} from "../types/types";
import {eventLogout} from "./events";


export const startLoginAction = ( email, password ) => {
    return async (dispatch ) => {


        const resp = await fetchSinToken('auth', { email, password }, 'POST' );
        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );

            dispatch(login({
                uid: body.uid,
                name: body.name
            }))

        } else { 
            Swal.fire('Error', body.msg, 'error');
        }

    }
}

export const startRegisterAction =  ( email, password, name ) => {
    return async ( dispatch ) => {

        const resp = await fetchSinToken('auth/new', { email, name, password }, 'POST');
        const body = await resp.json();

        if (body.ok) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
 
            dispatch(login({
                uid: body.uid,
                name: body.name

            }))
        } else {
           Swal.fire('Error', body.msg, 'error');
        }

            
    }
}


export const startChecking = () => {
    return async (dispatch) => {
        
        const resp = await fetchConToken('auth/renew');
        const body = await resp.json();


        if (body.ok) {
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({
                uid: body.uid,
                name: body.name
            }))
        } else {
            dispatch( chekingFinish );
        }


    } 

}

const  chekingFinish = () => (
    {
        type: types.authCheckingFinish
    }
)

export const login = ( user ) => (
    {
        type: types.authLogin,
        payload: user
    }
)

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch( eventLogout() );
        dispatch( logout() );
    }
}

const logout = () => (
    {
        type: types.authLogout
    }
)
