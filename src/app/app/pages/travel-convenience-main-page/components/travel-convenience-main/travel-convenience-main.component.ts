import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { TravelConvenienceSellerComponent } from '../../modal-components/travel-convenience-seller/travel-convenience-seller.component';

@Component({
    selector: 'app-travel-convenience-main',
    templateUrl: './travel-convenience-main.component.html',
    styleUrls: ['./travel-convenience-main.component.scss']
})
export class TravelConvenienceMainComponent extends BaseChildComponent implements OnInit, OnDestroy {

    vm: any = {
        categoryList1: null,
        categoryList2: null
    };

    rxAlive: boolean = true;

    bsModalRef: BsModalRef;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
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

    /**
     * vm 초기화
     */
    vmInit() {
        this.rxAlive = true;
        /*
        this.vm.categoryList1 = [ // TODO url 값이 필요함
          {id : '0', styleType : 'visa', categoryName : 'CATEGORY_ITEM_TITLE_TYPE1', url: ''}, // 비자
          {id : '1', styleType : 'insurance', categoryName : 'CATEGORY_ITEM_TITLE_TYPE2', url: ''}, // 여행자 보험
          {id : '2', styleType : 'wifi', categoryName : 'CATEGORY_ITEM_TITLE_TYPE3', url: ''}, // 와이파이
          {id : '3', styleType : 'car', categoryName : 'CATEGORY_ITEM_TITLE_TYPE4', url: ''}, // 전용차량
          {id : '4', styleType : 'train', categoryName : 'CATEGORY_ITEM_TITLE_TYPE5', url: ''}, // 열차예약
          {id : '5', styleType : 'restaurant', categoryName : 'CATEGORY_ITEM_TITLE_TYPE6', url: ''}, // 레스토랑
          {id : '6', styleType : 'cloth', categoryName : 'CATEGORY_ITEM_TITLE_TYPE7', url: ''}, // 외투보관
          {id : '7', styleType : 'tool', categoryName : 'CATEGORY_ITEM_TITLE_TYPE8', url: ''}, // 여행용품
          {id : '8', styleType : 'baggage', categoryName : 'CATEGORY_ITEM_TITLE_TYPE9', url: ''}, // 짐보관
          {id : '9', styleType : 'euro-train', categoryName : 'CATEGORY_ITEM_TITLE_TYPE10', url: ''} // 유럽열차
        ];

        this.vm.categoryList2 = [ // TODO url 값이 필요함
          {id : '0', styleType : 'sim', categoryName : 'CATEGORY_ITEM_TITLE_TYPE11', url: ''}, // 유심
          {id : '1', styleType : 'airport-pickup', categoryName : 'CATEGORY_ITEM_TITLE_TYPE12', url: ''}, // 공항픽업
          {id : '2', styleType : 'lounge', categoryName : 'CATEGORY_ITEM_TITLE_TYPE13', url: ''}, // 라운지
          {id : '3', styleType : 'coupon', categoryName : 'CATEGORY_ITEM_TITLE_TYPE14', url: ''}, // 할인쿠폰
          {id : '4', styleType : 'airport-train', categoryName : 'CATEGORY_ITEM_TITLE_TYPE15', url: ''}, // 공항 열차
          {id : '5', styleType : 'pet', categoryName : 'CATEGORY_ITEM_TITLE_TYPE16', url: ''}, // 애견 호텔
          {id : '6', styleType : 'carrier', categoryName : 'CATEGORY_ITEM_TITLE_TYPE17', url: ''}, // 캐리어 배송
          {id : '7', styleType : 'photo', categoryName : 'CATEGORY_ITEM_TITLE_TYPE18', url: ''}, // 스냅사진
          {id : '8', styleType : 'exchange', categoryName : 'CATEGORY_ITEM_TITLE_TYPE19', url: ''}, // 환전서비스
          {id : '9', styleType : 'parking', categoryName : 'CATEGORY_ITEM_TITLE_TYPE20', url: ''} // 공항주차
        ];
        */

        this.vm.categoryList1 = [
            { id: '0', styleType: 'visa', categoryName: 'CATEGORY_ITEM_TITLE_TYPE1', url: 'http://www.myvisa.co.kr/' }, // 비자
            { id: '1', styleType: 'insurance', categoryName: 'CATEGORY_ITEM_TITLE_TYPE2', url: 'https://www.chubb.com/kr-kr/' }, // 여행자 보험
            { id: '2', styleType: 'wifi', categoryName: 'CATEGORY_ITEM_TITLE_TYPE3', url: 'https://www.wifidosirak.com/v3/index.aspx' }, // 와이파이
            { id: '3', styleType: 'car', categoryName: 'CATEGORY_ITEM_TITLE_TYPE4', url: 'http://movv.co/' }, // 전용차량
            { id: '4', styleType: 'train', categoryName: 'CATEGORY_ITEM_TITLE_TYPE5', url: 'http://www.rts.co.kr/Hotel/B2BGlobal.aspx' }, // 열차예약
            { id: '5', styleType: 'restaurant', categoryName: 'CATEGORY_ITEM_TITLE_TYPE6', url: 'https://www.waug.com/ko/specials/fnb' }, // 레스토랑
            { id: '6', styleType: 'cloth', categoryName: 'CATEGORY_ITEM_TITLE_TYPE7', url: 'https://www.mrcoatroom.com/' } // 외투보관

        ];

        this.vm.categoryList2 = [
            { id: '0', styleType: 'tool', categoryName: 'CATEGORY_ITEM_TITLE_TYPE8', url: 'https://www.1300k.com/?from=GODOAD&gclid=CjwKCAjwkun1BRAIEiwA2mJRWRtUek9tXT5VeG1l-daQ91zPrwTBVNx-Lf3qKFpcH8XRXy4wUUhgvBoCKUEQAvD_BwE' }, // 여행용품
            { id: '1', styleType: 'baggage', categoryName: 'CATEGORY_ITEM_TITLE_TYPE9', url: 'https://www.safex.kr/?NaPm=ct%3Dka3om4m0%7Cci%3D0yO0003Rn%5FDsmTZ5b1iu%7Ctr%3Dsa%7Chk%3D49020b6cac7ecde2ee4f2ba9e5f8518a130caf04' }, // 짐보관
            { id: '2', styleType: 'photo', categoryName: 'CATEGORY_ITEM_TITLE_TYPE18', url: 'https://www.snaps.com/?NaPm=ct%3Dka3olfw5%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3D%7Chk%3Dd39419c17a682d031f85e0015dbec2a50dc2782a' }, // 스냅사진
            { id: '3', styleType: 'sim', categoryName: 'CATEGORY_ITEM_TITLE_TYPE11', url: 'https://www.usimstore.com/shop/' }, // 유심
            { id: '4', styleType: 'airport-pickup', categoryName: 'CATEGORY_ITEM_TITLE_TYPE12', url: 'https://www.kvantago.com/index.php/main/index?purpose=pick_up' }, // 공항픽업
            { id: '5', styleType: 'lounge', categoryName: 'CATEGORY_ITEM_TITLE_TYPE13', url: 'https://www.theloungemembers.com/kr/main/main.html?NaPm=ct%3Dka3oj4l4%7Cci%3D0BvI001Fn%5FDsQSyGHKWT%7Ctr%3Dsa%7Chk%3Da9466deb13e8b8707ecf217f671f02f96af52cf2' }, // 라운지
            { id: '6', styleType: 'coupon', categoryName: 'CATEGORY_ITEM_TITLE_TYPE14', url: 'https://www.jungfrau.co.kr/main/main.asp' } // 할인쿠폰
        ];
    }


    /**
     * 검색 카테고리 클릭
    */
    onGoCategorySearchClick($type, $index) {
        if (isPlatformBrowser(this.platformId)) {
            const url = ($type == '1') ? this.vm.categoryList1[$index].url : this.vm.categoryList2[$index].url;
            // window.open(url, target, feature, replace);
            // window.open("http://" + url);
            window.open(url);
        }
        // ngx-bootstrap config
        // const configInfo = {
        //     class: 'm-ngx-bootstrap-modal',
        //     animated: false
        // };
        // const initialState = {

        // };

        // this.bsModalService.show(TravelConvenienceSellerComponent, { initialState, ...configInfo });
    }

}
