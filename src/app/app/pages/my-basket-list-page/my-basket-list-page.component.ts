import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-basket-list-page',
    templateUrl: './my-basket-list-page.component.html',
    styleUrls: ['./my-basket-list-page.component.scss']
})
export class MyBasketListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    tabNo: any;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
    }

    ngOnInit(): void {

        super.ngOnInit();
        this.selectTab(0);
        this.headerInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    aaa() {
        const futureMonth = moment().add(3, 'months');
        const pastMonth = moment().subtract(3, 'months');
        console.log('futureMonth >>>', futureMonth.format('YYYY-MM-DD'));
        console.log('pastMonth >>>', pastMonth.format('YYYY.MM.DD (ddd)'));
    }

    hisBack() {
        history.back();
    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '장바구니',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }

    // onTab0Click(e) {
    //   console.info('[전체 예약리스트]', e);
    //   const seltab = 'all-basket-list';
    //   this.callBasket(seltab);
    // }

    // onTab1Click(e) {
    //   console.info('[항공 예약리스트]', e);
    //   const seltab = 'flight-basket-list';
    //   this.callBasket(seltab);
    // }

    // onTab2Click(e) {
    //   console.info('[호텔 예약리스트]', e);
    //   const seltab = 'hotel-basket-list';
    //   this.callBasket(seltab);
    // }

    // onTab3Click(e) {
    //   console.info('[액티비티 예약리스트]', e);
    //   const seltab = 'activity-basket-list';
    //   this.callBasket(seltab);
    // }

    // onTab4Click(e) {
    //   console.info('[렌터카 예약리스트]', e);
    //   const seltab = 'rent-basket-list';
    //   this.callBasket(seltab);
    // }

    // onTab5Click(e) {
    //   console.info('[묶음할일 예약리스트]', e);
    //   const seltab = 'airtel-basket-list';
    //   this.callBasket(seltab);
    // }

    callBasket(seltab) {
        const path = '/mypage-basket-list/' + seltab;
        const extras = {
            relativeTo: this.route
        };
        console.log('path >>>>>', path);

        this.router.navigate([path], extras);
    }


}
