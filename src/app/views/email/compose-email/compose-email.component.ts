import {Component, OnInit, ViewChild} from '@angular/core';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {NgForm} from '@angular/forms';
import {EmailService} from '../../../services/email.service';
import {Attachment, Email} from '../../../types/email-data.types';
import {AuthenticationService} from '../../../services/authentication.service';
import {ConstantsService} from '../../../services/constants.service';

declare const swal: any;
declare const toastr: any;
declare const $: any;

@Component({
    templateUrl: './compose-email.component.html',
    styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit {
    @ViewChild('form') form;
    data: Email = new Email();
    disabledSubmit = false;
    disabledFileInput = false;
    recipientFilterState = [];
    from = 'notice@maxcondoclub.com';
    fromCopy = '';
    isFromEditMode = false;
    placeholders = [
        '[[RESIDENT_NAME]]',
        '[[RESIDENT_EMAIL]]',
        '[[RESIDENT_MOBILE_PHONE]]',
        '[[RESIDENT_HOME_PHONE]]',
        '[[RESIDENT_BUSINESS_PHONE]]',
        '[[BUILDING_NAME]]',
        '[[BUILDING_ADDRESS]]',
    ];

    isSpinerShow: boolean = false;

    getPlaceholdersHtml(): string {
        return this.placeholders.map(item => `<li><a>${item}</a></li>`).join('');
    }

    constructor(
        public es: EmailService,
        public authService: AuthenticationService,
        private http: Http
    ) {}

    ngOnInit() {
        this.es.getBuildings();
        this.es.getGroups();
        this.es.initFilter();
        this.initData();
        this.initSummernote();
    }

    ngOnDestroy() {
        this.es.emailInComposePage = null;
        this.recipientFilterState  = [];
        if (this.es.filterRecipients) this.es.filterRecipients.resetFilterState();
    }

    initData() {
        if (this.es.emailInComposePage) {
            this.data = this.es.emailInComposePage;
            this.from = this.data.sender;
        }
    }

    initSummernote() {
        const summernote = $('#summernote');
        summernote.summernote({
            dialogsInBody: true,
            callbacks: { onChange: contents => this.data.message = contents },
            toolbar: [
                ["style", ["style"]],
                ["font", ["bold", "italic", "underline", "clear"]],
                ["fontname", ["fontname"]],
                ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]],
                ["table", ["table"]],
                ["insert", ["link", "hr"]],
                ["view", ["fullscreen"]],
                ["help", ["help"]]
            ],
            fontNames: ['Arial', 'open sans', 'Courier New'],
            disableDragAndDrop: true
        });
        $('.note-btn-bold').removeClass('active');

        const btn = `
            <div class="input-group-btn email-placeholders-btn">
                <button data-toggle="dropdown" class="btn btn-sm btn-white dropdown-toggle" 
                        type="button" aria-expanded="false">PL <span class="caret"></span></button>
                <ul class="dropdown-menu pull-right">${this.getPlaceholdersHtml()}</ul>
            </div>
        `;

        $(btn).insertAfter('[data-original-title="Help"]')
            .on('click', 'li a', e => {
                summernote.summernote('editor.restoreRange');
                summernote.summernote('editor.focus');
                summernote.summernote('editor.insertText', e.target.innerText)
            });
        $('.note-editable').html(this.data.message).on('focusout', e => {
            if ($(e.relatedTarget).closest('.note-toolbar').length) {
                summernote.summernote('editor.saveRange');
            }
        });
    }

    onSubmit(form: NgForm, saveAsDraft = false) {
        const recipients     = this.getResidentData();
        const buildingsIdArr = this.es.filterRecipients.getBuildingsContainCheckedUser();

        if (!form.controls['from'].valid) { toastr.warning('Field "From" not valid.');      return; }
        if (!recipients.length)           {
            $('.recipients-field').addClass('ng-invalid');
            toastr.warning('You must select recipients.');
            return;
        }
        if (!form.value.subject)          { toastr.warning('Subject should not be blank.'); return; }
        if (!this.data.message)           { toastr.warning('Message should not be blank.'); return; }
        if (!buildingsIdArr.length)       { toastr.warning('BuildingsIdArr empty!');        return; }

        const data: any = {
            sender:          form.value.from,
            subject:         form.value.subject,
            message:         this.data.message,
            sendMeCopy:      form.value.sendMeCopy,
            filters:         JSON.stringify(this.recipientFilterState),
            recipients:      recipients,
            attachments:     this.getAttachmentsData(),
            pmEmail:         this.authService.user.email,
            pmMobilePhone:   this.authService.user.phone,
            pmName:          this.authService.user.fullName,
            buildingId:      buildingsIdArr,
            buildingName:    this.es.buildings[0].name,
            buildingAddress: this.es.buildings[0].address,
        };

        if (saveAsDraft) data.status = 'draft';

        this.disabledSubmit = true;
        this.isSpinerShow = true;
        this.es.api.post('domainEmails', '/api/v1/mailings', data).subscribe(
            () => {
                toastr.success('Email successfully compose');
                this.es.urlService.router.navigate(['/email-merge']);
                this.isSpinerShow = false;
            },
            error => {
                this.disabledSubmit = false;
                this.es.api.errorHandler(error, 'Compose email failed');
                this.isSpinerShow = false;
            }
        );
    }

    addFile(e){
        const file = e.target.files[0];
        const fd   = new FormData();
        e.target.value = null;

        // if ((file.size + this.data.getAttachmentTotalSize()) > 7000000) {
        //     toastr.warning('Maximum attachment size is 7MB.');
        //     return;
        // }
        if (Attachment.isNotAvailableType(file.name)) {
            toastr.warning('Attachment\'s type not supported.');
            return;
        }

        fd.append('fileUpload', file);
        fd.append('_format', 'json');

        const token   = sessionStorage.getItem('token');
        const headers = new Headers({'Authorization': `Bearer ${token}`});
        const options = new RequestOptions({headers: headers});

        this.es.spinnerShow = true;
        this.disabledFileInput = true;
        this.http.post(`${ConstantsService.domainEmails}/_uploader/attachments/upload`, fd, options)
            .map((response: Response) => response.json()).subscribe(
            res => {
                if (!res.path) { toastr.warning('Attachment path should not be blank.'); return; }
                const attachment = new Attachment(file.name, file.size, res.path);
                this.data.attachments.push(attachment);
            },
            error => {
                this.es.api.errorHandler(error, 'Upload file failed');
                this.es.spinnerShow    = false;
                this.disabledFileInput = false;
            },
            () => {
                this.es.spinnerShow    = false;
                this.disabledFileInput = false;
            }
        );

    }

    removeFile(i: number) {
        swal(
            ConstantsService.getSwalConfig('Delete Attachment'),
            () => this.data.attachments.splice(i, 1)
        );
    }

    getResidentData() {
        const result = [];
        this.recipientFilterState.forEach(item => {
            item.checkedResidents.forEach((residentId) => {
                const resident = this.es.filterRecipients.residents.find(r => r.id === residentId);
                if (!resident) { console.log('Resident not found!!!'); return; }
                if (!resident.email) { console.log('Resident without email!!!'); return; }

                const r: any = {
                    name:            resident.fullName,
                    email:           resident.email,
                    type:            resident.role,
                    buildingId:      resident.buildingId,
                    buildingName:    resident.buildingName,
                    buildingAddress: resident.buildingAddress,
                    suiteId:         resident.suiteId,
                    suiteName:       resident.suiteNumber,
                };

                let homePhone     = resident.phones.find(p => p.phoneType === 'phone_home');
                let mobilePhone   = resident.phones.find(p => p.phoneType === 'phone_cell');
                let businessPhone = resident.phones.find(p => p.phoneType === 'phone_business');
                if (homePhone)     r.homePhone     = homePhone.phone;
                if (mobilePhone)   r.mobilePhone   = mobilePhone.phone;
                if (businessPhone) r.businessPhone = businessPhone.phone;

                result.push(r);
            });
        });
        return result;
    }

    getAttachmentsData() {
        return this.data.attachments.map(
            at => ({ name: at.name, fileSize: at.fileSize, path: at.path })
        );
    }

    applyFromField() {
        if(this.form.controls.from.valid) {
            this.isFromEditMode = false;
            if (this.form.controls.from.dirty)
                toastr.warning('Changing "From" field may result in some emails being sent to spam box.');
        }
    }

    saveRecipients(filterState) {
        this.recipientFilterState = filterState;
        $('.recipients-field').removeClass('ng-invalid');
    }

    isDisabledSubmit(): boolean {
        return this.disabledSubmit ||
            !this.es.filterRecipients ||
            !this.es.filterRecipients.isSomeChecked() ||
            !this.recipientFilterState.length ||
            !this.form.value.subject ||
            !this.data.message
    }

}
