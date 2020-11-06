import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-flight-passport',
    templateUrl: './my-modal-flight-passport.component.html',
    styleUrls: ['./my-modal-flight-passport.component.scss']
})
export class MyModalFlightPassportComponent extends BaseChildComponent implements OnInit {
    traveler: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.pageInit();
    }

    pageInit() {
        console.info('this.traveler>>>>>>>>>', this.traveler);
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    toggleClass() {
        (<HTMLInputElement>event.target).classList.toggle('active');
    }

    onCloseClick() {
        this.modalClose();
    }

}