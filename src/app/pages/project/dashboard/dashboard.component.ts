import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuHotKeys} from '../../../components/menus/hotKeyMenu/hotKeyMenu.component';
import {TestSuiteService} from '@codegen/mtsuite-api/api/testSuite.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {TestSuiteDto} from '@codegen/mtsuite-api/model/testSuiteDto';
import {NzMessageService, NzNotificationDataOptions, NzNotificationService} from 'ng-zorro-antd';


@Component({
    selector: 'app-project-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public innerWidth: any;

    hotKeyList = [MenuHotKeys.NEW_TESTRUNNER, MenuHotKeys.NEW_TESTSUITE];

    projectId;
    testSuitesData: TestSuiteDto[] = [];
    testSuitesDataIsLoading = true;
    currentDate = new Date();

    projectData: ProjectDto = {name: ''};
    projectDataIsLoading = true;
    hasVisibility = true;

    showNewProject = false;

    public search: any = '';


    constructor( private activedRouter: ActivatedRoute,
                 private message: NzMessageService,
                 private router: Router,
                 private notificationService: NzNotificationService,
                 private testSuiteService: TestSuiteService,
                 private projectService: ProjectService) { }

    ngOnInit() {
        console.log("ID:" + this.activedRouter.snapshot.params.id);

        this.activedRouter.params.subscribe(params => {
            this.projectId =  params['id'];
            this.getProject();
            this.getTestSuites();
        });
    }


    // Get
    getTestSuites() {
        this.testSuitesDataIsLoading = true;
        this.testSuiteService.getTestSuitesByProject(this.projectId).subscribe(data => {
            this.hasVisibility = true;
            this.testSuitesData = data;
            this.testSuitesDataIsLoading = false;
        }, error => {
            if (error.error.code === '403') {
                this.hasVisibility = false;
                this.testSuitesDataIsLoading = false;
            } else {
                this.testSuitesDataIsLoading = false;
                throw new HttpErrorResponse(error);
            }
        });
    }

    getProject() {
        this.projectDataIsLoading = true;
        this.projectService.getProject(this.projectId, false).subscribe(data => {
                this.projectData = data;
                this.projectDataIsLoading = false;
        }, projectError => {
            if (projectError.error.code === '404') {
                const options: NzNotificationDataOptions<any> = { nzPauseOnHover: true };
                this.notificationService.error('Error 001', 'Project not found', options);
                this.hasVisibility = true;
                this.projectDataIsLoading = false;
                this.testSuitesDataIsLoading = false;
            } else {
                this.projectDataIsLoading = false;
                throw new HttpErrorResponse(projectError);
            }
        });
    }


    // New
    newTestSuite() {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/0/editor']);
    }

    editOnclick() {
        this.router.navigate(['projects/' + this.projectId + '/editor']);
    }

    backOnClick() {
        this.router.navigate(['']);
    }

    newProjectOnClick() {
        this.showNewProject = true;
    }

    closeNewProjectOnClick() {
        this.showNewProject = false;
    }

    successNewProjectOnClick(project: ProjectDto) {
        this.showNewProject = false;
        this.message.create('success','Project created' );
        this.activedRouter.params.subscribe(params => {
            this.projectId =  params['id'];
            this.getProject();
            this.getTestSuites();
        });
    }

    goToProject(id: any) {
        this.router.navigate(['projects/' + id]);
    }

}

