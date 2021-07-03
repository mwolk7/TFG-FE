import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuHotKeys} from '../../../../components/menus/hotKeyMenu/hotKeyMenu.component';
import {TestSuiteDto} from '@codegen/mtsuite-api/model/testSuiteDto';
import {TestSuiteService} from '@codegen/mtsuite-api/api/testSuite.service';
import {HttpErrorResponse} from '@angular/common/http';
import {EnumService} from '@codegen/mtsuite-api/api/enum.service';
import {NzMessageService, NzNotificationDataOptions, NzNotificationService} from 'ng-zorro-antd';
import {TestSuiteRunnerService} from '@codegen/mtsuite-api/api/testSuiteRunner.service';
import {
    TestSuiteRunnerDto,
    TestSuiteRunnerDtoStatus
} from '@codegen/mtsuite-api/model/testSuiteRunnerDto';
import {forkJoin, interval, Observable} from 'rxjs';
import {ProjectVersionDto} from '@codegen/mtsuite-api/model/projectVersionDto';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {ProjectUserDto, ProjectUserDtoRole} from '@codegen/mtsuite-api/model/projectUserDto';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TestCaseDtoPriority} from "@codegen/mtsuite-api/model/testCaseDto";
import {ProfileService} from '@codegen/mtsuite-api/api/profile.service';
import {CurrentUserDto} from '@codegen/mtsuite-api/model/currentUserDto';
import {UserDto} from '@codegen/mtsuite-api/model/userDto';
import {SelectTestCaseComponent} from '../../../../components/testCases/selectTestCase/selectTestCase.component';


