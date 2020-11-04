import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-flight-passinger',
    templateUrl: './my-modal-flight-passinger.component.html',
    styleUrls: ['./my-modal-flight-passinger.component.scss']
})
export class MyModalFlightPassingerComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    // bsModalRef: BsModalRef;
    travelers: Array<any>;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    onAccordion() {
        (<HTMLInputElement>event.target).closest('.accordion-title').classList.toggle('active');
    }
}