import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestSuiteRunnerDto, TestSuiteRunnerDtoStatus} from '@codegen/mtsuite-api/model/testSuiteRunnerDto';

@Component({
  selector: 'app-testcases-status-tag',
  templateUrl: './statusTag.component.html',
  styleUrls: ['./statusTag.component.scss']
})
export class StatusTagComponent implements OnInit {


  @Input() status: TestSuiteRunnerDtoStatus;

  constructor() { }

  ngOnInit() {

  }
}
