export class Theme {
    colors = {
        body: '#f3f3f4',
        primary: '#1ab394',
        primaryHover: '#1a7794'
    };
    miniLogo: string;
    obj;

    constructor(
        public id:        number   = null,
        public name:      string   = '',
        public logo:      string   = '',
        public settings:  string   = '{}',
        public companies: number[] = []
    ) {
        try {
            this.obj = JSON.parse(this.settings);
        } catch (e) {
            console.error('Wrong settings format.');
        }
        if (typeof this.obj === 'object') {
            if (this.obj.colors) this.colors = this.obj.colors;
            if (this.obj.miniLogo) this.miniLogo = this.obj.miniLogo;
        }
    }
}

export class Company {
    constructor(
        public id:      number    = null,
        public name:    string    = '',
        public email:   string    = '',
        public address: string    = '',
        public phone:   string    = '',
        public theme:   number    = null,
        public offices: Office[]  = [],
        public checked: boolean   = false
    ) {}
}

export class Office {
    constructor(
        public id:     number = null,
        public name:   string = '',
        public phone:  string = '',
        public members: {name: string, phone: string}[] = [{name: '', phone: ''}],
        public company: number = null,
    ) {}
}

export class BuildingPropertyManager {
    constructor(
        public id:         number,
        public buildingId: number,
        public user:       number
    ) {}
}








