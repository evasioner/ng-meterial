import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-flight-modal-children-informaion',
    templateUrl: './flight-modal-children-informaion.component.html',
    styleUrls: ['./flight-modal-children-informaion.component.scss']
})
export class FlightModalChildrenInformaionComponent extends BaseChildComponent implements OnInit, OnDestroy {
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit() {
        super.ngOnInit();

        console.info('[ngOnInit | 아동/유아 항공권 예약안내]');
    }

    ngOnDestroy() {
    }


    modalClose() {
        this.bsModalRef.hide();
    }
}
