import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import {ModalService} from '../../../services/modal/modal.service';

/**
 * Modal component that can be used to display a modal window.
 *
 * Example:
 * ```
 * <app-modal id="my-modal" size="large">
 *   <!-- modal content here -->
 * </app-modal>
 * ```
 */
@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    /**
     * The ID of the modal. Required.
     */
    @Input() id = '';

    /**
     * The size of the modal. Can be 'small', 'medium', or 'large'. Default is 'medium'.
     */
    @Input() size = 'medium';

    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    /**
     * Initializes the modal component.
     */
    ngOnInit(): void {
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // add size to dialog
        this.element.firstChild.classList.add('modal-' + this.size);

        // close modal on background click
        this.element.addEventListener('click', (el: any) => {
            if (el.target.className === 'app-modal') {
                this.close();
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    /**
     * Removes the modal component from the DOM and modal service when it's destroyed.
     */
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    /**
     * Opens the modal window.
     */
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('app-modal-open');
    }

    /**
     * Closes the modal window.
     */
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('app-modal-open');
    }
}