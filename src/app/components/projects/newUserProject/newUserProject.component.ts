import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestSuiteRunnerDto, TestSuiteRunnerDtoStatus} from '@codegen/mtsuite-api/model/testSuiteRunnerDto';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {UserDto} from '@codegen/mtsuite-api/model/userDto';
import {Roles} from '../../../commons/roles/roles';
import {EnumService} from '@codegen/mtsuite-api/api/enum.service';
import {UserProjectDto, UserProjectDtoRol} from '@codegen/mtsuite-api/model/models';

@Component({
  selector: 'app-new-user-project',
  templateUrl: './newUserProject.component.html',
  styleUrls: ['./newUserProject.component.scss']
})
export class NewUserProjectComponent implements OnInit {

  @Input() showNewUserProject: boolean;
  @Input() parentProject: ProjectDto;
  @Input() user: UserDto;
  @Input() role: UserProjectDtoRol;

  @Output()
  closeOnClick = new EventEmitter<void>();

  @Output()
  successOnClick = new EventEmitter<void>();

  isConfirmNewUserProjectLoading = false;

  isUserLoading = false;
  userList: UserDto[];

  // Data
  roles: object[];

  constructor(private enumService: EnumService,
              private projectService: ProjectService) { }

  ngOnInit() {

    this.getRoles();

  }

  getRoles() {
    this.enumService.getEnum('ROLES').subscribe(data => {
      this.roles = data;
      this.isConfirmNewUserProjectLoading = false;
    }, error => {
      throw new HttpErrorResponse(error);
      this.isConfirmNewUserProjectLoading = false;
      this.closeOnClick.emit();
    });

  }

  cancelNewProjectOnClick() {
    this.isConfirmNewUserProjectLoading = false;
    this.closeOnClick.emit();
  }

  confirmNewProjectOnClick() {
    this.isConfirmNewUserProjectLoading = true;

    // Create project
    if (this.parentProject == null) {
      this.isConfirmNewUserProjectLoading = false;
      this.closeOnClick.emit();
    }

    if (this.parentProject == null) {
      this.isConfirmNewUserProjectLoading = false;
      this.closeOnClick.emit();
    }

    const relationToSave: UserProjectDto = {id: null, projectId: this.parentProject.id, userId: this.user.id, rol: this.role};

    console.log(this.parentProject);

    this.projectService.addUserToProject(this.parentProject.id, relationToSave).subscribe(data => {
      this.isConfirmNewUserProjectLoading = false;
      this.successOnClick.emit();
    }, error => {
      this.isConfirmNewUserProjectLoading = false;
      throw new HttpErrorResponse(error);
    });
  }


  getUserLabel(user: UserDto): string {
    return user.name + ' (' + user.username + ') ';
  }

  onSearch(value: string): void {

    if (this.isUserLoading === true) {
      return;
    }

    this.isUserLoading = true;

    this.projectService.searchByUser(value).subscribe(data => {
      this.userList = data;
      this.isUserLoading = false;
    }, error => {
      console.log(error);
      this.isUserLoading = false;
    });


  }

}
