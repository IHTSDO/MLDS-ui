import {Component, Inject, OnInit} from '@angular/core';
import 'jquery';
import { Title } from '@angular/platform-browser';
import { EnvService } from './services/environment/env.service';
import {DOCUMENT} from "@angular/common";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    environment: string = '';

    constructor(private envService: EnvService,
                private titleService: Title,
                @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit() {
        this.titleService.setTitle('SNOMED CT Member Licensing and Distribution Service');
        this.environment = this.envService.env;
        this.assignFavicon();
    }

    assignFavicon() {
        switch (this.environment) {
            case 'local':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_grey.ico');
                break;
            case 'dev':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_red.ico');
                break;
            case 'uat':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_green.ico');
                break;
            case 'training':
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon_yellow.ico');
                break;
            default:
                this.document.getElementById('favicon')?.setAttribute('href', 'favicon.ico');
                break;
        }
    }
}
