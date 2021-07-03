import { Directive, HostBinding, HostListener, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDatatableStickyLeft]'
})
export class DatatableStickyLeftDirective {
  constructor() { }

  private internalAmount?: string;

  @HostBinding('class.t-sticky-left')
  internalClassSticky = true;

  @HostBinding('style.left')
  internalStyleLeft?: string;

  @Input('appDatatableStickyLeft')
  set amount(value: string | undefined) {
    this.internalAmount = value;
    this.internalStyleLeft = value;
  }
  get amount(): string | undefined {
    return this.internalAmount;
  }
}

@Directive({
  selector: '[appDatatableStickyRight]'
})
export class DatatableStickyRightDirective {
  constructor() { }

  private internalAmount?: string;

  @HostBinding('class.t-sticky-right')
  internalClassSticky = true;

  @HostBinding('style.right')
  internalStyleRight?: string;

  @Input('appDatatableStickyRight')
  set amount(value: string | undefined) {
    this.internalAmount = value;
    this.internalStyleRight = value;
  }
  get amount(): string | undefined {
    return this.internalAmount;
  }
}
