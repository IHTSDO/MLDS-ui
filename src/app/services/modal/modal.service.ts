import { Injectable } from '@angular/core';

/**
 * Service for managing modals in the application.
 */
@Injectable({
    providedIn: 'root'
})
export class ModalService {

    /**
     * Array of active modals.
     */
    private modals: any[] = [];

    /**
     * Constructor.
     */
    constructor() {
    }

    /**
     * Adds a modal to the array of active modals.
     *
     * @param modal The modal to add.
     */
    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    /**
     * Removes a modal from the array of active modals.
     *
     * @param id The ID of the modal to remove.
     */
    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    /**
     * Opens a modal specified by its ID.
     *
     * @param id The ID of the modal to open.
     */
    open(id: string) {
        // open modal specified by id
        const modal: any = this.modals.filter(x => x.id === id)[0];
        modal.open();
    }

    /**
     * Closes a modal specified by its ID.
     *
     * @param id The ID of the modal to close.
     */
    close(id: string) {
        // close modal specified by id
        const modal: any = this.modals.filter(x => x.id === id)[0];
        modal.close();
    }
}
