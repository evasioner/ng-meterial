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
  selector: 'app-flight-modal-agreement',
  templateUrl: './flight-modal-agreement.component.html',
  styleUrls: ['./flight-modal-agreement.component.scss']
})
export class FlightModalAgreementComponent extends BaseChildComponent implements OnInit, OnDestroy {
  rxAlive: boolean = true;

  okFun: any;

  element: any;

  public storeId: any;
  public rs: any;
  public baggageList: Array<string>;
  public viewModel: any;
  private subscriptionList: Subscription[];
  private dataModel: any;
  resolveData: any;

  constructor(
    @Inject(PLATFORM_ID) public platformId: object,
    public translateService: TranslateService,
    public bsModalRef: BsModalRef,
    private route: ActivatedRoute,
    private ApiCommonService: ApiCommonService,

  ) {
    super(platformId);
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
            this.rs = _.cloneDeep(data.resolveData);
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

  private initialize() {
    this.viewModel = {
      fareRuleList: this.rs.result.list.map(
        (listItem: any) => {
          return {
            segmentTitle: `${listItem.origin.cityNameLn} ${listItem.origin.airportCode} - ${listItem.destination.cityNameLn} ${listItem.destination.airportCode}`,
            ruleList: listItem.fareRules.map(
              (fareItem: any) => {
                return {
                  title: fareItem.ruleTitle,
                  description: fareItem.description
                };
              }
            )
          };
        }
      )
    };
  }

  modalClose() {
    const bodyEl = document.getElementsByTagName('body')[0];
    bodyEl.classList.remove('overflow-none');
    this.bsModalRef.hide();
  }

  onCloseClick(event: MouseEvent) {
    event && event.preventDefault();
    console.info('모달 닫기');
    this.modalClose();
  }

  onOkClick(event: MouseEvent) {
    event && event.preventDefault();
    this.okFun(this.storeId);
    this.modalClose();
  }

  onTabClick(event: MouseEvent, $storeId) {
    // event && event.preventDefault();
    console.info('[Tab 클릭]', this.storeId);
    this.storeId = $storeId;
  }
  getApiList(rq) {
    this.subscriptionList.push(
      this.ApiCommonService.POST_TERMS(rq)
        .subscribe(
          (resp: any) => {
            if (resp.succeedYn) {
              // this.dataModel.response = _.cloneDeep(resp.result);
              // this.dataModel.transactionSetId = resp.transactionSetId;
              // this.viewModel = this.dataModel.response;
              // this.setViewModel();

            }
          },
          (error: any) => {
            console.info('[error]', error);
          }
        )
    );
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
          AgreementEnums.HOTEL_SPEC,
          AgreementEnums.HOTEL_COMFIRM,
          AgreementEnums.HOTEL_CANCEL,
        ]
      }
    };
    console.log(rqInfo, 'rqInfo');

    this.getApiList(rqInfo);
  }
}

