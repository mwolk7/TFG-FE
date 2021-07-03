import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestSuiteRunnerDto, TestSuiteRunnerDtoStatus} from '@codegen/mtsuite-api/model/testSuiteRunnerDto';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ProjectVersionDto} from '@codegen/mtsuite-api/model/projectVersionDto';

@Component({
  selector: 'app-project-new-project-version',
  templateUrl: './newProjectVersion.component.html',
  styleUrls: ['./newProjectversion.component.scss']
})
export class NewProjectVerComponent implements OnInit {

  @Input() showNewProjectVersion: boolean;
  @Input() projectId: number;

  @Output()
  closeOnClick = new EventEmitter<void>();

  @Output()
  successOnClick = new EventEmitter<ProjectVersionDto>();

  isConfirmNewProjectLoading = false;

  newProjectVersion: ProjectVersionDto = {};

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
  }

  cancelNewProjectOnClick() {
    this.isConfirmNewProjectLoading = false;
    this.closeOnClick.emit();
  }

  confirmNewProjectOnClick() {
    this.isConfirmNewProjectLoading = true;

    // this.newProjectVersion.projectID = this.projectId;

    this.projectService.createOrUpdateProjectVersion(this.projectId, this.newProjectVersion).subscribe(data => {
      this.isConfirmNewProjectLoading = false;
      this.newProjectVersion.project_version = "";
      this.successOnClick.emit(data);
      return;
    }, error => {
      this.isConfirmNewProjectLoading = false;
      this.closeOnClick.emit();
      throw new HttpErrorResponse(error);
    })

  }

}
