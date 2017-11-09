export class Document {
    constructor(
        public id: number = null,
        public name: string = '',
        public building: number = null,
        public type: string = '',
        public permissions: string = '',
        public path: string = '',
        public parent: number = null,
        public shared: number = null
    ) {};
}
