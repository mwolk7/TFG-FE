import { YesOrNoPipe } from './../commons/pipes/yesOrNot.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TopMenuComponent } from './menus/topMenu/topMenu.component';
import { CapitalizerPipe } from '../commons/pipes/capitalizer.pipe';
import { EnablingPipe } from '../commons/pipes/enabling.pipe';
import { EscapeHtmlPipe } from '../commons/pipes/escape-html.pipe';
import { MaxLengthPipe } from '../commons/pipes/max-length-pipe';
import { OptionalDivide100Pipe, OptionalValuePipe } from '../commons/pipes/optional-value.pipe';
import { DecimalFormatPipe } from '../commons/pipes/decimal-format.pipe';
import { IntegerFormatPipe } from '../commons/pipes/integer-format.pipe';
import { ShortDateFormatPipe } from '../commons/pipes/short-date-format.pipe';
import { MediumDateFormatPipe } from '../commons/pipes/medium-date-format.pipe';
import { RouterModule } from '@angular/router';
import { BigSeparatorComponent } from './separators/bigSeparator/bigSeparator.component';
import { MediumSeparatorComponent } from './separators/mediumSeparator/mediumSeparator.component';
import { PageLoaderModule } from '../commons/page-loader/page-loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShortDateAndTimeFormatPipe } from '../commons/pipes/short-date-and-time-format.pipe';
import { EnumConverterPipe } from '../commons/pipes/enum-converter.pipe';
import { SelectWithShortcutComponent } from './selects/select-with-shortcut/select-with-shortcut.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DataTablesModule } from 'angular-datatables';
import { NgZorroNoTableAntdModule } from '../modules/ng-zorro-no-table.module';
import { DatatableSortDirective } from './data-table/data-table-sort.directive';
import { FilterTablePipe } from '../commons/pipes/filter-table.pipe';
import { TestCaseFilterPipe} from '../commons/pipes/testCaseFilter.pipe';
import { DatatableExpandDirective, DatatableExpandableDirective } from './data-table/data-table-expand.directive';
import { DatatableStickyRightDirective, DatatableStickyLeftDirective } from './data-table/data-table-sticky.directive';
import { DatatableColVisibileDirective } from './data-table/data-table-col-visible.directive';
import { SecUnsecPipe } from '../commons/pipes/secUnsec.pipe';
import { EnvCheckPipe } from '../commons/pipes/environment-check.pipe';

import { TruncateStringPipe } from '../commons/pipes/truncate-string.pipe';
import {SmallSeparatorComponent} from './separators/smallSeparator/smallSeparator.component';
import {LeftMenuComponent} from './menus/leftMenu/leftMenu.component';
import {HotKeyMenuComponent} from './menus/hotKeyMenu/hotKeyMenu.component';
import {SectionContainerComponent} from './containers/sectionContainer/sectionContainer.component';
import {NewTestCaseComponent} from './testCases/newTestCase/newTestCase.component';
import {StepsTestCaseComponent} from './testCases/stepsTestCase/stepsTestCase.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ClickStopPropagationDirective} from '../commons/utils/click-stopPropagation';
import {SearchInputComponent} from './forms/searchInput/searchInput.component';
import {TestSuiteComponent} from './rowComponents/testSuite/testSuite.component';
import {ProyectComponent} from './rowComponents/proyect/proyect.component';
import {DateAgoPipe} from '../commons/pipes/date-ago-pipe';
import {SelectTestCaseComponent} from './testCases/selectTestCase/selectTestCase.component';
import {ResolveTestCaseComponent} from './testCases/resolveTestCase/resolveTestCase.component';
import {UserComponent} from './rowComponents/user/user.component';
import {BaseIntegrationComponent} from './integrations/baseIntegration/baseIntegration.component';
import {BackLogIntegrationComponent} from './integrations/backLogIntegration/backLogIntegration.component';
import {TwoCharactersPipe} from '../commons/pipes/twoCharacters.pipe';
import {PriorityViewerComponent} from './testCases/priorityViewer/priorityViewer.component';
import {PriorityDotComponent} from './testCases/priorityDot/priorityDot.component';
import {StatusTagComponent} from './testCases/statusTag/statusTag.component';
import {TestCaseSelectStatusComponent} from './testCases/testCaseSelectStatus/testCaseSelectStatus.component';
import {NewProjectComponent} from './projects/newProject/newProject.component';
import {NgxMdModule} from 'ngx-md';
import {NewProjectVerComponent} from './projects/newProjectVersion/newProjectVersion.component';
import {MarkDownAreaComponent} from './markdown/markDownArea/markDownArea.component';
import {LoaderContainerComponent} from './containers/loaderContainer/loaderContainer.component';
import {NewBackLogIntegrationComponent} from './integrations/newBackLogIntegration/newBackLogIntegration.component';
import {NewUserProjectComponent} from './projects/newUserProject/newUserProject.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import {FilesRepositoryDrawerComponent} from "./filesRepository/gallery/filesRepository.component";
import {FilesSelectorComponent} from "./filesRepository/filesSelector.component";

const shared = [
  TopMenuComponent,
  LeftMenuComponent,
  SectionContainerComponent,
  HotKeyMenuComponent,
  CapitalizerPipe,
  EnablingPipe,
  EscapeHtmlPipe,
  IntegerFormatPipe,
  EnumConverterPipe,
  DecimalFormatPipe,
  ShortDateFormatPipe,
  TruncateStringPipe,
  ShortDateAndTimeFormatPipe,
  YesOrNoPipe,
  SecUnsecPipe,
  MediumDateFormatPipe,
  MaxLengthPipe,
  OptionalValuePipe,
  OptionalDivide100Pipe,
  FilterTablePipe,
  TestCaseFilterPipe,
  EnvCheckPipe,
  TwoCharactersPipe,
  BigSeparatorComponent,
  MediumSeparatorComponent,
  SmallSeparatorComponent,
  SelectWithShortcutComponent,
  DataTableComponent,
  DatatableSortDirective,
  DatatableExpandDirective,
  DatatableExpandableDirective,
  DatatableStickyLeftDirective,
  DatatableStickyRightDirective,
  DatatableColVisibileDirective,
  ClickStopPropagationDirective,
  NewTestCaseComponent,
  StepsTestCaseComponent,
  SearchInputComponent,
  TestSuiteComponent,
  ProyectComponent,
  DateAgoPipe,
  SelectTestCaseComponent,
  ResolveTestCaseComponent,
  UserComponent,
  BaseIntegrationComponent,
  BackLogIntegrationComponent,
  PriorityViewerComponent,
  PriorityDotComponent,
  StatusTagComponent,
  TestCaseSelectStatusComponent,
  NewProjectComponent,
  NewProjectVerComponent,
  MarkDownAreaComponent,
  LoaderContainerComponent,
  NewBackLogIntegrationComponent,
  NewUserProjectComponent,
  TimeAgoPipe,
  FilesRepositoryDrawerComponent,
  FilesSelectorComponent
];


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        CommonModule,
        RouterModule,
        NzIconModule,
        NgZorroNoTableAntdModule,
        NzButtonModule,
        // NzTableModule,
        TranslateModule,
        PageLoaderModule,
        DragDropModule,
        NgxMdModule
    ],
  declarations: [
    ...shared,
  ],
  exports: [
    ...shared,
    NgZorroNoTableAntdModule,
    TranslateModule,
    PageLoaderModule
  ],
  entryComponents: [
    FilesRepositoryDrawerComponent,
    BaseIntegrationComponent
  ]
})
export class ComponentsModule { }
