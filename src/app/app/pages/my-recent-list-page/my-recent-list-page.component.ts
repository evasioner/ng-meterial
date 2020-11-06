import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BasePageComponent } from '../base-page/base-page.component';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-recent-list-page',
    templateUrl: './my-recent-list-page.component.html',
    styleUrls: ['./my-recent-list-page.component.scss']
})
export class MyRecentListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    tabNo: any;
    foldingKey: boolean = false;
    rxAlive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
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
        this.headerInit();
        this.selectTab(0);
        // this.aaa();
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
            title: '최근 본 상품',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }

    // selectFolding() {
    //   this.foldingKey = !this.foldingKey;
    // }

    // onTab0Click(e) {
    //   console.info('[전체 예약리스트]', e);
    //   const seltab = 'all-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab1Click(e) {
    //   console.info('[항공 예약리스트]', e);
    //   const seltab = 'flight-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab2Click(e) {
    //   console.info('[호텔 예약리스트]', e);
    //   const seltab = 'hotel-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab3Click(e) {
    //   console.info('[액티비티 예약리스트]', e);
    //   const seltab = 'activity-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab4Click(e) {
    //   console.info('[렌터카 예약리스트]', e);
    //   const seltab = 'rent-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab5Click(e) {
    //   console.info('[묶음할일 예약리스트]', e);
    //   const seltab = 'airtel-reservation-list';
    //   this.callReservation(seltab);
    // }

    // callReservation(seltab) {
    // const rqInfo = {
    //   seltab: seltab
    //   // locationAccept: this.vm.locationAccept,
    //   // locationReturn: this.vm.locationReturn,
    //   // locationReturnBool: this.vm.locationReturnBool,
    //   // formDateStr: this.vm.formDateStr, // 인수 날짜
    //   // formTimeVal: this.vm.formTimeVal,
    //   // toDateStr: this.vm.toDateStr, // 반납 날짜
    //   // toTimeVal: this.vm.toTimeVal,
    //   // rq: rq
    // };

    // const base64Str = this.base64Svc.base64EncodingFun(rqInfo);
    // const path = '/mypage-reservation-list/' + seltab; //+ '/' + base64Str;
    // const extras = {
    //   relativeTo: this.route
    // };
    // console.log('path >>>>>', path);

    // this.router.navigate([path], extras);
    // }


}
