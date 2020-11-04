import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-modal-rent-travel-insu',
    templateUrl: './my-modal-rent-travel-insu.component.html',
    styleUrls: ['./my-modal-rent-travel-insu.component.scss']
})
export class MyModalRentTravelInsuComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    // bsModalRef: BsModalRef;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
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
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

}
