

export class FromToNumber {
    from: number
    to: number
    constructor(from?: number, to?: number) {
        this.from = from ? from : null
        this.to = to ? to : null
    }
}

export class FromToDate {
    from: Date
    to: Date
    constructor(from?: Date, to?: Date) {
        this.from = from ? from : null
        this.to = to ? to : null
    }
}