import { NgModule } from '@angular/core';
import {PageLoaderHover, DelayLoaderDirective, PageMiniLoaderHover} from './page-loader.directive';

@NgModule({
  imports: [],
  declarations: [PageLoaderHover, PageMiniLoaderHover, DelayLoaderDirective],
  exports: [PageLoaderHover, PageMiniLoaderHover, DelayLoaderDirective]
})
export class PageLoaderModule { }