@Component({
    selector: 'app-testrunner-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

    @ViewChild('selectTestCaseComponent', {static: false})
    selectTestCaseComponent: SelectTestCaseComponent;

    ngAfterViewInit () {

    }

    public innerWidth: any;
    validateForm!: FormGroup;

    hotkeys: MenuHotKeys[] = [MenuHotKeys.NEW_PROJECT, MenuHotKeys.NEW_TESTRUNNER];

    // projectId
    projectId: string;
    testSuiteId: string;
    testRunnerId: string;
    isNewTestRunner = true;
    today = new Date();
    change: boolean = false;
    testRunnerJSON: string;
    initialTestRunner: TestSuiteRunnerDto;
    testRunnerChangeSubscribe: any;
    modalVisibility = false;

    // Select
    projectVersionSelect: ProjectVersionDto[];
    usersSelect: ProjectUser[];
    selectAllFlag: boolean = false;

    // DATA
    testSuite: TestSuiteDto;
    testRunnerCopy: TestSuiteRunnerDto;
    testRunner: TestSuiteRunnerDto = {
        testSuiteId: 0,
        name: 'New Test Runner', modules: [], users: [], devices: [], os: [], browsers: [], dueDate: null};
    testRunnerIsLoading = false;
    actualUser: CurrentUserDto;
    testCaseDtoPriority: TestCaseDtoPriority[];

    public search: any = '';

    constructor(private activedRouter: ActivatedRoute,
                private router: Router,
                private testSuiteService: TestSuiteService,
                private testSuiteRunnerService: TestSuiteRunnerService,
                private projectService: ProjectService,
                private enumServices: EnumService,
                private notificationService: NzNotificationService,
                private fb: FormBuilder,
                private profileService: ProfileService,
                private message: NzMessageService) {
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            modules: [null, []],
            users : [null, []],
            devices: [null, []],
            os: [null, []],
            projectVersion: [null, []],
            browsers: [null, []],
            dueDate: [null, []],
        });

        console.log('INIT NEW TEST RUNNER');
        this.projectId = this.activedRouter.snapshot.params.id;
        this.testSuiteId = this.activedRouter.snapshot.params.idTestSuite;
        this.testRunnerId = this.activedRouter.snapshot.params.idTestRunner;

        if (this.testRunnerId !== '0') {
            this.isNewTestRunner = false;
        }

        this.getActualUser();
        this.initUi();

        const secondsCounter = interval(1000);

        this.testRunnerChangeSubscribe = secondsCounter.subscribe(data => {
            this.detectChange();
        });
    }

    detectChange() {
        const newData = JSON.stringify(this.testRunner);
        this.change = newData !== this.testRunnerJSON;
    }

    discardChanges() {
        this.testRunner = this.initialTestRunner;
        this.change = false;
        this.closeModal();
        this.message.create('success','Changes discarded' );
        this.initUi();

        const secondsCounter = interval(1000);
        this.testRunnerChangeSubscribe = secondsCounter.subscribe(data => {
            this.detectChange();
        });
    }

    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
    }

    disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.today) {
            return false;
        }
        return startValue.getTime() <= this.today.getTime();
    };

    /**
     * Get enums
     */
    private initEnumsSinc(): Observable<any[]> {

        const testSuite =  this.testSuiteService.getTestSuiteById(this.testSuiteId);

        const projectVersion = this.projectService.getProjectVersion(parseInt(this.projectId));

        const users = this.projectService.getProjectAllUsers(parseInt(this.projectId));

        return forkJoin([testSuite, projectVersion, users]);
    }


    initUi() {
        this.initEnumsSinc().subscribe(responseList => {
            const testSuite = responseList[0];
            const projectVersion = responseList[1];
            const users = responseList[2];

            this.testSuite = this.parseAndLoadTestSuiteData(testSuite);
            this.projectVersionSelect = projectVersion;
            this.usersSelect = users.map((e: ProjectUserDto) => {
                const user: ProjectUser = e;
                user.projectUserId = e.id;
                user.id = e.userId;
                return user;
            });

            this.initTestRunner();
        });
    }

    private initTestRunner() {
        if (this.isNewTestRunner) {
            this.getInitialTestRunner();
        } else {
            this.getTestRunner();
        }
    }

    getActualUser() {
        this.profileService.getCurrentUser().subscribe( data => {
            this.actualUser = data;
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    // GET TEST SUITE BY ID
    private getTestRunner() {
        this.testSuiteRunnerService.getTestSuiteRunnerById(this.testRunnerId).subscribe(data => {

            if ( data.status !== TestSuiteRunnerDtoStatus.Pending)  {
                this.goToTestRunnerRunner();
                return;
            }

            this.initialTestRunner = data;
            this.parseAndLoadTestSuiteData(data);
            this.testRunnerJSON = JSON.stringify(this.initialTestRunner);
            this.testRunner = data;
            this.testRunnerIsLoading = false;
            this.change = false;
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

        this.testRunner = data;

        this.testRunnerJSON = JSON.stringify(this.testRunner).toString();

        return data;
    }

    // GET INITAL TESTSUITE
    private getInitialTestRunner() {
        this.testRunner.id = null;
        this.testRunner.testSuiteId = parseInt(this.testSuiteId);
        this.testRunner.modules = this.testSuite.modules;
        this.testRunner.status = TestSuiteRunnerDtoStatus.Pending;
        this.testRunner.users.push(<UserDto> this.actualUser);
        this.initialTestRunner = this.testRunner;
    }

    cancelTestRunnerOnClick(): void {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId]);
    }

    newTestRunnerOnClick() {
        if(this.validateForm.valid){
            this.testSuiteRunnerService.setTestSuiteRunner(this.testRunner).subscribe(data => {
                this.isNewTestRunner = false;
                this.message.create('success', 'Save');
                this.testRunner = this.parseAndLoadTestSuiteData(data);
                this.testRunnerId = this.testRunner.id.toString();
                this.closeModal();
                this.change = false;
            }, error => {
                throw new HttpErrorResponse(error);
            });
        } else {
            const options: NzNotificationDataOptions<any> = { nzPauseOnHover: true };
            this.notificationService.error('Error ', 'wrong input', options);
        }
    }

    startTestRunner() {
        this.testSuiteRunnerService.runTestSuiteRunner(this.testRunner.id).subscribe(data => {
            this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId + '/testRunners/' + this.testRunnerId]);
        }, error => {
            if (error.error.code === '401') {
                const options: NzNotificationDataOptions<any> = { nzPauseOnHover: true };
                this.notificationService.error('Error 401', 'Access denied', options);
            } else {
                throw new HttpErrorResponse(error);
            }
        });
    }

    goToTestRunnerRunner() {
        this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId + '/testRunners/' + this.testRunnerId]);
    }

    printTestRunner() {
        console.log(this.testRunner)
    }

    userCompare(item1, item2) {
        return item1 && item2 && item1.id == item2.id;
    }

    versionCompare(item1, item2) {
        return item1 && item2 && item1.id == item2.id;
    }

    cloneTestRunner(testRunner: TestSuiteRunnerDto) {
        testRunner.id = null;
        testRunner.createdDate = null;
        testRunner.lastModifiedDate = null;
        testRunner.creatorUserId = null;
        testRunner.statistics = null;
        testRunner.name = 'Clone of ' + testRunner.name;
        testRunner.startDate = null;
        testRunner.finishDate = null;
        this.testSuiteRunnerService.setTestSuiteRunner(testRunner).subscribe(data => {
            this.testRunnerCopy = data;
            this.message.create('success', 'Test runner cloned successfully');
            this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testRunnerCopy.testSuiteId + '/testRunners/' + this.testRunnerCopy.id + '/editor']);
        })
    }

    deleteTestRunner() {
        this.testSuiteRunnerService.deleteTestSuiteRunnerById(String(this.testRunner.id)).subscribe(data => {
            this.message.create('success', 'Test runner deleted successfully');
            this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId + '/dashboard' ]);
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    showModal() {
        this.modalVisibility = true;
    }

    closeModal() {
        this.modalVisibility = false;
    }

    selectAll() {
        this.selectAllFlag = !this.selectAllFlag;
        if (this.selectAllFlag) {
            this.selectTestCaseComponent.updateAllChecked();
            this.testRunner.modules.forEach(m => {
                m.testCases = m.testCases.map(tc => {
                    this.selectTestCaseComponent.allChecked = true;
                    return {
                        ...tc,
                        run: true
                    };
                })
            })

        } else {
            this.selectTestCaseComponent.updateAllChecked();
            this.testRunner.modules.forEach(m => {
                m.testCases = m.testCases.map(tc => {
                    this.selectTestCaseComponent.allChecked = false;
                    return {
                        ...tc,
                        run: false
                    };
                })
            })
        }
    }
}

export interface ProjectUser {
    projectUserId?: number;
    createdDate?: string;
    lastModifiedDate?: string;
    role?: ProjectUserDtoRole;
    name: string;
    username: string;
    email: string;
    actualUserProject?: boolean;
    id?: number;
}
