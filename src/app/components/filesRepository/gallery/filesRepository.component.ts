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
  ProjectDto, ResponseEntityObject,
  TestSuiteRunnerDto
} from '@codegen/mtsuite-api/model/models';
import {NzConfigService, NzDrawerRef, NzMessageService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {UploadChangeParam } from 'ng-zorro-antd/upload';
import {FilesService} from '@codegen/mtsuite-api/api/files.service';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {TestSuiteRunnerService} from '@codegen/mtsuite-api/api/testSuiteRunner.service';
import {Observable, Observer} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {concatMap} from 'rxjs/operators';
import {TestSuiteRunnerStatisticsDto} from '@codegen/mtsuite-api/model/testSuiteRunnerStatisticsDto';

@Component({
  selector: 'app-files-repository-integration',
  templateUrl: './filesRepository.component.html',
  styleUrls: ['./filesRepository.component.scss']
})
export class FilesRepositoryDrawerComponent implements OnInit {

  @Input() projectId: string;
  @Input() getData: Function;

  selectedFileList: FileDto[] = [];

  fileList: FileDto[] = [];
  apiKey: string;

  apiBasePath: string = environment.apiUrl;

  loading: boolean = true;

  constructor(private router: Router,
              private message: NzMessageService,
              private filesService: FilesService,
              private projectService: ProjectService,
              private drawerRef: NzDrawerRef<string>,)
  {
  }

  ngOnInit() {
    this.getApiKey();
  }


  fetchFilesByProject(){
    this.filesService.getFileEntityByProject(Number(this.projectId),0,20).subscribe(data =>{
      this.fileList = data.data;
      this.loading = false;
    },error => {
      throw new HttpErrorResponse(error);
    })
  }

  getApiKey(){
    this.filesService.getFileTokenAccess(Number(this.projectId),false).subscribe(data =>{
      this.apiKey = data.token;
      this.fetchFilesByProject();
    },error => {
      throw new HttpErrorResponse(error);
    })
  }

  removeFile(file: FileDto) {
    this.filesService.deleteFile(file.id).subscribe(data => {
      this.message.create('success', 'Image removed successfully');
      this.fetchFilesByProject();
    }, error => {
      throw new HttpErrorResponse(error);
    });
  }

  toggleCheck = ($event, item) => {
    if(this.isChecked(item)){
      this.selectedFileList = this.selectedFileList.filter((obj) => item.id !== obj.id);
    } else {
      this.selectedFileList.push(item);
    }
  }

  isChecked = (item) => {
    return this.selectedFileList.filter((obj) => item.id === obj.id).length > 0;
  }

  selectFilesOnClick() {
    this.getData(this.selectedFileList)
    this.drawerRef.close('Closed')
  }

  getFilteredImages() {
    return this.fileList.filter(x => x.showInGallery === null || x.showInGallery)
  }

  deleteFilesOnClick() {
    this.selectedFileList.forEach(file => {
      this.filesService.deleteFile(file.id).subscribe(data => {
        if (data.code === '200') {
          this.message.create('success', 'Image ' + file.name.slice(0, 7) + '... removed successfully');
          this.fetchFilesByProject();
        }
      })
    })
  }

  close(): void {
    this.drawerRef.close('Closed')
  }


}

