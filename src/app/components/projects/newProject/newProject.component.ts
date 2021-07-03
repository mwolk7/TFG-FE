import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestSuiteRunnerDto, TestSuiteRunnerDtoStatus} from '@codegen/mtsuite-api/model/testSuiteRunnerDto';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-new-project',
  templateUrl: './newProject.component.html',
  styleUrls: ['./newProject.component.scss']
})
export class NewProjectComponent implements OnInit {

  @Input() showNewProject: ProjectDto;
  @Input() parentProject: ProjectDto;

  @Output()
  closeOnClick = new EventEmitter<void>();

  @Output()
  successOnClick = new EventEmitter<ProjectDto>();

  isConfirmNewProjectLoading = false;

  newProject: ProjectDto = {name : ''};

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
  }

  cancelNewProjectOnClick() {
    this.isConfirmNewProjectLoading = false;
    this.closeOnClick.emit();
  }

  confirmNewProjectOnClick() {
    this.isConfirmNewProjectLoading = true;

    // Create project
    if (this.parentProject != null) {
      this.newProject.parentProjectId = this.parentProject.id;
    }

    this.projectService.createOrUpdateProject(this.newProject).subscribe(data => {
      this.isConfirmNewProjectLoading = false;
      this.successOnClick.emit(data);
      this.newProject.name = '';
      this.newProject.tag = '';
      return;
    }, error => {
      this.isConfirmNewProjectLoading = false;
      this.closeOnClick.emit();
      throw new HttpErrorResponse(error);
    });

  }

}
