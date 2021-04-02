import { types } from "../../types/types";

describe("Pruebas en Types", () => {
    test("los types deben ser iguales", () => {
        expect(types).toEqual({
            uiOpenModal: "[UI] Open modal",
            uiCloseModal: "[UI] Close modal",

            eventSetActive: "[event] Set active",
            eventStartAddNew: "[event] Start add new",

            eventAddNew: "[event] Add new",
            eventClearActiveEvent: "[event] Clear active event",
            eventUpdated: "[event] Event updated",
            eventDeleted: "[event] Event deleted",
            eventLoaded: "[event] Events loaded",
            eventLogout: "[event] Event logout",

            authChecking: "[auth] Checking login state",
            authCheckingFinish: "[auth] Finish checking login state",
            authStartLogin: "[auth] Start login",
            authLogin: "[auth] Login",
            authStartRegister: "[auth] Start Register",
            authStartTokenRenew: "[auth] Start token renw",
            authLogout: "[auth] Logout",
        });
    });
});
