import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ModuleDto} from '@codegen/mtsuite-api/model/moduleDto';
import {TestCaseDtoPriority} from '@codegen/mtsuite-api/model/testCaseDto';

@Component({
  selector: 'app-select-testcase',
  templateUrl: './selectTestCase.component.html',
  styleUrls: ['./selectTestCase.component.scss']
})
export class SelectTestCaseComponent implements OnInit , OnChanges {

  @Input() module: ModuleDto;
  @Input() priorityFilter: TestCaseDtoPriority[];
  @Input() selectAllFlag: boolean;

  constructor() { }

  allChecked = false;
  indeterminate = true;

  testCaseSelected = 0;

  ngOnInit() {
    this.updateSingleChecked();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSingleChecked()
  }

  updateAllChecked(): void {
    this.allChecked = this.selectAllFlag;
    this.indeterminate = false;
    if (this.allChecked) {
      this.module.testCases = this.module.testCases.map(item => {
        return {
          ...item,
          run: true
        };
      });
    } else {
      this.module.testCases = this.module.testCases.map(item => {
        return {
          ...item,
          run: false
        };
      });
    }

    this.countChecked();
  }

  updateSingleChecked(): void {

    if (this.module.testCases.every(item => !item.run)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.module.testCases.every(item => item.run)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }

    this.countChecked();
  }

  private countChecked() {
    this.testCaseSelected = 0;
    this.module.testCases.forEach(testCase => {
      if(testCase.run) {
        this.testCaseSelected++;
      }
    });
  }

}
