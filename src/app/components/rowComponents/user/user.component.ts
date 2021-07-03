import {Component, OnInit, Input, Output} from '@angular/core';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {UserDto} from '@codegen/mtsuite-api/model/userDto';
import {ProjectUserDto, ProjectUserDtoRole} from '@codegen/mtsuite-api/model/projectUserDto';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-row-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() projectUser: ProjectUserDto;
  @Input() projectId: number;
  projectUsersData: Array<ProjectUserDto>;

  constructor(private router: Router,
              private projectService: ProjectService,
              private message: NzMessageService) { }

  ngOnInit() {

  }

  deleteProjectUserOnClick() {
    this.projectService.deleteUserFromProject(this.projectId, this.projectUser.id).subscribe(data => {
      this.message.create('success', 'Project User deleted successfully');
      window.location.reload();
    }, error => {
      throw new HttpErrorResponse(error);
    });
  }
}
