import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TestCaseDto} from '@codegen/mtsuite-api/model/testCaseDto';
import {BugReporterInputDtoType} from '@codegen/mtsuite-api/model/bugReporterInputDto';
import {BackLogInputDto} from '@codegen/mtsuite-api/model/backLogInputDto';
import {BugReporterService} from '@codegen/mtsuite-api/api/bugReporter.service';
import {HttpErrorResponse} from '@angular/common/http';
import {BugReporterCredentialDto} from '@codegen/mtsuite-api/model/bugReporterCredentialDto';
import {
  BugReporterLogDto,
  BugReporterModelDto,
  BugReporterProjectDto, FileDto, ModuleDto,
  ProjectDto,
  TestSuiteRunnerDto
} from '@codegen/mtsuite-api/model/models';
import {NzMessageService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {UploadChangeParam } from 'ng-zorro-antd/upload';
import {FilesService} from '@codegen/mtsuite-api/api/files.service';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {TestSuiteRunnerService} from '@codegen/mtsuite-api/api/testSuiteRunner.service';
import {Observable, Observer} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {concatMap} from 'rxjs/operators';

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
  selector: 'app-backlog-integration',
  templateUrl: './backLogIntegration.component.html',
  styleUrls: ['./backLogIntegration.component.scss']
})
export class BackLogIntegrationComponent implements OnInit{

  @Input() module: ModuleDto;
  @Input() testCase: TestCaseDto;
  @Input() testRunner: TestSuiteRunnerDto;
  @Input() credential: BugReporterCredentialDto;
  @Input() lastBug: BugReporterLogDto;
  @Input() projectId: string;

  @Output()
  closeOnClick = new EventEmitter<void>();

  bug: BackLogInputDto = {issueTypeId: null, priorityId: null, projectId: null, summary: ''};
  projects: BugReporterProjectDto[];
  model: BugReporterModelDto = {};
  fileUploadFlag: boolean;
  previewVisible = false;
  previewImage: string | undefined = '';
  fileList: UploadFile[] = [];
  temporaryFiles: TemporaryFile[] = [];
  loadingState = false;


  // LOADERS
  isModelLoading = true;
  isProjectLoading = true;
  firstRender = true;


  constructor(private router: Router,
              private message: NzMessageService,
              private filesService: FilesService,
              private projectService: ProjectService,
              private testSuiteRunnerService: TestSuiteRunnerService,
              private bugReporterService: BugReporterService,) { }

  ngOnInit() {
    this.renderForm();
    this.setInitialValues();
  }


  setInitialValues() {
    this.bug.summary = 'Bug report of test case: ' + this.testCase.name;
    this.bug.description = this.getDescriptionText(this.testCase);
  }
  //
  renderForm() {
    // GET PROJECTS
    this.isProjectLoading = true;

    if (this.firstRender === true) {
      this.setDefaultByLastBug();
      this.firstRender = false;
    }

    this.bugReporterService.getBugReporterProjects(this.credential.id).subscribe( data => {
      this.projects = data;

      if(this.projects.length > 0 ) {
        this.bug.projectId = this.projects[0].id;
        this.getModelByProject();
      }

      this.isProjectLoading = false;

    }, error => {
      this.isProjectLoading = false;
      throw new HttpErrorResponse(error);
    });
  }

  // GET MODEL BY PROJECT
  getModelByProject() {

    if (this.bug == null || this.bug === undefined || this.bug.projectId == null || this.bug.projectId === undefined) {
      return;
    }
    this.isModelLoading = true;

    this.bugReporterService.getBugReporterModels(this.credential.id, this.bug.projectId.toString()).subscribe( data => {
      console.log("NEW MODEL")
      console.log(data);
      this.model = data;
      this.isModelLoading = false;
    }, error => {
      this.isModelLoading = false;
      throw new HttpErrorResponse(error);
    });
  }

  setDefaultByLastBug() {

    console.log('setDefaultByLastBug');
    console.log(this.lastBug);
    // NO last bug
    if (this.lastBug == null || this.lastBug === undefined || this.lastBug.requestBody == null) {
      return;
    }
    const lastBugObj: BackLogInputDto = JSON.parse(this.lastBug.requestBody);

    console.log(lastBugObj);

    this.bug.projectId = lastBugObj.projectId;
    this.bug.priorityId = lastBugObj.priorityId;
    this.bug.milestoneId = lastBugObj.milestoneId;
    this.bug.assigneeId = lastBugObj.assigneeId;
    this.bug.issueTypeId = lastBugObj.issueTypeId;
    this.bug.categoryId = lastBugObj.categoryId;
    this.bug.versionId = lastBugObj.versionId;

    console.log(this.bug);

  }

  // GET MODELS
  getDescriptionText(testCase: TestCaseDto): string {


    let text = '## Precondition:\n' + testCase.precondition===null?testCase.precondition:'## Precondition:\n - \n';
    text += '\n\n## Expected Result:\n' + testCase.expectedResult===null?testCase.expectedResult:'\n\n## Expected Result:\n- \n';
    text += '\n\n## Steps:';

    let stepN = 1;
    testCase.steps.forEach(data => {
      text += '\n' + stepN.toString() + '. ' + data.name;
      stepN++;
    })

    return  text;
  }

  createBugOnClick() {
    this.bug.type = BugReporterInputDtoType.Backlog;
    this.bug.attachmentId = this.getTemporaryFileId();
    this.bugReporterService.createOrUpdateBugReporter(this.credential.id, this.testRunner.id,this.module.uid,this.testCase.uid, this.bug).subscribe(data => {
      this.message
          .loading('Bug report in process...', { nzDuration: 2500 })
          .onClose!.pipe(
          concatMap(() => this.message.success('Bug reported successfully', { nzDuration: 2500 }).onClose!))
          .subscribe(() => {});
      this.closeOnClick.emit();
      this.testRunner = data;
      this.closeDrawer();
      }, error => {
        throw new HttpErrorResponse(error);
      });
  }


  closeDrawer() {
    this.closeOnClick.emit();
  }

  resetReportBugDrawer() {
    this.bug = {issueTypeId: null, priorityId: null, projectId: 0, summary: ''};
  }

  handleUpload = (item: any) => {
    if(item.type === 'removed')
      this.temporaryFiles = this.temporaryFiles.filter( file => file.uid === item.file.uid);
  }


  uploadFile = (item: UploadXHRArgs) => {
    const newFileDto: FileDto = {};

    return getBase64(item.file).then((content) => {
      newFileDto.name =  item.file.name.replace(/ /g, ''),
          newFileDto.content = content.toString();
      this.filesService.uploadFile(Number(this.projectId), newFileDto).subscribe(data => {
        item.onSuccess( data, item.file, item);

        const tempFile: TemporaryFile = {db_id: data.id, uid: item.file.uid};
        this.temporaryFiles.push(tempFile);
      }, error => {
        item.onError!( error, item.file);
        throw new HttpErrorResponse(error);
      });
    }).catch(error => {
      item.onError!( error, item.file);
      throw new HttpErrorResponse(error);
    });
  }


  getTemporaryFileId(): number[] {
     return this.temporaryFiles.map(tmp => tmp.db_id);
  }

  getImagesFromGallery(filesDto: FileDto[]) {
    this.temporaryFiles.filter(file => file.uid === null)
    filesDto.forEach(file =>{
      const tempFile: TemporaryFile = {db_id: file.id, uid: null};
      this.temporaryFiles.push(tempFile);
    });
  }
}

interface TemporaryFile{
  uid: string,
  db_id: number
}
