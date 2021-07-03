import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestSuiteDto} from '@codegen/mtsuite-api/model/testSuiteDto';

@Component({
  selector: 'app-priority-dot',
  templateUrl: './priorityDot.component.html',
  styleUrls: ['./priorityDot.component.scss']
})
export class PriorityDotComponent implements OnInit {


  @Input() testSuite: TestSuiteDto;

  constructor() { }

  ngOnInit() {

  }
}
