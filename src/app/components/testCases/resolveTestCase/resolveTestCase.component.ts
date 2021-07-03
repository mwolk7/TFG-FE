import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModuleDto} from '@codegen/mtsuite-api/model/moduleDto';
import {TestCaseDto, TestCaseDtoPriority, TestCaseDtoTestCaseStatus} from '@codegen/mtsuite-api/model/testCaseDto';

@Component({
  selector: 'app-resolve-testcase',
  templateUrl: './resolveTestCase.component.html',
  styleUrls: ['./resolveTestCase.component.scss']
})
export class ResolveTestCaseComponent implements OnInit {

  @Input() module: ModuleDto;
  @Input() isClosed: boolean;
  @Input() totalTestCases: number;
  @Output()
  newBug = new EventEmitter<TestCaseDto>();

  @Output()
  newTestCaseStatus = new EventEmitter<void>();

  // statics
  doneTestCases = 0;
  criticalTestCases = 0;
  highTestCases = 0;
  mediumTestCases = 0;
  lowTestCases = 0;


  constructor() { }

  ngOnInit() {
    this.setStatics();
  }

  setStatics() {

    this.criticalTestCases = 0;
    this.highTestCases = 0;
    this.mediumTestCases = 0;
    this.lowTestCases = 0;

    if (this.module.testCases == null) {
      return;
    }

    this.module.testCases.forEach( testCase => {

      if (testCase.testCaseStatus != null && testCase.testCaseStatus !== TestCaseDtoTestCaseStatus.Pending) {
        this.doneTestCases++;
      }

      if (testCase.priority === null) {
        return;
      }

      switch (testCase.priority) {
        case TestCaseDtoPriority.Critical:
          this.criticalTestCases++;
          break;
        case TestCaseDtoPriority.High:
          this.highTestCases++;
          break;
        case TestCaseDtoPriority.Low:
          this.lowTestCases++;
          break;
        case TestCaseDtoPriority.Medium:
          this.mediumTestCases++;
          break;
        default:
      }
    });
  }

  changeStatusOnClick() {
    this.newTestCaseStatus.emit();
  }

  newBugOnClick(testCase: TestCaseDto) {
    this.newBug.emit(testCase);
  }

}
