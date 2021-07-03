import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestCaseDto, TestCaseDtoTestCaseStatus} from '@codegen/mtsuite-api/model/testCaseDto';
import {StepDto} from '@codegen/mtsuite-api/model/stepDto';

@Component({
  selector: 'app-testcases-select-status',
  templateUrl: './testCaseSelectStatus.component.html',
  styleUrls: ['./testCaseSelectStatus.component.scss']
})
export class TestCaseSelectStatusComponent implements OnInit {


  @Input() testCaseStatus: TestCaseDtoTestCaseStatus;
  @Output()
  testCaseStatusChange = new EventEmitter<TestCaseDtoTestCaseStatus>();

  @Input() isClosed: boolean;

  @Output()
  newTestCaseStatus = new EventEmitter<void>();

  buttonType = 'primary';
  buttonText = 'Change status'

  constructor() { }

  ngOnInit() {
    this.changeUi(this.testCaseStatus);
  }

  changeStatusOnClick(status: string) {

    this.changeUi(status);

    this.testCaseStatusChange.emit(this.testCaseStatus);
    this.newTestCaseStatus.emit();
  }

  changeUi(status: string) {
    if ( status === 'Pass') {
      this.testCaseStatus = TestCaseDtoTestCaseStatus.Pass;
      this.buttonType = 'secondary';
      this.buttonText = 'Exito';
    }

    if ( status === 'Fail') {
      this.testCaseStatus = TestCaseDtoTestCaseStatus.Fail;
      this.buttonType = 'danger';
      this.buttonText = 'Fallo';
    }

    if ( status === 'NA') {
      this.testCaseStatus = TestCaseDtoTestCaseStatus.NA;
      this.buttonType = 'danger';
      this.buttonText = 'N/A';
    }

    if ( status === 'CNT') {
      this.testCaseStatus = TestCaseDtoTestCaseStatus.CNT;
      this.buttonType = 'danger';
      this.buttonText = 'N/P';
    }
  }

}
