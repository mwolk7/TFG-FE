import {Directive, EventEmitter, Host, Input, Output, Self, ElementRef, TemplateRef, ViewContainerRef, Component, ComponentRef, ComponentFactory, ComponentFactoryResolver, EmbeddedViewRef } from '@angular/core';

import { Subject, Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// references: https://angular.io/guide/structural-directives#unless
//             https://netbasal.com/dynamically-creating-components-with-angular-a7346f4a982d

@Directive({
  selector: '[delayLoader]',
})
export class DelayLoaderDirective {
  private loaded = false
  private lsubj: Subject<boolean> = new Subject()
  private lsub?: Subscription = undefined
  private viw?: EmbeddedViewRef<any> = undefined
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    this.lsub = this.lsubj.pipe(
      debounceTime(250)
    ).pipe(
      distinctUntilChanged()
    ).subscribe(loading => this.processLoading(loading))
    this.processLoading(true)
  }
  ngOnDestroy() {
    if(this.lsub) this.lsub.unsubscribe();
  }

  @Input() set delayLoader(loading: boolean) {
    setTimeout(() => {
      this.lsubj.next(loading)
    }, 200)
  }

  private processLoading(loading: boolean) {
    // TODO handle delay
    if (loading && !this.loaded) {
      this.viewContainer.clear()
      this.viw = this.viewContainer.createEmbeddedView(this.templateRef)
      this.loaded = true
    } else if (!loading && this.loaded) {
      if(this.viw.rootNodes) {
        this.viw.rootNodes.filter(node => node && node.classList).forEach(node => node.classList.toggle('page-loader-off'))
      }

      setTimeout(() => {
        this.viewContainer.clear()
        this.loaded = false
      }, 200)
    }
  }
}

@Component({
  selector: 'pageLoaderHover',
  template: `
    <div class="page-loader-hover" [class.no-z]="nozindex">
      <div class="preloader3 loader-block">
        <div class="circ1 loader-blinks loader-lg"></div>
        <div class="circ2 loader-blinks loader-lg"></div>
        <div class="circ3 loader-blinks loader-lg"></div>
        <div class="circ4 loader-blinks loader-lg"></div>
      </div>
    </div>
  `
})
export class PageLoaderHover {
  @Input() nozindex: boolean
}

@Component({
  selector: 'pageMiniLoaderHover',
  template: `
    <div class="page-loader-hover mini-loader">
      <div class="preloader3 loader-block">
        <div class="circ1 loader-blinks loader-lg"></div>
        <div class="circ2 loader-blinks loader-lg"></div>
        <div class="circ3 loader-blinks loader-lg"></div>
        <div class="circ4 loader-blinks loader-lg"></div>
      </div>
    </div>
  `
})
export class PageMiniLoaderHover {

}
