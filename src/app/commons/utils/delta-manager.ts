import {Input, EventEmitter, Output} from '@angular/core';
import { Subject, Observable, Subscription, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { Utils } from './utils/util-class';

class ChangeDetectionHandler<T extends object> implements ProxyHandler<T> {
  private internalTrigger;

  constructor() {
    this.internalTrigger = new Subject();
  }

  set?(target: T, p: PropertyKey, value: any, receiver: any): boolean {
    target[p] = value;
    this.internalTrigger.next();
    return true;
  }
  apply?(target: T, thisArg: any, argArray?: any): any {
    (target as any).apply(thisArg, argArray);
    this.internalTrigger.next();
  }

  public get trigger(): Observable<any> {
    return this.internalTrigger;
  }
}

// NOTE: delta manager works only on first-level properties (no deep inside object hierarchy...)
export class DeltaManager<T extends object> {
  private initialValue: T;
  private currentValue: T; // NOTE: this is the proxied
  private appliedValue: T;
  private appliableValue: boolean;
  private presettableValue: boolean;
  private currentValueChange: EventEmitter<T>;
  private appliedValueChange: EventEmitter<T>;
  private appliableValueChange: EventEmitter<boolean>;
  private presettableValueChange: EventEmitter<boolean>;
  private currentValueSubscriptions: Subscription;
  private onApplyChangeSubscription: Subscription;

  constructor(initialValue: T, onApplyChange?: (arg: T) => void) {
    const handler = new ChangeDetectionHandler<T>();
    const currentValue: T = Utils.deepClone(undefined, initialValue);
    const appliedValue: T = Utils.deepClone(undefined, initialValue);
    const currentValueProxy = new Proxy(currentValue, handler);

    this.initialValue = initialValue;
    this.currentValue = currentValueProxy;
    this.appliedValue = appliedValue;
    this.appliableValue = false;
    this.presettableValue = false;

    this.currentValueChange = new EventEmitter();
    this.appliedValueChange = new EventEmitter();
    this.appliableValueChange = new EventEmitter();
    this.presettableValueChange = new EventEmitter();

    // TODO: how to force to unsubscribe, in ngDestroy of components?
    if (onApplyChange) {
      this.onApplyChangeSubscription = this.appliedValueChange.subscribe((arg: T) => {
        onApplyChange(arg);
      });
    }
    this.currentValueSubscriptions = handler.trigger.pipe(debounce(() => interval(10))).subscribe(() => {
      this.computeAppliable();
      this.computePresettable();
      this.currentValueChange.emit(this.currentValue);
    });
  }

  public get initial(): T {
    return this.initialValue;
  }

  public get applied(): T {
    return this.appliedValue;
  }
  @Output()
  public get appliedChange(): EventEmitter<T> {
    return this.appliedValueChange;
  }

  @Input()
  public set current(value: T) {
    Utils.deepClone(this.currentValue, value);
  }
  public get current(): T {
    return this.currentValue;
  }
  @Output()
  public get currentChange(): EventEmitter<T> {
    return this.currentValueChange;
  }

  public get presettable(): boolean {
    return this.presettableValue;
  }
  @Output()
  public get presettableChange(): EventEmitter<boolean> {
    return this.presettableValueChange;
  }

  public get appliable(): boolean {
    return this.appliableValue;
  }
  @Output()
  public get appliableChange(): EventEmitter<boolean> {
    return this.appliableValueChange;
  }

  public applyCurrent() {
    if (!this.appliableValue) {
      return;
    }

    Utils.deepClone(this.appliedValue, this.currentValue, true);

    this.computeAppliable();
    this.computePresettable();

    this.currentValueChange.emit(this.currentValue);
    this.appliedValueChange.emit(this.appliedValue);
  }

  public presetInitial() {
    if (!this.presettableValue) {
      return;
    }
    Utils.deepClone(this.currentValue, this.initialValue);

    this.computeAppliable();
    this.computePresettable();
    
    this.applyCurrent();
  }

  public dispose() {
    if (this.currentValueSubscriptions) {
      this.currentValueSubscriptions.unsubscribe();
      this.currentValueSubscriptions = undefined;
    }
    if (this.onApplyChangeSubscription) {
      this.onApplyChangeSubscription.unsubscribe();
      this.onApplyChangeSubscription = undefined;
    }
  }

  // ------ //

  private computeAppliable() {
    const diff = !Utils.deepEquals(this.currentValue, this.appliedValue);
    if (diff !== this.appliableValue) {
      this.appliableValue = diff;
      this.appliableChange.emit(diff);
    }
  }

  private computePresettable() {
    const diff = !Utils.deepEquals(this.currentValue, this.initialValue);
    if (diff !== this.presettableValue) {
      this.presettableValue = diff;
      this.presettableValueChange.emit(diff);
    }
  }

}
