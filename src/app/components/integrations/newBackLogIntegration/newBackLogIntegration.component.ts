import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {BackLogCredentialDto} from '@codegen/mtsuite-api/model/backLogCredentialDto';
import {BugReporterService} from '@codegen/mtsuite-api/api/bugReporter.service';
import {HttpErrorResponse} from '@angular/common/http';
import {BugReporterCredentialDtoType} from '@codegen/mtsuite-api/model/bugReporterCredentialDto';

@Component({
  selector: 'app-new-backlog-integration',
  templateUrl: './newBackLogIntegration.component.html',
  styleUrls: ['./newBackLogIntegration.component.scss']
})
export class NewBackLogIntegrationComponent implements OnInit {

  @Input() showNewIntegration: boolean;
  @Input() newIntegration: BackLogCredentialDto;

  @Output()
  closeOnClick = new EventEmitter<void>();

  @Output()
  successOnClick = new EventEmitter<void>();

  isConfirmNewIntegrationLoading = false;

  // newIntegration: BackLogIntegrationDto = {id: null, apiKey: '', name: ''};

  constructor(private projectService: ProjectService,
              private bugReporterService: BugReporterService) { }

  ngOnInit() {
  }

  cancelNewProjectOnClick() {
    this.isConfirmNewIntegrationLoading = false;
    this.closeOnClick.emit();
  }

  confirmNewProjectOnClick() {
    this.isConfirmNewIntegrationLoading = true;

    // Create project
    if (this.newIntegration != null) {
    }

    this.newIntegration.type = BugReporterCredentialDtoType.Backlog;

    this.bugReporterService.createOrUpdateBugReporterCredential(this.newIntegration).subscribe(data => {
      this.isConfirmNewIntegrationLoading = false;
      this.successOnClick.emit();
    }, error => {
      this.isConfirmNewIntegrationLoading = false;
      throw new HttpErrorResponse(error);
    });

    /*
    this.projectService.createOrUpdateProject(this.newProject).subscribe(data => {
      this.isConfirmNewIntegrationLoading = false;
      this.successOnClick.emit(data);
      return;
    }, error => {
      this.isConfirmNewIntegrationLoading = false;
      this.closeOnClick.emit();
      throw new HttpErrorResponse(error);
    })
    */

  }

  helpOnClick(url: string) {
    window.open(url, '_blank');
  }

}
