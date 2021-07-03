import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import {ProfileService} from '@codegen/mtsuite-api/api/profile.service';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {HttpErrorResponse} from '@angular/common/http';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {filter} from 'rxjs/operators';
import {CurrentUserDto, TableProjectDashboardDto} from '@codegen/mtsuite-api/model/models';

@Component({
  selector: 'app-top-menu',
  templateUrl: './topMenu.component.html',
  styleUrls: ['./topMenu.component.scss']
})
export class TopMenuComponent implements OnInit, OnDestroy {

  denominazione: string;
  email: string;

  selectedOS = null;

  subscription: Subscription;

  visibleProyects: boolean = false;

  pathProjects: ProjectDto[]=[];

  projectData: TableProjectDashboardDto[]=[];

  actualProjectId = 0;

  public searchProjectPopUp: any = '';

  currentUser: CurrentUserDto = {email: '', name: '', username: ''};

  constructor(
    private userService: UserService,
    private activedRouter: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private projectService: ProjectService
  ) {
  }

  ngOnInit() {
    this.profileService.getCurrentUser().subscribe(data => {
      this.currentUser = data;
    });

    this.subscribeToRouterParams();

    this.getUserProject();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  subscribeToRouterParams() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
        .subscribe( () => {
          let active = this.activedRouter;
          while (active.firstChild) { active = active.firstChild; };
          active.params.subscribe( (params: Params) => {
            this.changePath(params['id']);
          });
        });
  }

  changePath( newId: any) {

    if(newId === undefined) {
      this.pathProjects = []
      this.actualProjectId = newId;
      return;
    }

    if (newId !== this.actualProjectId) {
      this.actualProjectId = newId;
      this.refreshProyectPath();
      console.log(this.actualProjectId);
    }
  }

  refreshProyectPath() {

    this.projectService.getProject(this.actualProjectId, false).subscribe(data => {
      this.pathProjects = data.parentProjects;

    }, error => {
      throw new HttpErrorResponse(error);
    });

  }

  getUserProject() {
    this.projectService.getProjects().subscribe(data => {
      this.projectData = data;
    }, error => {
      throw new HttpErrorResponse(error);
    })
  }

  profiloOnClick = () => {
    this.router.navigate(['profile']);
  }


  logoutOnClick = () => {
    this.userService.logout();
  }

  goToProjects() {
    this.router.navigate(['']);
  }

  goToProject(project: ProjectDto) {
    this.visibleProyects = false;
    this.router.navigate(['projects/' + project.id]);
  }
}
