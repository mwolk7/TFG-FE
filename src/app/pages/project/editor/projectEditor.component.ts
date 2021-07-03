import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuHotKeys} from '../../../components/menus/hotKeyMenu/hotKeyMenu.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {ProjectVersionDto} from '@codegen/mtsuite-api/model/projectVersionDto';
import {NzMessageService} from 'ng-zorro-antd';
import {ProjectUserDto} from '@codegen/mtsuite-api/model/projectUserDto';
import {UserDto} from '@codegen/mtsuite-api/model/userDto';
import {Location} from '@angular/common';
import {FilesService} from "@codegen/mtsuite-api/api/files.service";
import {FileTokenAccessDto} from "@codegen/mtsuite-api/model/fileTokenAccessDto";
import {NzCopyToClipboardService} from "ng-zorro-antd";

@Component({
    selector: 'app-project-editor',
    templateUrl: './projectEditor.component.html',
    styleUrls: ['./projectEditor.component.scss']
})
export class ProjectEditorComponent implements OnInit {

    public innerWidth: any;

    hotKeyList = [MenuHotKeys.NEW_TESTRUNNER, MenuHotKeys.NEW_TESTSUITE]

    projectId;
    isNewProject: boolean;
    apiKeyLoading: boolean = true;
    projectData: ProjectDto = {name: ""};
    projectDataIsLoading = true;
    projectVersionData: ProjectVersionDto[];
    projectUsersData: ProjectUserDto[];

    showNewVersionProject = false;
    showNewUserProject = false;

    fileTokenAccessDto: FileTokenAccessDto = {};
    // User var
    newUserProjectObject: UserDto = {email: "", name: "", password: "", username: ""};
    newUserProjectRole: "Developer";

    data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.'
    ];

    constructor( private activedRouter: ActivatedRoute,
                 private router: Router,
                 private message: NzMessageService,
                 private location: Location,
                 private fileService: FilesService,
                 private notificationService: NzMessageService,
                 private clipboardService: NzCopyToClipboardService,
                 private projectService: ProjectService) { }

    ngOnInit() {
        this.projectId = this.activedRouter.snapshot.params.id;
        this.getProject();
        this.getProjectVersion();
        this.getProjectUsers();
        this.getProjectApikey();
    }

    getProject() {
        this.projectService.getProject(this.projectId, false).subscribe(data => {
            this.projectData = data;
            this.projectDataIsLoading = false;
        }, error => {
            this.projectDataIsLoading = false;
            throw new HttpErrorResponse(error);
        });
    }

    getProjectVersion() {
        this.projectService.getProjectVersion(this.projectId).subscribe(data => {
            this.projectVersionData = data;
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    getProjectUsers() {
        this.projectService.getProjectAllUsers(this.projectId).subscribe(data => {
            this.projectUsersData = data;
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    backOnClick() {
        this.location.back();
    }


    newProjectVersionOnClick() {
        this.showNewVersionProject = true;
    }

    closeNewProjectVersionOnClick() {
        this.showNewVersionProject = false;
    }

    successNewProjectVersionOnClick(project: ProjectDto) {
        this.showNewVersionProject = false;
        this.message.create('success','Project Version created');
        this.getProjectVersion();
    }

    /* NEW USER PROJECT */

    newUserProjectOnClick() {
        const user: UserDto = {email: "", name: "", password: "", username: ""};
        const role = 'Developer';

        this.newUserProjectRole = role;
        this.newUserProjectObject = user;
        this.showNewUserProject = true;
    }

    editUserProjectOnClick(user: UserDto) {
        const role = 'Developer';

        this.newUserProjectRole = role;
        this.newUserProjectObject = user;
        this.showNewUserProject = true;
    }

    closeUserNewProjectOnClick() {
        this.showNewUserProject = false;
    }

    successUserNewProjectOnClick() {
        this.showNewUserProject = false;
        this.message.create('success','Project user added');
        this.getProjectUsers();
    }

    editProjectNameOrTags() {
        console.log(this.projectData)
            this.projectService.createOrUpdateProject(this.projectData).subscribe(data => {
                this.isNewProject = false;
                this.message.create('success', 'Save');
            }, error => {
                throw new HttpErrorResponse(error);
            });
    }

    deleteProjectOnClick() {
        this.projectService.deleteProject(this.projectId).subscribe(data => {
            this.message.create('success', 'Project deleted successfully');
            this.router.navigate(['projects/']);
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    deleteProjectVersionOnClick(project_version: number) {
        this.projectService.deleteProjectVersion(this.projectId,project_version).subscribe(data => {

            if (data === true) {
                this.message.create('success', 'Project Version deleted successfully');
                this.ngOnInit();
            }

        }, error => {
            if (error.error.code === '500') {
                this.message.create('error', 'Cant delete versions in use');
            } else {
                throw new HttpErrorResponse(error);
            }
        });
    }


    getProjectApikey(){
        this.fileService.getFileTokenAccess(this.projectId,false).subscribe(data =>{
            this.fileTokenAccessDto = data;
            this.apiKeyLoading = false;
        }, error => {
            throw new HttpErrorResponse(error);
        })
    }

    refreshProjectApikey(){
        this.apiKeyLoading = true;
        this.fileService.getFileTokenAccess(this.projectId,true).subscribe(data =>{
            this.fileTokenAccessDto = data;
            this.apiKeyLoading = false;
            this.notificationService.create("success", "New api key generated.")
        }, error => {
            throw new HttpErrorResponse(error);
        })
    }

    copyToClipboard(textToCopy: string): void{
      this.clipboardService.copy(textToCopy).then( data => {
          this.notificationService.create("success", "Copied to clipboard")
      });
    }
}

