import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestCaseDtoPriority} from '@codegen/mtsuite-api/model/testCaseDto';

@Component({
  selector: 'app-priority-viewer',
  templateUrl: './priorityViewer.component.html',
  styleUrls: ['./priorityViewer.component.scss']
})
export class PriorityViewerComponent implements OnInit {


  @Input() priority: TestCaseDtoPriority;

  constructor() { }

  ngOnInit() {

  }
}
