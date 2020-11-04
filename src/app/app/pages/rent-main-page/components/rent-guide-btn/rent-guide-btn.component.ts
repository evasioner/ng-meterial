import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

import { RentModalDemandsComponent } from '../../modal-components/rent-modal-demands/rent-modal-demands.component';
import { RentModalAmericaComponent } from '../../modal-components/rent-modal-america/rent-modal-america.component';
import { RentModalCanadaComponent } from '../../modal-components/rent-modal-canada/rent-modal-canada.component';
import { RentModalEuropeComponent } from '../../modal-components/rent-modal-europe/rent-modal-europe.component';

@Component({
    selector: 'app-rent-guide-btn',
    templateUrl: './rent-guide-btn.component.html',
    styleUrls: ['./rent-guide-btn.component.scss']
})
export class RentGuideBtnComponent extends BaseChildComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private bsModalService: BsModalService,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
    }

    demandClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalDemandsComponent, { initialState, ...configInfo });
    }
    americaClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalAmericaComponent, { initialState, ...configInfo });
    }
    canadaClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalCanadaComponent, { initialState, ...configInfo });
    }
    europeClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalEuropeComponent, { initialState, ...configInfo });
    }

}
