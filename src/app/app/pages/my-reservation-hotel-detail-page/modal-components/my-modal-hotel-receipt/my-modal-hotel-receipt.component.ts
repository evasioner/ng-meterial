import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { DOCUMENT, Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-modal-hotel-receipt',
    templateUrl: './my-modal-hotel-receipt.component.html',
    styleUrls: ['./my-modal-hotel-receipt.component.scss']
})
export class MyModalHotelReceiptComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    mode: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        @Inject(DOCUMENT) private document: Document,
        public translateService: TranslateService,
        private location: Location,
        private el: ElementRef,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.mode = 0;
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    changeMode(m) {
        this.mode = m;
    }

}
