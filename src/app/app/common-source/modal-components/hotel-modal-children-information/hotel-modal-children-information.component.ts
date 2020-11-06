import { Component, Inject, PLATFORM_ID, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-modal-children-information',
    templateUrl: './hotel-modal-children-information.component.html',
    styleUrls: ['./hotel-modal-children-information.component.scss']
})
export class HotelModalChildrenInformationComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;

    isBrowser: boolean = false;
    isServer: boolean = false;
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private el: ElementRef,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(event: MouseEvent) {
        event && event.preventDefault();
        console.info('모달 닫기');
        this.modalClose();
    }
}
