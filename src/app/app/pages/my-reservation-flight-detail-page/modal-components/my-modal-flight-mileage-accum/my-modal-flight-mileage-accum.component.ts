import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-flight-mileage-accum',
    templateUrl: './my-modal-flight-mileage-accum.component.html',
    styleUrls: ['./my-modal-flight-mileage-accum.component.scss']
})
export class MyModalFlightMileageAccumComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    // bsModalRef: BsModalRef;
    travelers: Array<any>;

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
        this.travelers = [
            { name: 'Prashobh', sex: 'M', selected: false },
            { name: 'Abraham', sex: 'M', selected: false },
            { name: 'Anil', sex: 'F', selected: false },
            { name: 'Sam', sex: 'M', selected: false },
            { name: 'Natasha', sex: 'F', selected: false },
            { name: 'Marry', sex: 'F', selected: false },
            { name: 'Zian', sex: 'F', selected: false },
            { name: 'karan', sex: 'F', selected: false },
        ];
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