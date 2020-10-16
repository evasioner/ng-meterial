import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '@/environments/environment';

import * as _ from 'lodash';
import { AgreementEnums } from '../../../../pages/my-agreement-list-page/enums/agreement-enums.enums';
import { ApiCommonService } from '../../../../api/common/api-common.service';

@Component({
  selector: 'app-rent-modal-agreement',
  templateUrl: './rent-modal-agreement.component.html',
  styleUrls: ['./rent-modal-agreement.component.scss']
})
export class RentModalAgreementComponent extends BaseChildComponent implements OnInit, OnDestroy {
  storeId: any;
  rxAlive: boolean = true;

  okFun: any;

  element: any;

  private subscriptionList: Subscription[];
  private dataModel: any;
  public viewModel: any;
  resolveData: any;

  constructor(
    @Inject(PLATFORM_ID) public platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private store: Store<any>,
    public translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public bsModalRef: BsModalRef,
    private ApiCommonService: ApiCommonService,
  ) {
    super(platformId);
    this.element = this.el.nativeElement;
    this.initialize();
  }

  ngOnInit(): void {
    super.ngOnInit();
    const bodyEl = document.getElementsByTagName('body')[0];
    bodyEl.classList.add('overflow-none');
    this.subscriptionList.push(
      this.route.data
        .pipe(take(1))
        .subscribe(
          (data: any) => {
            console.info('[1. route 통해 데이터 전달 받기]', data);
            this.resolveData = _.cloneDeep(data.resolveData);
            this.pageInit();
          }
        )
    );
  }

  ngOnDestroy() {
    this.rxAlive = false;
    const bodyEl = document.getElementsByTagName('body')[0];
    bodyEl.classList.remove('overflow-none');
  }

  modalClose() {
    const bodyEl = document.getElementsByTagName('body')[0];
    bodyEl.classList.remove('overflow-none');
    this.bsModalRef.hide();
  }

  onCloseClick() {
    console.info('모달 닫기');
    this.modalClose();
  }

  onOkClick(e) {
    this.okFun(this.storeId);
    this.modalClose();
  }

  onTabClick(e, $storeId) {
    console.info('[일반규정 클릭]', $storeId, e);
    this.storeId = $storeId;
  }
  initialize() {
    this.dataModel = {};
    this.viewModel = {
      common: '',
      cancel: '',
      personal: ''
    };
    this.subscriptionList = [];

  }
  getApiList(rq) {
    this.subscriptionList.push(
      this.ApiCommonService.POST_TERMS(rq)
        .subscribe(
          (resp: any) => {
            if (resp.succeedYn) {
              this.dataModel.response = _.cloneDeep(resp.result);
              this.dataModel.transactionSetId = resp.transactionSetId;
              this.viewModel = this.dataModel.response;
              this.setViewModel();

            }
          },
          (error: any) => {
            console.info('[error]', error);
          }
        )
    );
  }

  setViewModel() {
    console.log('제대로 내려오고 있나요? ', this.dataModel);
    this.viewModel = {
      common: this.dataModel.response.terms[0].termsDetail,
      cancel: this.dataModel.response.terms[1].termsDetail,
      personal: this.dataModel.response.terms[2].termsDetail
    };
  }


  /**
   * 페이지 초기화
   *  api 호출 (
   * @param resolveData
   */
  pageInit() {

    const rqInfo =
    {
      stationTypeCode: environment.STATION_CODE,
      currency: 'KRW',
      language: 'KO',
      condition: {
        chorusTermsCode: [
          AgreementEnums.PERSONAL,
          AgreementEnums.INHERENT,
          AgreementEnums.PERSONALAGREE,
          AgreementEnums.RENT_COMFIRM_D,
          AgreementEnums.RENT_COMFIRM_I,
          AgreementEnums.RENT_SPEC_D,
          AgreementEnums.RENT_SPEC_I,
        ]
      }
    };
    console.log(rqInfo, 'rqInfo');

    this.getApiList(rqInfo);
  }

}
