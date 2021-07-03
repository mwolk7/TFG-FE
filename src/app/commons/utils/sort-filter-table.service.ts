import { Injectable } from '@angular/core';
import { SortDirection } from 'src/app/components/data-table/data-table-sort.directive';

@Injectable({
  providedIn: 'root'
})
export class SortFilterTableService {

  private myKey: string = null
  private myValue: SortDirection = null

  constructor() { }

  sortData<K>(data: K[], sort: SortClass, forceSort: boolean = false): K[] {
    if (sort.value != SortDirection.None) {
      return this.sorting(data, sort.key, sort.value, forceSort)
    } else {
      return this.sorting(data, sort.defaultKey, sort.defaultValue, forceSort)
    }
  }

  private sorting<K>(data: K[], key: string, value: SortDirection, forceSort: boolean): K[] {
    console.log('inside sorting', key, value)
    if (forceSort || !(this.myKey == key && this.myValue == value)) {
      this.myKey = key
      this.myValue = value
      data = [].concat(data.sort((a, b) => {
        //console.log(a[key],a)
        let a1 = a[key]
        let b1 = b[key]
        let c1: boolean = this.handleField(a1, b1, false, a1 instanceof Date)
        let c2: boolean = this.handleField(a1, b1, true, a1 instanceof Date)
        return value == SortDirection.Asc ? (c1 ? 1 : -1) : (c2 ? 1 : -1)
      }))
      return data
    } else return data
  }

  private handleDate(d?: Date): number {
    return d && d != null ? d.getTime() : 0
  }

  private handleField(a: any, b: any, isLower: boolean, isDate = false): boolean {
    let a1 = isDate ? this.handleDate(a) : a
    let b1 = isDate ? this.handleDate(b) : b
    return typeof a1 === 'undefined' || typeof b1 === 'undefined' ? true : (isLower ? a1 <= b1 : a1 >= b1)
  }

}

export class FilterDefs {

  static equals(arg: any, extractor: (any: any) => any | undefined, fallbackIfNotDef: boolean = true): (item: any) => boolean {
    return (item: any) => {
      const value: any | undefined = extractor(item)
      return (arg !== undefined && arg !== null) ? value == arg : fallbackIfNotDef
    }
  }

  static contains(args: any[], extractor: (any: any) => any | undefined, fallbackIfNotDef: boolean = true): (item: any) => boolean {
    return (item: any) => {
      const value: any | undefined = extractor(item)
      return (args !== undefined && args !== null) ? args.indexOf(value) > -1 : fallbackIfNotDef
    }
  }

  static like(arg: any, extractor: (any: any) => any | undefined, fallbackIfNotDef: boolean = true): (item: any) => boolean {
    return (item: any) => {
      const value: any | undefined = extractor(item)
      return (arg !== undefined && arg !== null && arg.value != "") ? (value && value !== null ? 
        this.interpreterForInternalFilters(arg.start, arg.end, this.handleStringCase(arg.value))(this.handleStringCase(value)) : false) : fallbackIfNotDef
    }
  }

  // static boolEquals(arg: boolean, extractor: (any: any) => boolean | undefined, fallbackIfNotDef: boolean = true): (item: boolean) => boolean {
  //   return (item: boolean) => {
  //     const value: any | undefined = extractor(item)
  //     return typeof arg !== 'undefined' && arg != null ? value == arg : fallbackIfNotDef
  //   }
  // }  // NOTE: DON'T USE THIS FUNCTION FOR FILTERS

  static gte(arg: number, extractor: (any: any) => number | undefined, fallbackIfNotDef: boolean = true): (item: number) => boolean {
    return (item: number) => {
      const value: number | undefined = extractor(item)
      return (arg !== undefined && arg !== null) ? arg >= value : fallbackIfNotDef
    }
  }

  static lte(arg: number, extractor: (any: any) => number | undefined, fallbackIfNotDef: boolean = true): (item: number) => boolean {
    return (item: number) => {
      const value: number | undefined = extractor(item)
      return (arg !== undefined && arg !== null) ? arg <= value : fallbackIfNotDef
    }
  }

  static endleConst(arg: string, extractor: (any: any) => string | undefined, fallbackIfNotDef: boolean = true): (item: string) => boolean {
    return (item: string) => {
      if (arg === undefined && arg === null) return fallbackIfNotDef
      else {
        const value: string | undefined = extractor(item)
        switch (arg) {
          case 'O': {
            return value === undefined || value === null || value === ''
          }
          case 'C': {
            return value !== undefined && value !== null && value !== ''
          }
          case 'A': {
            return true
          }
        }
      }
    }
  }

  static interpreterForInternalFilters(start: boolean, end: boolean, currentValue: string): (value: string) => boolean {
    return start && end ? value => value.includes(currentValue) : (
      start ? value => value.endsWith(currentValue) : (
        end ? value => value.startsWith(currentValue) : (
          currentValue == "" ? () => true : value => value == currentValue
        )
      )
    )
  }

  private static handleStringCase(s: string): string {
    return s ? s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ''
  }

}

export class SortClass {
  defaultKey: string
  defaultValue: SortDirection
  key: string
  value: SortDirection

  constructor(key: string, value: SortDirection) {
    this.defaultKey = key
    this.defaultValue = value == SortDirection.None ? SortDirection.Asc : value
    this.key = key
    this.value = value == SortDirection.None ? SortDirection.Asc : value
  }

  setKeyValue(sort?: { key: string; value: SortDirection }) {
    if (sort) {
      this.key = sort.key
      this.value = sort.value
    } else {
      this.key = this.defaultKey
      this.value = this.defaultValue
    }
  }
}
