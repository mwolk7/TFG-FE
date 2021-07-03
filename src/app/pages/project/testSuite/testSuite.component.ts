import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {TestSuiteDto} from '@codegen/mtsuite-api/model/testSuiteDto';
import {TestSuiteService} from '@codegen/mtsuite-api/api/testSuite.service';
import {TestSuiteRunnerDto} from '@codegen/mtsuite-api/model/testSuiteRunnerDto';
import {TestSuiteRunnerService} from '@codegen/mtsuite-api/api/testSuiteRunner.service';
import {TestSuiteRunnerTableDto, TestSuiteRunnerTableDtoStatus} from '@codegen/mtsuite-api/model/testSuiteRunnerTableDto';
import {EnumService} from '@codegen/mtsuite-api/api/enum.service';
import {forkJoin, Observable} from 'rxjs';
import {TestSuiteRunnerStatisticsDto} from '@codegen/mtsuite-api/model/testSuiteRunnerStatisticsDto';
import {environment} from '../../../../environments/environment';
import {TestSuiteRunnerPaginationDto} from '@codegen/mtsuite-api/model/testSuiteRunnerPaginationDto';


@Component({
    selector: 'app-project',
    templateUrl: './testSuite.component.html',
    styleUrls: ['./testSuite.component.scss']
})
export class TestSuiteComponent implements OnInit {

    private api = environment.apiUrl;
    public innerWidth: any;
    public search: any = '';
    public status: any = null;


    testRunnerData: TestSuiteRunnerTableDto[] = [];
    isTestRunnerLoading = true;
    testSuiteRunnerPagination: TestSuiteRunnerPaginationDto[] = [];

    testSuiteData: TestSuiteDto = {modules: undefined, name: ''};
    isTestSuiteLoading : boolean = true;

    private projectId;
    private testSuiteId;

    // Select
    testSuiteStatusSelect: object[];
    // checkboxes
    masterCheck = false;
    indeterminate = false;
    isChecked = false;
    page = 1;
    size = 10;
    totalPaginationElements: number;

    // statistic counters
    statisticData: StatisticData = {
        cancelledStatusCount: 0,
        finishedStatusCount: 0,
        pendingStatusCount: 0,
        runningStatusCount: 0,
        totalTestRunner: 0,
        waitingStatusCount: 0,
    };

    // Data
    testSuiteRunner: TestSuiteRunnerDto = {
        name: '',
        creatorUserId: null, projectVersion: undefined, modules: undefined, testSuiteId: null, testSuiteName: '', users: undefined};

    constructor(private modalService: NzModalService,
                private router: Router,
                private activedRouter: ActivatedRoute,
                private testSuiteService: TestSuiteService,
                private testSuiteRunnerService: TestSuiteRunnerService,
                private enumServices: EnumService,
                private message: NzMessageService
    ) {
    }

    ngOnInit() {
        this.projectId = this.activedRouter.snapshot.params.id;
        this.testSuiteId = this.activedRouter.snapshot.params.idTestSuite;
        this.getTestRunners();
        this.getTestSuite();
        this.initEnums();
    }

    /**
     * Get enums
     */
    private getEnums(): Observable<any[]> {

        // const enumBrowsers = this.enumServices.getEnum('BROWSERS');

        // const enumOs = this.enumServices.getEnum('OS');

        // const enumDevices = this.enumServices.getEnum('DEVICES');

        const enumTestSuiteStatus = this.enumServices.getEnum('TESTSUITE_STATUS');

        return forkJoin([enumTestSuiteStatus]);
    }

    initEnums() {
        this.getEnums().subscribe(responseList => {
            // const enumBrowsers = responseList[0];
            // const enumOs = responseList[1];
            // const enumDevices = responseList[2];
            const enumTestSuiteStatus = responseList[0];

            // this.osSelect = enumOs;
            // this.devicesSelect = enumDevices;
            // this.browserSelect = enumBrowsers;
            this.testSuiteStatusSelect = enumTestSuiteStatus;
        });
    }

    getTestSuite() {
        this.testSuiteService.getTestSuiteById(this.testSuiteId).subscribe(data => {
            this.testSuiteData = data;
            this.isTestSuiteLoading = false;
        }, error => {
            this.isTestSuiteLoading = false;
            throw new HttpErrorResponse(error);
        });
    }

    getTestRunners() {
        this.testSuiteRunnerService.getTestSuiteRunnersByTestSuite(this.testSuiteId, (this.page)-1, this.size, this.status).subscribe(data => {
            this.testRunnerData = data.data;
            this.totalPaginationElements = data.totalElements;
            this.isTestRunnerLoading = false;
        }, error => {
            this.isTestRunnerLoading = false;
            throw new HttpErrorResponse(error);
        });
    }

