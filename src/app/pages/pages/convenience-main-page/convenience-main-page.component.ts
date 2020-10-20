import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { BaseChildComponent } from '../base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConvenienceModalSellerComponent } from './modal-components/convenience-modal-seller/convenience-modal-seller.component';

@Component({
    selector: 'app-convenience-main-page',
    templateUrl: './convenience-main-page.component.html',
    styleUrls: ['./convenience-main-page.component.scss']
})
export class ConvenienceMainPageComponent extends BaseChildComponent implements OnInit, OnDestroy {
    headerConfig: any;
    vm: any = {
        categoryList: null
    };
    rxAlive: boolean = true;
    show: boolean = false;
    buttonName: any = 'Show';
    bsModalRef: BsModalRef;
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        private bsModalSvc: BsModalService,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.vmInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_CONVENIENCE
        };
    }

    vmInit() {
        this.rxAlive = true;
        this.vm.categoryList = [
            { styleType: 'visa', categoryName: '비자', url: 'http://www.myvisa.co.kr/' }, // 비자
            { styleType: 'insurance', categoryName: '여행자보험', url: 'https://www.chubb.com/kr-kr/' }, // 여행자 보험
            { styleType: 'wifi', categoryName: '와이파이', url: 'https://www.wifidosirak.com/v3/index.aspx' }, // 와이파이
            { styleType: 'car', categoryName: '전용차량', url: 'http://movv.co/' }, // 전용차량
            { styleType: 'train', categoryName: '열차예약', url: 'http://www.rts.co.kr/Hotel/B2BGlobal.aspx' }, // 열차예약
            { styleType: 'restaurant', categoryName: '레스토랑', url: 'https://www.waug.com/ko/specials/fnb' }, // 레스토랑
            { styleType: 'cloth', categoryName: '외투보관', url: 'https://www.mrcoatroom.com/' }, // 외투보관
            { styleType: 'tool', categoryName: '여행용품', url: 'https://www.1300k.com/?from=GODOAD&gclid=CjwKCAjwkun1BRAIEiwA2mJRWRtUek9tXT5VeG1l-daQ91zPrwTBVNx-Lf3qKFpcH8XRXy4wUUhgvBoCKUEQAvD_BwE' }, // 여행용품
            { styleType: 'baggage', categoryName: '짐보관', url: 'https://www.safex.kr/?NaPm=ct%3Dka3om4m0%7Cci%3D0yO0003Rn%5FDsmTZ5b1iu%7Ctr%3Dsa%7Chk%3D49020b6cac7ecde2ee4f2ba9e5f8518a130caf04' }, // 짐보관
            { styleType: 'euro-train', categoryName: '유럽열차', url: '' }, // 유럽열차
            { styleType: 'sim', categoryName: '유심', url: 'https://www.usimstore.com/shop/' }, // 유심
            { styleType: 'airport-pickup', categoryName: '공항픽업', url: 'https://www.kvantago.com/index.php/main/index?purpose=pick_up' }, // 공항픽업
            { styleType: 'lounge', categoryName: '라운지', url: 'https://www.theloungemembers.com/kr/main/main.html?NaPm=ct%3Dka3oj4l4%7Cci%3D0BvI001Fn%5FDsQSyGHKWT%7Ctr%3Dsa%7Chk%3Da9466deb13e8b8707ecf217f671f02f96af52cf2' }, // 라운지
            { styleType: 'coupon', categoryName: '할인쿠폰', url: 'https://www.jungfrau.co.kr/main/main.asp' },// 할인쿠폰
            { styleType: 'airport-train', categoryName: '공항열차', url: '' }, // 공항열차
            { styleType: 'pet', categoryName: '애견호텔', url: '' },// 애견호텔
            { styleType: 'carrier', categoryName: '캐리어배송', url: '' },// 캐리어배송
            { styleType: 'photo', categoryName: '스냅사진', url: 'https://www.snaps.com/?NaPm=ct%3Dka3olfw5%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3D%7Chk%3Dd39419c17a682d031f85e0015dbec2a50dc2782a' }, // 스냅사진
            { styleType: 'exchange', categoryName: '환전서비스', url: '' }, // 환전서비스
            { styleType: 'parking', categoryName: '공항주차서비스', url: '' }, // 공항주차서비스
            // { styleType: 'shopping', categoryName: '여행용품쇼핑', url: '' }, // 여행용품쇼핑
        ];
    }

    onGoCategorySearchClick(i: number) {
        // const configInfo = {
        //     class: 'm-ngx-bootstrap-modal',
        //     animated: false
        // };
        // const url = this.vm.categoryList[i].url;
        // const initialState = {

        //     url: url

        // };

        // console.log(initialState, 'initialState');

        // this.bsModalSvc.show(ConvenienceModalSellerComponent, { initialState, ...configInfo });


        if (isPlatformBrowser(this.platformId)) {
            const url = this.vm.categoryList[i].url;
            window.open(url);
            console.log(url, 'url');
        }
    }

    toggle() {
        this.show = !this.show;
        // CHANGE THE NAME OF THE BUTTON.
        if (this.show) {
            this.buttonName = 'Hide';

        } else {
            this.buttonName = 'Show';
        }
    }
}

