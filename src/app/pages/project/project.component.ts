import {Component, OnInit} from '@angular/core';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {HttpErrorResponse} from '@angular/common/http';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {NzMessageService} from 'ng-zorro-antd';
import {NavigationEnd, Router} from '@angular/router';
import {TableProjectDashboardDto} from '@codegen/mtsuite-api/model/models';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

    public innerWidth: any;

    public search: any = '';

    projects: TableProjectDashboardDto[] = [];
    currentDate = formatDate(new Date(), 'dd MMM yyyy hh:mm', 'en');
    isLoading = true;

    showNewProject = false;

    constructor(private projectService: ProjectService,
                private message: NzMessageService,
                private router: Router) {}

    ngOnInit() {
        this.getProjects();
    }

    getProjects() {
        this.projectService.getProjects().subscribe(data => {
            this.projects = data;
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            throw new HttpErrorResponse(error);
        });
    }

    newProjectOnClick() {
        this.showNewProject = true;
    }

    closeNewProjectOnClick() {
        this.showNewProject = false;
    }

    successNewProjectOnClick(project: ProjectDto) {
        this.showNewProject = false;
        this.message.create('success','Project created');
        this.getProjects();
    }
}
