import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { RentUtilService } from 'src/app/common-source/services/rent-com-service/rent-util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-possesion-coupon',
    templateUrl: './possesion-coupon.component.html',
    styleUrls: ['./possesion-coupon.component.scss']
})
export class PossesionCouponComponent extends BaseChildComponent implements OnInit {

    bsModalRef: BsModalRef;
    selCate: any = 0;
    selCateStr: any;
    foldingKey: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        public bsModalService: BsModalService,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    selectFolding() {
        this.foldingKey = !this.foldingKey;
    }

    selectCate(selCate) {
        this.selCate = selCate;
        this.selCateStr = (<HTMLInputElement>event.target).textContent;
        this.selectFolding();
    }


}
