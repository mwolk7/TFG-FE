import { Component, OnInit, ViewChild } from '@angular/core';
import {NzMessageService, NzMessageServiceModule} from 'ng-zorro-antd';
import {BackLogCredentialDto} from '@codegen/mtsuite-api/model/backLogCredentialDto';
import {BugReporterService} from '@codegen/mtsuite-api/api/bugReporter.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ProfileService} from '@codegen/mtsuite-api/api/profile.service';
import {BugReporterCredentialDto, CurrentUserDto} from '@codegen/mtsuite-api/model/models';
import {Router} from '@angular/router';
import {Location} from '@angular/common';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    public innerWidth: any;

    showBackLogAddIntegration = false;
    objectIntegration: any;

    integrationsData: BackLogCredentialDto[] = [];

    actualUser: CurrentUserDto = {email: '', name: '', username: ''};

    constructor(private message: NzMessageService,
                private profileService: ProfileService,
                private router: Router,
                private location: Location,
                private bugReporterService: BugReporterService) { }

    ngOnInit() {
        this.getActualUser();
        this.getIntegrations();
    }

    getActualUser() {
        this.profileService.getCurrentUser().subscribe( data => {
            this.actualUser = data;
        }, error => {
           throw new HttpErrorResponse(error);
        });
    }

    getIntegrations() {
        this.bugReporterService.getBugReporterCredentialByUser().subscribe(data => {
                this.integrationsData = data;
            },
            error => {
                throw new HttpErrorResponse(error);
            });
    }

    backOnClick() {
        this.location.back();
    }

    addBackLogIntegrationOnClick() {
        const integration: BackLogCredentialDto = {};
        this.objectIntegration = integration;
        this.showBackLogAddIntegration = true;
    }

    editIntegration(integration: any) {
        // TODO OPEN GITLAB
        this.objectIntegration = integration;
        this.showBackLogAddIntegration = true;
    }

    closeBackLogAddIntegration() {
        this.showBackLogAddIntegration = false;
    }

    successBackLogAddIntegration() {
        this.showBackLogAddIntegration = false;
        this.message.create('success', 'Integration created');
        this.getIntegrations();
    }

    deleteIntegrationOnClick(id: number) {
        this.bugReporterService.deleteBugReporter(id).subscribe(data => {
            this.message.create('success', 'Integration deleted successfully');
            this.ngOnInit();
        },
        error => {
            throw new HttpErrorResponse(error);
        });

    }
}

