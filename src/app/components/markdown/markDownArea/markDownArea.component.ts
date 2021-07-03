import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TestCaseDtoTestCaseStatus} from '@codegen/mtsuite-api/model/testCaseDto';


@Component({
  selector: 'app-markdown-area',
  templateUrl: './markDownArea.component.html',
  styleUrls: ['./markDownArea.component.scss']
})
export class MarkDownAreaComponent implements OnInit {

  @Input() text: string;
  @Output()
  textChange = new EventEmitter<string>();

  @Input() rows: number;

  showMarkDown = false

  constructor() { }

  ngOnInit() {
  }

  textChangeEvent() {
    this.textChange.emit(this.text);
  }

}
