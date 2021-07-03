import {Component, OnInit, Input, Output} from '@angular/core';
import {TestCaseDto} from '@codegen/mtsuite-api/model/testCaseDto';
import {from} from 'rxjs';

@Component({
  selector: 'app-new-testcase',
  templateUrl: './newTestCase.component.html',
  styleUrls: ['./newTestCase.component.scss']
})
export class NewTestCaseComponent implements OnInit {

  @Input() newTestCaseObj: TestCaseDto;


  showMDprecondition = false;
  showMDexpectedResult = false;

  constructor() { }


  ngOnInit() {

  }

}
