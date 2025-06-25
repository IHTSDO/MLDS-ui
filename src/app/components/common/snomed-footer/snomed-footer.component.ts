import { Component, OnInit } from '@angular/core';

/**
 * SnomedFooterComponent
 *
 * This component represents the footer section of the application.
 *
 * @example
 * <app-snomed-footer></app-snomed-footer>
 */
@Component({
    selector: 'app-snomed-footer',
    templateUrl: './snomed-footer.component.html',
    styleUrls: ['./snomed-footer.component.scss'],
    standalone: true
})
export class SnomedFooterComponent implements OnInit {

    /**
     * The current year
     */
    year: number = new Date().getFullYear();

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Initializes the component
     */
    ngOnInit() {
    }

}