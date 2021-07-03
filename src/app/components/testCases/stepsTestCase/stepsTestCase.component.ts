import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {StepDto} from '@codegen/mtsuite-api/model/stepDto';

@Component({
  selector: 'app-steps-testcase',
  templateUrl: './stepsTestCase.component.html',
  styleUrls: ['./stepsTestCase.component.scss']
})
export class StepsTestCaseComponent implements OnInit {


  @Input() steps: StepDto[];
  @Output() stepsChange = new EventEmitter<StepDto[]>();

  newStepValue: string;

  constructor() { }

  ngOnInit() {

  }

  drop(event: CdkDragDrop<string[]>, array: any) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);

    console.log(this.steps);
  }

  addStepOnClick() {
    this.steps.push({name: this.newStepValue});
    this.newStepValue = '';
  }

  deleteStepOnClick(item: any) {
    const newStep = this.steps.filter(obj => obj !== item);
    this.stepsChange.emit(newStep);
  }

}
