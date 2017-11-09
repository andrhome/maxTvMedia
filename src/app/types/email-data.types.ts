import {FilterStateItem} from '../services/filter-recipients';

export class Email {
    constructor(
        public id:              string = '',
        public sender:          string = '',
        public subject:         string = '',
        public message:         string = '',
        public pmName:          string = '',
        public pmEmail:         string = '',
        public pmMobilePhone:   string = '',
        public buildingName:    string = '',
        public buildingAddress: string = '',
        public sendMeCopy:      string = '',
        public status:          string = '',
        public filters:         Array<FilterStateItem> = [],
        public attachments:     Array<Attachment> = [],
        public recipients:      Array<any> = [],
        public createdAt:       string = '',
        public recipientsCount: number = 0,
        public sentCount:       number = 0
    ) {}

    getAttachmentTotalSize(): number {
        if (!this.attachments.length) return 0;
        return this.attachments.map(a => a.fileSize).reduce((pv, cv) => pv + cv);
    }
}

export class Attachment {

    static availableTypes = [
        '.txt', '.pdf', '.doc', 'docx', '.xls', 'xlsx', '.ppt', 'pptx',
        '.bmp', '.gif', '.ico', 'jpeg', '.pcx', '.png', 'tiff', '.jpg',
        '.mp4', '.avi',
    ];

    type: string;

    public static isNotAvailableType(path: string): boolean {
        const type = path ? path.toLowerCase().slice(-4) : null;
        return Attachment.availableTypes.indexOf(type) === -1;
    }

    constructor(
        public name:     string = '',
        public fileSize: number = 0,
        public path:     string = '',
    ) {
        this.type = this.path ? this.path.toLowerCase().slice(-4) : null;
    }

    isImage() {
        return ['.gif', 'jpeg', '.png', '.jpg'].indexOf(this.type) !== -1;
    }

    isNeedViewer() {
        return ['.txt', '.pdf', '.doc', 'docx', '.xls', 'xlsx', '.ppt', 'pptx'].indexOf(this.type) !== -1;
    }

    openViewer() {
        const _src = `https://docs.google.com/viewer?url=${this.path}&embedded=true`;
        window.open(_src);
    }

    downloadAttachment() {
        window.open(this.path);
    }

}

export class ResidentEmailRecipient {
    constructor(
        public id:                number = null,
        public email:             string = '',
        public fullName:          string = '',
        public groups:            Array<any> = [],
        public phones:            Array<any> = [],
        public role:              string = 'unknown',
        public emailWaiverSigned: boolean = false,
        public buildingId:        string = null,
        public buildingName:      string = '',
        public buildingAddress:   string = '',
        public suiteId:           string = null,
        public suiteNumber:       string = '',

        public checked: boolean = false,
    ) {}
}

export class RecipientMailingResult {
    constructor(
        public id:           string = '',
        public suiteName:    string = '',
        public buildingName: string = '',
        public name:         string = '',
        public type:         string = '',
        public email:        string = '',
        public status:       string = '',
    ) {}
}



