import React from 'react';

export const CalendarEvent = ({ event }) => {
    
    const { title, user } = event;

    return (
        <>
            <span> { title } </span>
            <strong>{ user.name }</strong>
                        
        </>
)}
