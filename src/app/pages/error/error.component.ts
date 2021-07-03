import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

    public innerWidth: any;

    statusMsg: string;
    titleMsg: string;
    subTitleMsg:string;

    constructor(
        private router: Router,
        private activedRouter: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loadError();
    }

    private loadError() {

        const error = this.activedRouter.snapshot.params.error;

        if ( error === '404') {
            this.statusMsg = '404';
            this.titleMsg = '404';
            this.subTitleMsg = 'Page not found';

            return;
        }

        if ( error === '403') {
            this.statusMsg = '403';
            this.titleMsg = '403';
            this.subTitleMsg = 'Sorry, you are not authorized to access this page.';
            return;
        }

        if ( error === '500') {
            this.statusMsg = '500';
            this.titleMsg = '500';
            this.subTitleMsg = 'Sorry, there is an error on server.';
            return;
        }

        this.statusMsg = '500';
        this.titleMsg = '';
        this.subTitleMsg = 'ERROR!';

    }

    goHome() {
        this.router.navigate(['']);
    }

}

