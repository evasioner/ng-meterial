import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { DOCUMENT, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-modal-reservation-qna-write',
    templateUrl: './my-modal-reservation-qna-write.component.html',
    styleUrls: ['./my-modal-reservation-qna-write.component.scss']
})
export class MyModalReservationQnaWriteComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    // bsModalRef: BsModalRef;

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

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

}
