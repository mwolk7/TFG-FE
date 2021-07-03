import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './searchInput.component.html',
  styleUrls: ['./searchInput.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Input() inputModel: string;
  @Output() inputModelChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  clearFilter() {
    this.inputModel = null;
    this.inputModelChange.emit(this.inputModel);
  }

}
