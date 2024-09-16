import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Snomed Navbar Component
 *
 * This component displays the navigation bar for the Snomed application.
 *
 * @example
 * <app-snomed-navbar></app-snomed-navbar>
 */
@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss']
})
export class SnomedNavbarComponent implements OnInit {
    /**
     * The current environment (e.g. dev, prod, etc.)
     *
     * @example 'dev'
     */
    environment: string = '';

    /**
     * The current path of the application
     *
     * @example '/dashboard'
     */
    path: string = '';

    /**
     * Constructor
     *
     * @param location The Location service
     */
    constructor(private location: Location) {
        /**
         * Set the environment based on the window location host
         *
         * @example If the window location host is 'dev.snomed.com', the environment will be set to 'dev'
         */
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
    }

    /**
     * OnInit lifecycle hook
     *
     * Sets the path property based on the current location
     */
    ngOnInit() {
        /**
         * Get the current path from the Location service
         *
         * @example If the current URL is 'http://localhost:4200/dashboard', the path will be set to '/dashboard'
         */
        this.path = this.location.path();
    }
}