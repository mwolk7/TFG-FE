import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Utils} from '../../../commons/utils/utils/util-class';

@Component({
  selector: '[app-select-with-shortcut]',
  templateUrl: './select-with-shortcut.component.html',
  styleUrls: ['./select-with-shortcut.component.scss']
})
export class SelectWithShortcutComponent implements OnInit {

  @Input() titleCode: string
  @Input() items: CodeDescritionPair[]

  @Input() shortcuts: Shortcut[] = []

  @Input() isBigTitle: boolean

  @Output() selectedItemsChange: EventEmitter<any>

  _selectedItems: string[]
  @Input()
  get selectedItems(): string[]  {
    return this._selectedItems
  }
  set selectedItems(items: string[]) {
    this._selectedItems = items
  }

  constructor() {
    this.selectedItemsChange = new EventEmitter()
   }

  ngOnInit() {
  }

  shortcutSelected(values: string[]){
      this.selectedItems = values
      console.log(values)
      this.selectedItemsChange.emit(this.selectedItems)
  }

  exist(a: any, b: any): boolean {
    return !Utils.deepEquals(a.sort(), b.sort())
  }

  change(event) {
    console.log("change")
    console.log(event)
    this.selectedItemsChange.emit(event)
  }

}

export interface CodeDescritionPair {
  code: string;
  description: string;
}

export interface Shortcut{
  titleCode: string
  selectedItems: string[]
}
