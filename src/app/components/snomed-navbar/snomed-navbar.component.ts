import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';

@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss']
})
export class SnomedNavbarComponent implements OnInit {

    environment: string;
    path: string;

    branches: any;
    branchesSubscription: Subscription;
    activeBranch: any;
    activeBranchSubscription: Subscription;

    projects: any;
    projectsSubscription: Subscription;
    activeProject: any;
    activeProjectSubscription: Subscription;

    tasks: any;
    tasksSubscription: Subscription;
    activeTask: any;
    activeTaskSubscription: Subscription;

    constructor(private location: Location) {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
    }

    ngOnInit() {
        this.path = this.location.path();
    }

    logout() {
    }
}
