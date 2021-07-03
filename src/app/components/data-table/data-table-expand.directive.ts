import { Directive, HostBinding, HostListener, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DataTableComponent } from './data-table.component';

@Directive({
  selector: '[appDatatableExpanded]'
})
export class DatatableExpandDirective {
  private internalExpand = false;

  constructor(private datatableComponent: DataTableComponent) { }

  @Output()
  appDatatableExpandedChange: EventEmitter<boolean> = new EventEmitter();

  get expanded(): boolean {
    return this.internalExpand;
  }
  @Input('appDatatableExpanded')
  set expanded(value: boolean) {
    this.internalExpand = value;
    this.appDatatableExpandedChange.emit(this.internalExpand);
  }

  @HostListener('click')
  click() {
    this.expand();
  }

  expand() {
    this.expanded = !this.expanded;
    this.datatableComponent.refresh();
  }
}


@Directive({
  selector: '[appDatatableExpandable]'
})
export class DatatableExpandableDirective {
  private internalExpanded = false;

  get expanded(): boolean {
    return this.internalExpanded;
  }
  @Input('appDatatableExpandable')
  set expanded(value: boolean) {
    this.internalExpanded = value;
    this.display = this.internalExpanded ? undefined : 'none';
  }

  @HostBinding('style.display')
  display?: string;
}
