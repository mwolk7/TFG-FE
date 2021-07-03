import { Directive, HostBinding, HostListener, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDatatableSort]'
})
export class DatatableSortDirective {
  private internalSortType: SortType = { direction: 'None' };

  constructor() { }

  @Output()
  appDatatableSortChange: EventEmitter<SortType> = new EventEmitter();

  @HostBinding('class.sorting')
  internalClassNone = true;
  @HostBinding('class.sorting_asc')
  internalClassAsc = false;
  @HostBinding('class.sorting_desc')
  internalClassDesc = false;

  get sortKey(): string | undefined {
    return this.internalSortType.key;
  }
  @Input()
  set sortKey(value: string | undefined) {
    this.internalSortType.key = value;
  }

  @Input('appDatatableSort')
  set sort(value: SortType) {
    if (value && value.key === this.sortKey) {
      this.internalSortType = value;
    } else if (value) {
      this.internalSortType = { direction: 'None', key: this.internalSortType.key };
    }
    this.sortToClass(this.internalSortType);
  }
  get sort(): SortType {
    return this.internalSortType;
  }

  @HostListener('click', ['$event.target'])
  onClick(evt: any) {
    this.internalSortType = this.toggleSort(this.internalSortType);
    this.sortToClass(this.internalSortType);
    this.appDatatableSortChange.emit(this.internalSortType);
  }

  private sortToClass(sort: SortType) {
    this.internalClassNone = 'None' === sort.direction;
    this.internalClassAsc = 'Asc' === sort.direction;
    this.internalClassDesc = 'Desc' === sort.direction;
  }

  private toggleSort(sort: SortType): SortType {
    switch (sort.direction) {
      case 'None': return { direction: 'Asc', key: sort.key };
      case 'Asc': return { direction: 'Desc', key: sort.key };
      case 'Desc': return { direction: 'None', key: sort.key };
    }
  }
}

export type SortDirection = 'None' | 'Asc' | 'Desc';

export const SortDirection = {
  None: 'None' as SortDirection,
  Asc: 'Asc' as SortDirection,
  Desc: 'Desc' as SortDirection
};

export interface SortType {
  direction: SortDirection;
  key?: string;
}
