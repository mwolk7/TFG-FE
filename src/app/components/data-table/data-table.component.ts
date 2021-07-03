import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation, OnDestroy, AfterViewInit, ViewChildren, QueryList, AfterViewChecked, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, interval, merge, Subscription } from 'rxjs';
import { share, delay, first } from 'rxjs/operators';
import { debounce, throttle } from 'rxjs/internal/operators';
import { EventManager, DomSanitizer } from '@angular/platform-browser';

interface ColgroupNode {
  row: number;
  col: number;
  size: number;
  vsize: number;
  children: ColgroupNode[];
  visible: boolean;
  realCol: number;
  el: HTMLTableCellElement;
  leftborder: boolean;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private static readonly defaultClasses = 'data-table';
  private static readonly defaultBottomThreshold = 30;
  private static readonly defaultRightThreshold = 10;

  private static readonly colspanAttribute = 't-orig-colspan';
  private static readonly scrollLeftClass = 'scroll-left';
  private static readonly scrollRightClass = 'scroll-right';
  private static readonly borderLeftClass = 't-header-left-border';

  @ViewChild('datatable', { static: true }) datatableElement: ElementRef;
  @ViewChild('datatablewrapper', { static: true }) dataTableWrapper: ElementRef;

  dtHeight: string | undefined;
  dtClasses: string;

  private dtOptions: DataTables.Settings = { drawCallback: () => this.onDraw(),
    scrollX: true, paging: false, searching: false, info: false, scrollCollapse: true, ordering: false, autoWidth: true };
  private dtTriggerInternal: Subject<boolean>;
  private dtTrigger: Observable<boolean>;
  private dtCreatingPromise: Promise<DataTables.Api>;
  private dt: DataTables.Api;
  private tableData?: any[];
  private internalHeight?: string;
  private classes?: string = DataTableComponent.defaultClasses;
  private scroll$: Subject<any>;
  private resize$: Subject<any>;
  private scroll$Classes?: string;
  private scroll$BodySubscription?: () => void;
  private resize$DocumentSubscription?: () => void;
  private isLeft = false;
  private isRight = false;
  private isBottom = false;
  private internalHiddenRequests: Set<string> = new Set();
  private internalColumnBorderLevel = 1;

  @Input()
  loading = false;
  @Input()
  noresult = 'No results found';
  @Input()
  noresultImage?: string;
  @Output()
  scrolledToBottomChange = new EventEmitter<boolean>();

  get scrolledBottom(): boolean {
    return this.isBottom;
  }

  // TODO: this can be improved like ngClass, ...
  @Input('table-class')
  set clazz(value: string) {
    this.classes = value;
    this.updateClasses();
  }
  get clazz(): string {
    return this.classes;
  }

  @Input('column-header-border-level')
  set headerBorderLevel(value: number) {
    this.internalColumnBorderLevel = value;
    this.dtTriggerInternal.next(false);
  }
  get headerBorderLevel(): number {
    return this.internalColumnBorderLevel;
  }

  @Input()
  set height(value: string) {
    this.internalHeight = value;
    this.dtHeight = value;
    this.dtOptions.scrollY = value;
    this.dtTriggerInternal.next(false);
  }
  get height(): string {
    return this.internalHeight;
  }

  @Input('table-data')
  set data(value: any[]) {
    this.tableData = value;
    this.dtTriggerInternal.next(false);
  }
  get data(): any[] {
    return this.tableData;
  }

