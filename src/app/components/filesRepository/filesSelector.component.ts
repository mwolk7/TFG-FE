import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FileDto} from '@codegen/mtsuite-api/model/models';
import {NzDrawerService, NzMessageService} from 'ng-zorro-antd';
import {FilesService} from '@codegen/mtsuite-api/api/files.service';
import {ProjectService} from '@codegen/mtsuite-api/api/project.service';
import {BaseIntegrationComponent} from "../integrations/baseIntegration/baseIntegration.component";
import {ModuleDto} from "@codegen/mtsuite-api/model/moduleDto";
import {TestCaseDto} from "@codegen/mtsuite-api/model/testCaseDto";
import {TestSuiteRunnerDto} from "@codegen/mtsuite-api/model/testSuiteRunnerDto";
import {FilesRepositoryDrawerComponent} from "./gallery/filesRepository.component";

@Component({
  selector: 'app-files-selector-integration',
  templateUrl: './filesSelector.component.html',
  styleUrls: ['./filesSelector.component.scss']
})
export class FilesSelectorComponent implements OnInit {

  @Input() projectId: string;

  @Output()
  sendImages = new EventEmitter<FileDto[]>();

  selectedFileList: FileDto[] = [];

  constructor(private router: Router,
              private message: NzMessageService,
              private filesService: FilesService,
              private projectService: ProjectService,
              private drawerService: NzDrawerService) {
  }

  ngOnInit() {
  }

  getData(data){
    this.selectedFileList = data;
    this.sendImages.emit(data);
  }

  openGalleryDrawer(): void {
    const drawerRef = this.drawerService.create<FilesRepositoryDrawerComponent, {projectId: string, getData: Function }, string>({
      nzTitle: 'Report Bug',
      nzContent: FilesRepositoryDrawerComponent,
      nzBodyStyle: { height: 'calc(100% - 55px)', overflow: 'auto', padding: '0px'},
      nzWidth: 720,
      nzMaskClosable: false,
      nzMask: false,
      nzContentParams: {
        projectId: this.projectId,
        getData: this.getData.bind(this)
      }
    });
  }

  handleUpload = (item: any) => {
    console.log("B", this.selectedFileList)
    console.log("A",item)
    if(item.type === 'removed') {
      this.selectedFileList = this.selectedFileList.filter(file => file.id !== item.file.id);
      this.sendImages.emit(this.selectedFileList);
    }
  }

}

