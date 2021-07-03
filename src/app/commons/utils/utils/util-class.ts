import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class Utils {

    static compare2Objects<T>(a: T | undefined, b: T | undefined, isFirst: boolean = true): boolean {
        console.log('compare2Objects', a, b)
        if (a == undefined && b == undefined) return true
        else if (a == undefined) return false
        else if (b == undefined) return false
        else {
            let list: boolean[] = Object.keys(a).map(l => {
                if (typeof a[l] == 'function') return true
                else if (Array.isArray(a[l])) return Array.isArray(b[l]) ? this.compareArray(a[l], b[l]) : false
                else if (a[l] instanceof Object) return b[l] ? this.compare2Objects(a[l], b[l]) : false
                else return b ? a[l] == b[l] : false
            })
            if (isFirst) list.push(this.compare2Objects(b, a, false))
            return !list.includes(false)
        }
    }

    static deepEquals(a: any, b: any, discardNulls: boolean = true, discardEmpyString: boolean = true): boolean {
        const na = a === null || a === undefined
        const nb = b === null || b === undefined
        if (discardNulls && na && nb) return true
        if (discardEmpyString) {
            const nna = a == '' || na
            const nnb = b == '' || nb
            if (nna && nnb) return true
        }
        if (na && !nb || !na && nb) return false

        const nulltarget = a === null || a === undefined;
        const isarr = Array.isArray(a);
        const isfunction = typeof a === 'function';
        const isDate = a instanceof Date;
        const isobject = !isfunction && a instanceof Object;
        if (!nulltarget && (
            isarr && !Array.isArray(b) ||
            isfunction !== (typeof b === 'function') ||
            isobject !== !(typeof b === 'function') && (b instanceof Object)) ||
            isDate !== (b instanceof Date)) {
            return false;
        }

        if (isarr) {
            const arrb = nulltarget ? [] : (b as Array<any>);
            const arra = (a as Array<any>);
            if (arra.length !== arrb.length) {
                return false;
            }
            if (arra.findIndex((el, idx) => !this.deepEquals(arrb[idx], el)) >= 0) {
                return false;
            }
            return true;
        }
        if (isDate) {
            return new Date(a).getTime() == new Date(b).getTime()
        }
        if (isobject) {
            // NOTE: this does not handle arrays as root objects..can be extended
            for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
                if (!this.deepEquals(a[key], b[key])) {
                    return false;
                }
            }
            return true;
        }
        if (isfunction) {
            return true;
        }

        return a === b;
    }

    static deepClone(target: any | undefined, source: any, cleanSource: boolean = false): any {
        // if (source === null || source === undefined) {
        //   throw new Error('deepCopy: source should exist');
        // }

        if (cleanSource) this.clean(source)

        let nulltarget = target === null || target === undefined;
        const isarr = Array.isArray(source);
        const isfunction = typeof source === 'function';
        const isDate = source instanceof Date;
        const isobject = !isfunction && source instanceof Object;
        if (!nulltarget && (
            isarr && !Array.isArray(target) ||
            isfunction !== (typeof target === 'function') ||
            isobject !== !(typeof target === 'function') && (target instanceof Object)) ||
            isDate !== (target instanceof Date)) {
            target = undefined
            nulltarget = true
        }
        if (isarr) {
            const arrsrc = (source as Array<any>);
            const arrtgt = [].concat(arrsrc.map(itm => this.deepClone(undefined, itm)));
            return arrtgt;
        }
        if (isDate) {
            const trg = new Date(source);
            return trg;
        }
        if (isobject) {
            // NOTE: this does not handle arrays as root objects..can be extended
            const objtgt = target || {};
            const objsrc = source;
            const targetKeysLeft = new Set(Object.keys(objtgt));
            for (const key of Object.keys(objsrc)) {
                objtgt[key] = this.deepClone(objtgt[key], objsrc[key]);
                targetKeysLeft.delete(key);
            }
            for (const key of targetKeysLeft) {
                delete objtgt[key];
            }
            return objtgt;
        }
        if (isfunction) {
            return target;
        }

        target = source;
        return target;
    }

    private static clean(obj: any) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
    }


    /* TODO: MAKE IT EFFICIENT!!!!!
       eg. make trivial verifications before comparing in such way, so check if length match before, ...
       eg. you don't need to compute ALL diff list, but on the first diff you can exit with false.
    */
    private static compareArray<M>(a: M[], b: M[]): boolean { // todo extend in more complicate case (object)
        return !a.map(e => b.includes(e)).concat(b.map(e => a.includes(e))).includes(false)
    }

}
