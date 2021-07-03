import {Component, OnInit, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {TestCaseDto} from '@codegen/mtsuite-api/model/testCaseDto';
import {NzDrawerRef} from 'ng-zorro-antd';
import {BugReporterService} from '@codegen/mtsuite-api/api/bugReporter.service';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BugReporterCredentialDto,
  BugReporterLogDto,
  ModuleDto,
  TestSuiteRunnerDto
} from '@codegen/mtsuite-api/model/models';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-base-integration',
  templateUrl: './baseIntegration.component.html',
  styleUrls: ['./baseIntegration.component.scss']
})
export class BaseIntegrationComponent implements OnInit {

  @Input() module: ModuleDto;
  @Input() testCase: TestCaseDto;
  @Input() testRunner: TestSuiteRunnerDto;
  @Input() projectId: string;


  credentials: BugReporterCredentialDto[]; // object
  lastBug: BugReporterLogDto = {};
  isCredentialLoading = false;

  // Boolean
  showNoCredentials = false;

  constructor(private router: Router,
              private bugReporterService: BugReporterService,
              private drawerRef: NzDrawerRef<string>) { }

  ngOnInit() {
      this.getIntegrationsData();
  }

  /**
   * Get enums
   */
  private getIntegrationsDataSinc(): Observable<any[]> {

    const bugReporter = this.bugReporterService.getBugReporterCredentialByUser()

    const getLastBug = this.bugReporterService.getLastBugReporter(0, this.testRunner.id);

    return forkJoin([bugReporter, getLastBug]);
  }

  getIntegrationsData() {
    this.isCredentialLoading = true;
    this.getIntegrationsDataSinc().subscribe(responseList => {
      const bugReporter = responseList[0];
      this.credentials = bugReporter;

      if (this.credentials.length == 0) {
        this.showNoCredentials = true;
      }

      const getLastBug = responseList[1];
      this.lastBug = getLastBug;
      // TODO PRESELECT TAB BY LAST BUG INTEGRATION ID
      this.isCredentialLoading = false;
    }, error => {

      this.isCredentialLoading = false;
      throw new HttpErrorResponse(error);
    });
  }

  closeDrawer() {
    this.drawerRef.close();
  }

}