    onChangeSelect($event) {
        this.status = $event;
        this.page = 1;
        this.getTestRunners();
        this.masterCheck = false;
        this.toggleCheckAll();
    }

    deleteTestSuiteCallback(id: number, resolve: any) {
        console.log('delete');

        this.testSuiteService.deleteTestSuiteById(id.toString()).subscribe(data => {
            if (data) {
                this.getTestRunners();
                this.message.create('success', 'TestSuite deleted');
            }
        });

        resolve();
    }

    deleteTestSuiteOnClick(testSuite: TestSuiteDto) {
        this.modalService.error({
            nzTitle: 'Are you sure to delete ' + testSuite.name + '?',
            nzOkText: 'Delete',
            nzCancelText: 'Cancel',
            nzOnOk: () => new Promise(resolve => this.deleteTestSuiteCallback(testSuite.id, resolve))
        });
    }

    editTestSuite() {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId + '/editor']);
    }


    getTestCasesString(testRunner: TestSuiteRunnerDto) {
        return testRunner.statistics.totalTestCases.toString() + ' en ' + testRunner.statistics.totalModules.toString() + ' modulos';
    }

    getRemaining(testRunner: TestSuiteRunnerDto) {
        if (testRunner.statistics.totalTestCases === 0) {
            return '0';
        }
        // tslint:disable-next-line:max-line-length
        return (testRunner.statistics.passed + testRunner.statistics.failed + testRunner.statistics.cnt + testRunner.statistics.na) * 100 / (testRunner.statistics.totalTestCases);
    }

    backOnClick() {
        this.router.navigate(['projects/' + this.projectId]);
    }

    testRunnerTableOnClick(testRunner: TestSuiteRunnerDto) {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId + '/testRunners/' + testRunner.id]);
    }

    newTestRunnerOnClick() {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId + '/testRunners/0/editor']);
    }

    toggleCheckAll(): void {
        this.indeterminate = false;
        if (this.masterCheck) {
            this.testRunnerData = this.testRunnerData.map(item => {
                return {
                    ...item,
                    checked: true
                };
            });
        } else {
            this.testRunnerData = this.testRunnerData.map(item => {
                return {
                    ...item,
                    checked: false
                };
            });
        }

        this.calculateStatistics();
    }

    private calculateStatistics() {

        this.statisticData.totalTestCases = 0;
        this.statisticData.passed = 0;
        this.statisticData.failed = 0;
        this.statisticData.cnt = 0;
        this.statisticData.na = 0;
        this.statisticData.bugsReported = 0;
        this.statisticData.remaining = 0;
        this.statisticData.pendingStatusCount = 0;
        this.statisticData.runningStatusCount = 0;
        this.statisticData.waitingStatusCount = 0;
        this.statisticData.finishedStatusCount = 0;
        this.statisticData.cancelledStatusCount = 0;
        this.statisticData.totalTestRunner = 0;

        this.testRunnerData.forEach( item => {

            if (!item.checked) {
                return;
            }

            switch (item.status) {
                case TestSuiteRunnerTableDtoStatus.Pending:
                    this.statisticData.pendingStatusCount++;
                    break;
                case TestSuiteRunnerTableDtoStatus.Running:
                    this.statisticData.runningStatusCount++;
                    break;
                case TestSuiteRunnerTableDtoStatus.Waiting:
                    this.statisticData.waitingStatusCount++;
                    break;
                case TestSuiteRunnerTableDtoStatus.Finished:
                    this.statisticData.finishedStatusCount++;
                    break;
                case TestSuiteRunnerTableDtoStatus.Cancelled:
                    this.statisticData.cancelledStatusCount++;
                    break;
            }

            this.statisticData.passed += item.statistics.passed;
            this.statisticData.failed += item.statistics.failed;
            this.statisticData.cnt += item.statistics.cnt;
            this.statisticData.na += item.statistics.na;
            this.statisticData.totalTestCases += item.statistics.totalTestCases;
            this.statisticData.bugsReported += item.statistics.bugsReported;

            this.statisticData.totalTestRunner++;
        } );
    }

    toggleCheckSingle(data: TestSuiteRunnerTableDto): void {

        if (this.testRunnerData.every(item => !item.checked)) {
            this.masterCheck = false;
            this.indeterminate = false;
        } else if (this.testRunnerData.every(item => item.checked)) {
            this.masterCheck = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = true;
        }

        this.calculateStatistics();
    }

    pageIndexChanged() {
        this.getTestRunners()
    }

}

interface DataItem {
    name: string;
    age: number;
    address: string;
}

interface ColumnItem {
    name: string;
}

interface StatisticData extends TestSuiteRunnerStatisticsDto {
    pendingStatusCount: number;
    runningStatusCount: number;
    waitingStatusCount: number;
    finishedStatusCount: number;
    cancelledStatusCount: number;
    totalTestRunner: number;
}
