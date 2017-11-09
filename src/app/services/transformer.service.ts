import {Injectable} from '@angular/core';

@Injectable()
export class PhoneTransformer {

    static phoneToString(phone: string): string {
        if (!phone) return '';

        return phone.replace(/[\D]/g, '');
    }

    static stringToPhone(string: string): string {
        if (!string) return '';

        string = this.phoneToString(string);

        switch (string.length) {
            case 10:
                string = string.replace(/(\d{3})(\d{3})(\d{4})/g, '$1 $2 $3');
                break;
            case 11:
                string = string.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/g, '+$1 $2 $3 $4');
                break;
        }

        return string;
    }

}
