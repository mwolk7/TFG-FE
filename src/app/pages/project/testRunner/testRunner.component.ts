import {Component, OnInit} from '@angular/core';
import {TestSuiteRunnerDto, TestSuiteRunnerDtoStatus} from '@codegen/mtsuite-api/model/testSuiteRunnerDto';
import {TestSuiteRunnerService} from '@codegen/mtsuite-api/api/testSuiteRunner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {NzDrawerService, NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {BaseIntegrationComponent} from '../../../components/integrations/baseIntegration/baseIntegration.component';
import {TestCaseDto} from '@codegen/mtsuite-api/model/testCaseDto';
import {ModuleDto} from '@codegen/mtsuite-api/model/moduleDto';


@Component({
    selector: 'app-project',
    templateUrl: './testRunner.component.html',
    styleUrls: ['./testRunner.component.scss']
})
export class TestRunnerComponent implements OnInit {

    public innerWidth: any;

    projectId: string;
    testSuiteId: string;
    testRunnerId: string;

    testRunner: TestSuiteRunnerDto = {
        name: "",
        creatorUserId: 0, modules: undefined, testSuiteId: 0, testSuiteName: '', users: undefined
    };

    testRunnerIsLoading = true;

    canFinish  = false;
    isClosed = false;

    currentStep = 1;

    constructor( private activedRouter: ActivatedRoute,
                 private router: Router,
                 private drawerService: NzDrawerService,
                 private message: NzMessageService,
                 private testSuiteRunnerService: TestSuiteRunnerService) { }

    ngOnInit() {
        this.projectId = this.activedRouter.snapshot.params.id;
        this.testRunnerId = this.activedRouter.snapshot.params.idTestRunner;

        this.getTestRunner();
    }


    // GET TEST RUNNER BY ID
    private getTestRunner() {
        this.testSuiteRunnerService.getTestSuiteRunnerById(this.testRunnerId).subscribe(data => {

            this.testSuiteId = data.testSuiteId.toString();

            if ( data.status === TestSuiteRunnerDtoStatus.Pending)  {
                this.goToTestRunnerEditor();
                return;
            }

            if ( data.statistics.totalTestCases === (data.statistics.passed + data.statistics.failed + data.statistics.na + data.statistics.cnt)   ) {
                this.canFinish = true;
            }

            if ( data.status === TestSuiteRunnerDtoStatus.Finished || data.status === TestSuiteRunnerDtoStatus.Cancelled)  {
                this.isClosed = true;
                this.canFinish = false;
                this.currentStep = 2;
            }

            this.testRunner = this.parseAndLoadTestSuiteData(data);

            this.testRunnerIsLoading = false;
        }, error => {
            this.testRunnerIsLoading = false;
            throw new HttpErrorResponse(error);
        });
    }

    private parseAndLoadTestSuiteData(data) {
        // SORT MODULES
        data.modules.sort((a, b) => (a.order > b.order) ? 1 : -1);

        data.modules.forEach(module => {
            if (module.testCases === undefined) {
                return;
            }

            // SORT TEST CASES
            module.testCases.sort((a, b) => (a.order > b.order) ? 1 : -1);

            module.testCases.forEach(testCase => {
                if (testCase.steps === undefined) {
                    testCase.steps = [];
                    return;
                }

                // SORT STEPS
                testCase.steps.sort((a, b) => (a.order > b.order) ? 1 : -1);
            });
        });

        return data;
    }


    openDrawerNewBug(testCaseObj: TestCaseDto,module: ModuleDto): void {
        const drawerRef = this.drawerService.create<BaseIntegrationComponent, {module: ModuleDto, testCase: TestCaseDto, testRunner: TestSuiteRunnerDto, projectId: string }, string>({
            nzTitle: 'Report Bug',
            nzContent: BaseIntegrationComponent,
            nzBodyStyle: { height: 'calc(100% - 55px)', overflow: 'auto', padding: '0px'},
            nzWidth: 720,
            nzMaskClosable: false,
            nzMask: false,
            nzContentParams: {
                module: module,
                testCase: testCaseObj,
                testRunner: this.testRunner,
                projectId: this.projectId
            }
        });
    }

    goToTestRunnerEditor() {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId + '/testRunners/' + this.testRunnerId + '/editor']);
    }

    goBack(): void {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId]);
    }

    runTestSuiteRunner() {
        this.testSuiteRunnerService.runTestSuiteRunner(this.testRunner.id).subscribe(data => {
            this.message.create('success', 'TestRunner running');
            this.getTestRunner();
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    pauseTestSuiteRunner() {
        this.testSuiteRunnerService.pauseTestSuiteRunner(this.testRunner.id).subscribe(data => {
            this.message.create('success', 'TestRunner paused');
            this.getTestRunner();
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    cancelTestRunner() {
        this.testSuiteRunnerService.cancelTestSuiteRunner(this.testRunner.id).subscribe(data => {
            this.message.create('success', 'TestRunner cancelled');
            this.getTestRunner();
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    finishTestRunner() {
        this.testSuiteRunnerService.finishTestSuiteRunner(this.testRunner.id).subscribe(data => {
            this.message.create('success', 'TestRunner finished');
            this.getTestRunner();
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    changeTestCaseStatusOnClick() {
        this.testSuiteRunnerService.setTestSuiteRunner(this.testRunner).subscribe(data => {
            this.message.create('success', "Status updated");
            this.getTestRunner();
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    getTotalTestCaseToRunByModule( module: ModuleDto ): number {
        let total = 0;
        module.testCases.forEach( data => {
            if( data.run  ) {
                total++;
            }
        } );

        return total;

    }
}

