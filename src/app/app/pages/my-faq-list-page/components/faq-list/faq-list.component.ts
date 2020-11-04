import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-faq-list',
    templateUrl: './faq-list.component.html',
    styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent extends BaseChildComponent implements OnInit {
    loadingBool: Boolean = false;
    result: any;
    viewObj = {
        faqList: [{
            idx: null,
            postSeq: null,
            title: null,
            content: null
        }]
    };

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageInit();
    }

    selectDetail($event) {
        (<HTMLInputElement>$event.target).closest('div').classList.toggle('active');
    }

    pageInit() {
        const rqInfo =
        {
            'stationTypeCode': 'STN02',
            'currency': 'PSF',
            'language': 'EN',
            'condition': {
                'limits': [0, 10],
                'searchItem': 'A',
                'keyword': '테'
            }
        };
        this.callFaqListApi(rqInfo);
    }

    // API 호출 FAQ 리스트
    async callFaqListApi($rq) {
        this.loadingBool = false;
        this.result = await this.apiMypageService.POST_MYPAGE_FAQ($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[FAQ 리스트 > res]', res);

                if (res.succeedYn) {
                    this.loadingBool = true;
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
        this.renderView(this.result);
    }


    renderView(res) {
        console.info('res>>>>>>>>>', res);
        res.result.list.forEach((el, index) => {
            this.viewObj.faqList[index].idx = index;
            this.viewObj.faqList[index].postSeq = el.postSeq;
            this.viewObj.faqList[index].title = el.postTitle;
            const dtlCont = this.callFaqDetailApi(el.postSeq);
            this.viewObj.faqList[index].content = dtlCont;
            console.info('el>>>>>>>>>', el);
        });

    }

    async callFaqDetailApi(postSeq) {
        const $rq2 = {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'EN',
            'condition': {
                'postSeq': null
            }
        };
        $rq2.condition.postSeq = postSeq;
        this.loadingBool = false;
        await this.apiMypageService.POST_MYPAGE_FAQ_DETAIL($rq2)
            .toPromise()
            .then((res: any) => {
                console.info('[FAQ 리스트 > res]', res);

                if (res.succeedYn) {
                    this.loadingBool = true;
                    this.renderView(res);
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }

}

