import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { DOCUMENT, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-rent-modal-flight-info',
    templateUrl: './rent-modal-flight-info.component.html',
    styleUrls: ['./rent-modal-flight-info.component.scss']
})
export class RentModalFlightInfoComponent extends BaseChildComponent implements OnInit, OnDestroy {
    storeId: any;

    element: any;

    rxAlive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        @Inject(DOCUMENT) private document: Document,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
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
    }

    ngOnDestroy() {
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }


    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        console.info('모달 닫기');
        this.modalClose();
    }

}
