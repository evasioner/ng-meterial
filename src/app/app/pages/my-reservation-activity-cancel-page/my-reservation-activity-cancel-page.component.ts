import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { Title, Meta } from '@angular/platform-browser';
import { BasePageComponent } from '../base-page/base-page.component';
import * as moment from 'moment';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import * as qs from 'qs';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-reservation-activity-cancel-page',
    templateUrl: './my-reservation-activity-cancel-page.component.html',
    styleUrls: ['./my-reservation-activity-cancel-page.component.scss']
})
export class MyReservationActivityCancelPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    tabNo: any;
    headerType: any;
    headerConfig: any;
    selectedAll: any;
    rxAlive: boolean = true;

    travelers: Array<any>;
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        super(platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();
        // this.selectTab(0);
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
            title: '예약취소',
            key: null
        };
    }

    // 전체선택 클릭
    allCheck() {
        for (let i = 0; i < this.travelers.length; i++) {
            this.travelers[i].selected = this.selectedAll;
        }
    }

    onCheck() {
        this.selectedAll = this.travelers.every(item => {
            return item.selected == true;
        });
    }

    callReservation(seltab) {
        const rqInfo = {
            seltab: seltab
            // locationAccept: this.vm.locationAccept,
            // locationReturn: this.vm.locationReturn,
            // locationReturnBool: this.vm.locationReturnBool,
            // formDateStr: this.vm.formDateStr, // 인수 날짜
            // formTimeVal: this.vm.formTimeVal,
            // toDateStr: this.vm.toDateStr, // 반납 날짜
            // toTimeVal: this.vm.toTimeVal,
            // rq: rq
        };
        const qsStr = qs.stringify(rqInfo);
        const path = '/mypage-reservation-list/' + seltab; // + qsStr;
        const extras = {
            relativeTo: this.route
        };
        console.log('path >>>>>', path);

        this.router.navigate([path], extras);
    }


}
