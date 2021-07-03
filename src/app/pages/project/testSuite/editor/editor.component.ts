import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuHotKeys} from '../../../../components/menus/hotKeyMenu/hotKeyMenu.component';
import {DragDropModule, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ApiService} from '@codegen/mtsuite-api/api/api.service';
import {TestSuiteDto, TestSuiteDtoBrowsers, TestSuiteDtoDevices, TestSuiteDtoOs} from '@codegen/mtsuite-api/model/testSuiteDto';
import {TestSuiteService} from '@codegen/mtsuite-api/api/testSuite.service';
import {HttpErrorResponse} from '@angular/common/http';
import {EnumService} from '@codegen/mtsuite-api/api/enum.service';
import {TestCaseDto} from '@codegen/mtsuite-api/model/testCaseDto';
import {forkJoin, from, interval, Observable} from 'rxjs';
import {NzMessageService, NzNotificationDataOptions, NzNotificationService, UploadXHRArgs} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {ModuleDto} from '@codegen/mtsuite-api/model/moduleDto';
import {FileDto} from "@codegen/mtsuite-api/model/models";
import {FilesService} from "@codegen/mtsuite-api/api/files.service";

function getBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
}


@Component({
    selector: 'app-testsuite-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

    public innerWidth: any;

    hotkeys: MenuHotKeys[] = [MenuHotKeys.NEW_PROJECT, MenuHotKeys.NEW_TESTRUNNER];

    // projectId
    projectId: string;
    testSuiteId: string;
    isNewTestSuite = true;

    newModuleValue: string;

    change: boolean;

    // Select
    osSelect: object[];
    devicesSelect: object[];
    browserSelect: object[];
    modalVisibility = false;

    // DATA
    testSuite: TestSuiteDto = {modules: undefined, name: 'New Test Suite', description: ''};
    testSuiteBase: string;
    initialTestSuite: TestSuiteDto;
    testSuiteClone: TestSuiteDto;
    testSuiteChangeSubscribe: any;

    title: string;
    validateForm: FormGroup;


    constructor(private activedRouter: ActivatedRoute,
                private router: Router,
                private testSuiteService: TestSuiteService,
                private enumServices: EnumService,
                private fb: FormBuilder,
                private notificationService: NzNotificationService,
                private location: Location,
                private filesService: FilesService,
                private message: NzMessageService) {
    }

    ngOnInit() {

        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            description: [null],
            devices: [null],
            os: [null],
            browsers: [null]
        });

        console.log('INIT NEW');
        this.projectId = this.activedRouter.snapshot.params.id;
        this.testSuiteId = this.activedRouter.snapshot.params.idTestSuite;

        console.log('IDTestSuite:' + this.testSuiteId);

        if (this.testSuiteId !== '0') {
            this.isNewTestSuite = false;
        }

        this.initUi();

        const secondsCounter = interval(1000);

        this.testSuiteChangeSubscribe = secondsCounter.subscribe(data => {
           this.detectChange();
        });
    }

    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
    }

    /**
     * Get enums
     */
    private initEnumsSinc(): Observable<any[]> {

        const enumBrowsers = this.enumServices.getEnum('BROWSERS');

        const enumOs = this.enumServices.getEnum('OS');

        const enumDevices = this.enumServices.getEnum('DEVICES');

        return forkJoin([enumBrowsers, enumOs, enumDevices]);
    }


    initUi() {
        this.initEnumsSinc().subscribe(responseList => {
            const enumBrowsers = responseList[0];
            const enumOs = responseList[1];
            const enumDevices = responseList[2];

            this.osSelect = enumOs;
            this.devicesSelect = enumDevices;
            this.browserSelect = enumBrowsers;

            this.initTestSuite();
        });
    }



    // GET TEST SUITE
    private initTestSuite() {
        if (this.isNewTestSuite) {
            this.getInitialTestSuite();
        } else {
            this.getTestSuite();
        }
    }

    // GET TEST SUITE BY ID
    private getTestSuite() {
        this.testSuiteService.getTestSuiteById(this.testSuiteId).subscribe(data => {
            this.initialTestSuite = data;
            this.parseAndLoadTestSuiteData(data);
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    deleteTestSuiteOnClick() {
        this.testSuiteService.deleteTestSuiteById(String(this.testSuite.id)).subscribe(data => {
            this.message.create('success', 'Test Suite deleted successfully');
            this.router.navigate(['projects/' + this.projectId + '/dashboard']);
        }, error => {
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

        this.testSuite = data;
        this.title = this.testSuite.name;

        this.testSuiteBase = JSON.stringify(this.testSuite).toString();

    }

    // GET INITAL TESTSUITE
    private getInitialTestSuite() {
        this.title = 'New Test Suite';
        this.testSuite.projectId = parseInt(this.projectId);
        this.testSuite.modules = [];
        this.testSuiteBase = JSON.stringify(this.testSuite).toString();
        this.initialTestSuite = this.testSuite;
    }

    // GENERAL FUNCTIONS

    newTestSuiteOnClick(): void {
        if (this.validateForm.valid) {
            this.testSuite.modules.forEach(module => {
                module.order = this.testSuite.modules.indexOf(module).toString();

                if (module.testCases === undefined) {
                    return;
                }
                module.testCases.forEach(testCase => {
                    testCase.order = module.testCases.indexOf(testCase).toString();

                    if (testCase.steps === undefined) {
                        return;
                    }
                    testCase.steps.forEach(step => {
                        step.order = testCase.steps.indexOf(step).toString();
                    });
                });
            });

            this.testSuiteService.setTestSuite(this.testSuite).subscribe(data => {
                this.isNewTestSuite = false;
                this.change = false;
                this.modalVisibility = false;
                this.testSuiteId = String(data.id);
                this.message.create('success', 'Save');
                this.parseAndLoadTestSuiteData(data);
            }, error => {
                if (error.status == '400') {
                    this.message.error('name, modules and test cases are mandatory fields!')
                } else {
                    throw new HttpErrorResponse(error);
                }
            });

            this.testSuiteBase = JSON.stringify(this.testSuite).toString();

            console.log(this.testSuite);
        }

    }

    cancelTestSuiteOnClick(): void {
        console.log(this.testSuite);

        if (this.isNewTestSuite) {
            this.router.navigate(['projects/' + this.projectId + '/testSuites']);
        } else {
            this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteId]);
        }
    }

    // MODULE FUNCTIONS

    addModuleOnClick() {
        this.testSuite.modules.push({name: this.newModuleValue, testCases: []});
        this.newModuleValue = '';
    }

    deleteModuleOnClick(item: any) {
        console.log(item);
        this.testSuite.modules = this.testSuite.modules.filter(obj => obj !== item);
    }

    // TEST CASE FUNCTION

    addTestCaseOnClick(array: any, object: any) {
        if(object == null) {
            array.push({name: 'New Test Case', steps: []});
            return;
        }

        array.push({name: object.value, steps: []});
        object.value = '';
    }

    deleteTestCaseOnClick(item: any, array: any) {
        console.log(item);
        console.log(array);
        // tslint:disable-next-line:prefer-const
        let modulesTmp = [];

        this.testSuite.modules.forEach(module => {
            module.testCases = module.testCases.filter(obj => obj !== item);
            modulesTmp.push(module);
        });

        this.testSuite.modules = modulesTmp;

    }

    copyTestCase(testCase: TestCaseDto, to: any) {
        let newObj = $.extend(true, {}, testCase);
        newObj.name = 'Copy of ' + testCase.name;
        to.push(newObj);
    }

    copyModule(module: ModuleDto, to: any) {
        let newObj = $.extend(true, {}, module);
        newObj.name = 'Copy of ' + module.name;
        to.push(newObj);
    }

    detectChange() {
        const newData = JSON.stringify(this.testSuite);
        this.change = newData !== this.testSuiteBase;
    }

    /* --- EXTRAS ----*/

    // DROP EVENTS
    drop(event: CdkDragDrop<string[]>, array: any) {
        moveItemInArray(array, event.previousIndex, event.currentIndex);

        console.log(this.testSuite.modules);
    }

    showConfirmationModal() {
        this.modalVisibility = true;
    }

    discardChanges() {
       this.testSuite = this.initialTestSuite;
       this.change = false;

        this.closeConfirmationModal();

        this.message.create('success','Changes discarded' );
       this.initUi();

       const secondsCounter = interval(1000);
       this.testSuiteChangeSubscribe = secondsCounter.subscribe(data => {
           this.detectChange();
       });
    }

    closeConfirmationModal() {
        this.modalVisibility = false;
    }

    backOnClick() {
        this.location.back();
    }

    cloneTestSuite(testSuite: TestSuiteDto) {
        testSuite.id = null;
        testSuite.createdDate = null;
        testSuite.lastModifiedDate = null;
        testSuite.creatorUserId = null;
        testSuite.name = 'Clone of ' + testSuite.name;
        this.testSuiteService.setTestSuite(testSuite).subscribe(data => {
            this.testSuiteClone = data;
            this.message.create('success', 'Test suite cloned successfully');
            this.router.navigate(['projects/' + this.projectId + '/testSuites/' + this.testSuiteClone.id + '/dashboard']);
        })
    }


    handleUpload = (item: any) => {


    }

    uploadFile = (item: UploadXHRArgs) => {
        const newFileDto: FileDto = {};

        return getBase64(item.file).then((content) => {
            newFileDto.name =  item.file.name.replace(/ /g, ''),
                newFileDto.content = content.toString();


            this.filesService.mapExcelToTestSuite(Number(this.projectId), newFileDto).subscribe(data => {
                item.onSuccess( data, item.file, item);
                this.testSuite = data;
                this.testSuite.projectId = Number(this.projectId);
            }, error => {
                item.onError!( error, item.file);
                throw new HttpErrorResponse(error);
            });
        }).catch(error => {
            item.onError!( error, item.file);
            throw new HttpErrorResponse(error);
        });
    }

}