  constructor(private eventManager: EventManager, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {
    this.dtTriggerInternal = new Subject();
    this.dtTrigger = this.dtTriggerInternal.pipe(debounce(() => interval(40))).pipe(share());
    this.scroll$ = new Subject();
    this.resize$ = new Subject();

    this.dtTrigger.subscribe((arg) => this.lazyDataTable(arg));
    this.dtTrigger.subscribe(() => this.resetTempHeight());
    merge(this.scroll$, this.resize$
      .pipe(debounce(() => interval(100)))).subscribe(evt => this.onScroll(evt.left, evt.right, evt.top, evt.bottom));
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dtTriggerInternal.next(false);
  }

  ngAfterViewChecked() {
  }

  ngOnDestroy(): void {
    if (this.scroll$BodySubscription) {
      this.scroll$BodySubscription();
      this.scroll$BodySubscription = undefined;
    }
    if (this.resize$DocumentSubscription) {
      this.resize$DocumentSubscription();
      this.resize$DocumentSubscription = undefined;
    }
    this.scroll$.unsubscribe();
    this.resize$.unsubscribe();
    this.dtTriggerInternal.unsubscribe();
    if (this.dt) {
      this.dt.destroy(true);
    }
  }

  @Input()
  set triggerRefresh(value: any) {
    this.dtTriggerInternal.next(false);
  }

  refresh() {
    this.dtTriggerInternal.next(false);
  }

  setHeaderVisibility(row: number, col: number, visible: boolean) {
    if (visible) {
      this.internalHiddenRequests.delete(JSON.stringify([row, col]));
    } else {
      this.internalHiddenRequests.add(JSON.stringify([row, col]));
    }
    this.dtTriggerInternal.next(false);
  }

  private onDraw() {
    this.rebindEvents();
  }

  private onScroll(left: number, right: number, top: number, bottom: number) {
    const newBottom = bottom <= DataTableComponent.defaultBottomThreshold && top > 0;
    if (newBottom !== this.isBottom) {
      this.isBottom = newBottom;
      this.scrolledToBottomChange.next(this.isBottom);
    }

    const newLeft = left <= 0;
    const newRight = right < DataTableComponent.defaultRightThreshold;

    if (this.isLeft === newLeft && this.isRight === newRight) { return ; }
    this.isLeft = newLeft;
    this.isRight = newRight;

    this.scroll$Classes = [(this.isLeft ? '' : DataTableComponent.scrollLeftClass),
                           (this.isRight ? '' : DataTableComponent.scrollRightClass)].join(' ');
    this.updateClasses();
  }

  private updateClasses() {
    this.dtClasses = `${DataTableComponent.defaultClasses} ${this.classes} ${this.scroll$Classes}`;
    this.cdr.markForCheck();
  }

  private resetTempHeight() {
    if (this.dtHeight) {
      this.dtHeight = undefined;
      this.cdr.markForCheck();
    }
  }

  private rebindEvents() {
    if (this.scroll$BodySubscription) {
      this.scroll$BodySubscription();
      this.scroll$BodySubscription = undefined;
    }

    if (this.resize$DocumentSubscription) {
      this.resize$DocumentSubscription();
      this.resize$DocumentSubscription = undefined;
    }

    const elem = this.findElem();
    if (!elem) { return; }
    this.handleElem(elem, false);

    this.scroll$BodySubscription = this.eventManager.addEventListener(elem, 'scroll', () => {
      this.handleElem(elem, false);
    }) as (() => void);

    this.resize$DocumentSubscription = this.eventManager.addGlobalEventListener('window', 'resize', () => {
      this.handleElem(elem, true);
    }) as (() => void);
  }

  private handleElem(elem: any, isResize: boolean) {
    const maxLeft = elem.scrollWidth - elem.clientWidth;
    const maxTop = elem.scrollHeight - elem.clientHeight;
    const evt = { left: elem.scrollLeft, right: maxLeft - elem.scrollLeft, top: elem.scrollTop, bottom: maxTop - elem.scrollTop };
    if (!isResize) {
      this.scroll$.next(evt);
    } else {
      this.resize$.next(evt);
    }
  }

  private findElem(): any {
    const elem = this.dataTableWrapper && this.dataTableWrapper.nativeElement &&
                  this.dataTableWrapper.nativeElement.querySelector('.dataTables_scrollBody');
    return elem;
  }

  private lazyDataTable(recreate: boolean): Promise<DataTables.Api> {
    if (this.dtCreatingPromise) {
      return this.dtCreatingPromise;
    }

    if (this.dt && !recreate) {
      // NOTE: patch, to be fixed because always resets table horizontal scroll to 0
      this.applyHiddenColumns();
      this.dt.columns.adjust();
      //this.dt['context'][0].oInstance._fnAdjustColumnSizing();
      this.handleElem(this.findElem(), false);
      // window.dispatchEvent(new Event('resize'));
      return Promise.resolve(this.dt);
    }

    this.dtCreatingPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // NOTE this does not work
        // if (this.dt) {
        //   this.dt.destroy();
        // }
        this.dt = $(this.datatableElement.nativeElement).DataTable(this.dtOptions);
        this.dtCreatingPromise = undefined;
        this.applyHiddenColumns();
        this.dt.columns.adjust();
        resolve(this.dt);
      });
    });
  }

  private applyHiddenColumns() {
    if (!this.dt) {
      return;
    }

    const scrollHead = this.dataTableWrapper.nativeElement.querySelector('.dataTables_scrollHead').querySelector('table');
    const scrollBody = this.dataTableWrapper.nativeElement.querySelector('.dataTables_scrollBody').querySelector('table');
    const colgroups = this.readColgroups(scrollHead, new Set(this.internalHiddenRequests));
    const [hiddencols, leftborders] = this.extractBodyVisibilityAndBorders(colgroups);

    this.setVisibilityForTable(scrollHead, colgroups, hiddencols, leftborders);
    this.setVisibilityForTable(scrollBody, colgroups, hiddencols, leftborders);
  }

  private setVisibilityForTable(root: HTMLTableElement, colgroups: ColgroupNode[][], hidden: Set<number>, leftborders: Set<number>) {
    // apply visibility for header
    colgroups.forEach((row, idx) => {
      row.forEach(col => {
        const colspan = this.getVirtualColspan(col);
        const hid = colspan < 1;
        col.el.colSpan = colspan;
        this.toggleStyle(col.el, 'display', hid ? 'none' : '');
        this.toggleClass(col.el, DataTableComponent.borderLeftClass, !hid && col.leftborder);
      });
    });

    // apply visibility for body
    for (let b = 0; b < root.tBodies.length; b++ ) {
      const body = root.tBodies[b];
      for (let i = 0; i < body.rows.length; i++) {
        let ofs = 0;
        const row = body.rows[i];
        for (let j = 0; j < row.cells.length; j++) {
          const hid = hidden.has(ofs);
          const brd = leftborders.has(ofs);
          this.toggleStyle(row.cells[j], 'display', hid ? 'none' : '');
          this.toggleClass(row.cells[j], DataTableComponent.borderLeftClass, !hid && brd);
          ofs += row.cells[j].colSpan;
        }
      }
    }
  }

  // NOTE: can be called only after building the tree
  private getVirtualColspan(colgroup: ColgroupNode): number {
    const res = !colgroup.visible ? 0 :
      (colgroup.children && colgroup.children.length) ? colgroup.children.filter(x => !this.isVirtualHidden(x)).length : 1;

    return res;
  }

  // NOTE: can be called only after building the tree
  private isVirtualHidden(colgroup: ColgroupNode): boolean {
    const res = !colgroup.visible ? true :
      (colgroup.children && colgroup.children.length) ? colgroup.children.findIndex(x => !this.isVirtualHidden(x)) < 0 : false;

    return res;
  }

  private toggleStyle(el: HTMLElement, styleName: string, should?: any) {
    const is = el.style[styleName] === should;
    if (should !== is) {
      el.style[styleName] = should;
    }
  }

  private toggleClass(el: HTMLElement, className: string, shouldContain: boolean) {
    const contains = el.classList.contains(className);
    if (shouldContain && !contains) {
      el.classList.add(className);
    } else if (!shouldContain && contains) {
      el.classList.remove(className);
    }
  }

  private extractBodyVisibilityAndBorders(colgroups: ColgroupNode[][]): [Set<number>, Set<number>] {
    const hids = new Set<number>();
    const borders = new Set<number>();
    // NOTE: also here, stupid approach not optimised, but it should work also for complex scenarios
    colgroups.forEach(row => {
      row.forEach(col => {
        if (!col.visible) {
          hids.add(col.realCol);
        }
        if (col.leftborder) {
          borders.add(col.realCol);
        }
      });
    });
    return [hids, borders];
  }

  private readColgroups(root: HTMLTableElement, hiddenRequests: Set<string>) {
    const rows: ColgroupNode[][] = [];
    for (let r = 0; r < root.rows.length; r++) {
      const row = root.rows[r];
      const cols: ColgroupNode[] = [];
      for (let c = 0; c < row.cells.length; c++) {
        const cell = row.cells[c];
        // NOTE: add custom attribute to remember original colspan
        const orgColspan = cell.getAttribute(DataTableComponent.colspanAttribute);
        const orgColspanNum: number | undefined = orgColspan ? +orgColspan : undefined;
        if (!orgColspanNum) {
          cell.setAttribute(DataTableComponent.colspanAttribute, cell.colSpan.toString());
        }
        cols.push({
          row: r,
          col: c,
          realCol: c,
          size: orgColspan ? orgColspanNum : cell.colSpan,
          vsize: cell.rowSpan,
          visible: !hiddenRequests.has(JSON.stringify([r, c])),
          children: [],
          el: cell,
          leftborder: r + 1 <= this.internalColumnBorderLevel
        });
      }
      const firstVisible = cols.find(x => x.visible);
      if (firstVisible) {
        firstVisible.leftborder = false;
      }
      rows.push(cols);
    }

    // NOTE: not efficient, but it understands also complex scenarios
    for (let r = 0; r < rows.length - 1; r++) { // NODE last row cannot have children!
      const row = rows[r];

      row.forEach(current => {
        // adjust offset for realCol, from vsize (rowspan)
        for (let i = 0; i < current.vsize; i++) {
          rows[r + i]
            .filter(x =>
              x.row === current.row ?
                x.col > current.col :
                x.realCol >= current.realCol)
            .forEach(x =>
              x.row === current.row ?
                x.realCol = x.realCol + current.size - 1 :
                x.realCol = x.realCol + current.size
            );
        }

        // find children, apply visibility to them
        current.children = rows[r + 1]
          .filter(x =>
            x.realCol >= current.realCol &&
            x.realCol < current.realCol + current.size &&
            x.realCol + x.size <= current.realCol + current.size
          ).map(x => {
            x.visible = x.visible && current.visible;
            return x;
          });

        const firstVisible = current.children.find(x => x.visible);
        if (firstVisible) {
          firstVisible.leftborder = firstVisible.leftborder || current.leftborder;
        }
      });
    }

    return rows;
  }
}
