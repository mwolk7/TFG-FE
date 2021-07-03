#\<app-data-table /\>

* **[height]**: this attribute is use to assign table's body height. If there are no data, height will become the placeholder height.
if not set, table won't scroll and wil take its space to contain rows..

* **[table-data]**: this attribute sets the data source fo the purpose of using its 'length' and temporization to recognize data changes,
              and handle correctly placeholder

* **[table-class]**: this attribute sets inner class of table wrapper, can be used to customize layout.
               known supported values:
    * ~~**DEPRECATED** sticky-left: freeze leftmost column to the left~~
    * ~~**DEPRECATED** sticky-right: freeze rightmost column to the right~~
    * hover: colorize rows when mouse hover
    * row-border: adds border to rows
    * cell-border: adds border to cells
    * column-header-border: adds border to column headers
    * stripe: even/odd rows coloring
    * compact: table compacted (cell padding reduced)
    * nowrap: cell won't wrap text (no automatic newlines in cells)
    * pointer: set pointer to the table

* **[loading]**: this attribute is used to show loader indicator

* **[noresult]**: this attribute is used to customize empty data placeholder text content

* **[column-header-border-level]**: changes the column header vertical border level to be displayed (default: 1). In a complex table header, where colspans and rowspans are used, the typical approach is to have a column header with some 'child' column headers in following rows. The level is the row to pilot the border 

  ```
  |---------|-------------------|------------|
  |---------|       L1          |------------|
  |---------|--------+----------|------------|
  |---------|   L2   |    L2    |------------|
  |---------|--------+----------|------------|
  |---------|        |          |------------|
  |---------|--------|----------|------------|
  A         B        C          D            E    
  ```

  If ```column-header-border-level=0``` only **A,E** borders will be visible.
  If ```column-header-border-level=1``` borders **A,E,B,D** will be visible. 
  
  If ```column-header-border-level=2``` borders **A,E,B,C,D** will be visible.

  Borders will be visible only if ```column-header-border``` is added to table classes.

* ~~**DEPRECATED** [table-sort]: method 1 to sort table, this enables native dataTable sorting ability~~

---

##\<th /\>
passing an **inline style** of width: 100% on the last th for the row (in the header), the column is marked to get all available remaining space. 

eg. 
```html
<th style="width: 100%;" >
```

* sort
**[(appDatatableSort)]**: makes the column header responding user clicks and representing sorting information (arrows up/down/none). Binds a variable where to store the sort information. Its double binding feature allows to handle also the 'sortChange' event.

eg.

```html
<th class="dt-left" [(appDatatableSort)]="currentSort" [sortKey]="sortingList[0]"
              (appDatatableSortChange)="sort($event)">{{ 'LISTA_POSIZIONI.ELENCO.DENOMINAZIONE' | translate }}</th>
```

**[class]**
  * **dt-left**: left alighed text in both header and body
  * **dt-right**: right alighed text in both header and body
  * **dt-center**: center alighed text in both header and body
  * **dt-justify**: justify alighed text in both header and body
  * **dt-nowrap**: nowrap alighed text in both header and body

* column visibility
**[(appDatatableColVisible)]**

---

##\<th /\>, \<td /\>

* **[appDatatableStickyLeft]**: mark that column to be sticky left. If passed a value (any css convention), it stays of that distance apart from left 

eg.

```html
<th appDatatableStickyLeft='25px'>
```

* **[appDatatableStickyRight]**: same as appDatatableStickyLeft, but on the opposite side

* expand rows:
  * **[(appDatatableExpanded)]**: triggers the bool value passed (as binding) to toggle between true and false, used to expand another object (tipically another row).
  Its double binding feature allows to handle also the 'sortChange' event.
  * **[appDatatableExpandable]**: uses a bool expression to set the 'display: none' in the declared element

  eg.

  ```html
  <tr>
    <td appDatatableStickyLeft style="text-align: center;">
      <div [(appDatatableExpanded)]="data.expand">
        <i *ngIf="!data.expand" nz-icon nzType="right" style="cursor: pointer;" nzTheme="outline" ></i>
        <i *ngIf="data.expand" nz-icon nzType="down" style="cursor: pointer;" nzTheme="outline" ></i>
      </div>
    </td>
    ...
  </tr>

  <tr [appDatatableExpandable]="data.data.garantiInfo.length > 0 && data.expand">
  ...
  </tr>
  ```

  ----