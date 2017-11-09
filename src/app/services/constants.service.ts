import {Injectable} from '@angular/core';

@Injectable()
export class ConstantsService {
    // static readonly oauthUrl          = 'http://auth-maxtvm.requestumdemo.com';
    // static readonly domainBD          = 'http://building-maxtvmedia.requestumdemo.com/api';
    // static readonly domainParcels     = 'http://parcels-maxtvmedia.requestumdemo.com/api';
    // static readonly domainEmails      = 'http://email-maxtvmedia.requestumdemo.com/api';

    static readonly oauthUrl          = 'https://auth.maxtvcommunications.com';
    static readonly domainBD          = 'https://building.maxtvcommunications.com/api';
    static readonly domainParcels     = 'https://parcels.maxtvcommunications.com/api';
    static readonly domainEmails      = 'https://mail.maxtvcommunications.com';
    static readonly domainDocuments      = 'http://documents.maxtvcommunications.com';

    static readonly oauthClientId     = '20aa5tpwg04ks4w84o8cookswwccgkwko40gwcs0ws840wkssk';
    static readonly oauthClientSecret = '79fqd7qzbp8g8o8oggss48w4kwck4s4kccwwk8804ksowg8o';

    static getSwalConfig(title: string, text: string = 'Are you sure you want to delete?') {
        return {
            title: title,
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            closeOnConfirm: true
        };
    }
}
