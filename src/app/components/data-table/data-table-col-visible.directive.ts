import { Directive, HostBinding, HostListener, OnInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { DataTableComponent } from './data-table.component';

@Directive({
  selector: 'th:[appDatatableColVisible]'
})
export class DatatableColVisibileDirective implements OnInit {
  private internalVisible: boolean;

  constructor(private el: ElementRef, private datatableComponent: DataTableComponent) { }

  get visible(): boolean {
    return this.internalVisible;
  }
  @Input('appDatatableColVisible')
  set visible(value: boolean) {
    this.internalVisible = value;
    this.updateVisibility();
  }

  ngOnInit() {
    this.updateVisibility();
  }

  private updateVisibility() {
    const [col, row] = this.indexFromParent(this.el.nativeElement);
    this.datatableComponent.setHeaderVisibility(row, col, this.internalVisible);
  }

  private indexFromParent(r: HTMLTableCellElement): [number, number] {
    if (!r.parentElement) {
      return [0, 0];
    }
    return [r.cellIndex, (r.parentElement as HTMLTableRowElement).rowIndex];
  }
}
