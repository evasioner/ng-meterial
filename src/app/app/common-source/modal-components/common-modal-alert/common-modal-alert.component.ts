import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

@Component({
    selector: 'app-common-modal-alert',
    templateUrl: './common-modal-alert.component.html',
    styleUrls: ['./common-modal-alert.component.scss']
})
export class CommonModalAlertComponent implements OnInit {
    loadingBool: boolean = false;
    element: any;

    alertTitle: string;
    titleTxt: string;
    alertHtml: string;
    closeObj: any;
    okObj: any;
    cancelObj: any;

    isAlertTitle: boolean;
    isTitleTxt: boolean;
    isAlertHtml: boolean;
    isCloseObj: boolean;
    isOkObj: boolean;
    isCancelObj: boolean;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        public bsModalRef: BsModalRef) { }

    ngOnInit(): void {
        this.propertyInit();
        this.loadingBool = true;
        const bodyEl = this.document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    // 속성 초기
    propertyInit() {
        // console.info(`[initialState]
        //     - titleTxt: ${this.titleTxt}
        //     - alertHtml: ${this.alertHtml}
        //     - okObj: ${this.okObj}
        //     - cancelObj: ${this.cancelObj}
        //     `);

        this.isAlertTitle = _.has(this, 'alertTitle');
        this.isTitleTxt = _.has(this, 'titleTxt');
        this.isAlertHtml = _.has(this, 'alertHtml');
        this.isCloseObj = _.has(this, 'closeObj');
        this.isOkObj = _.has(this, 'okObj');
        this.isCancelObj = _.has(this, 'cancelObj');

        // console.info(`[initialState > is]
        //     - isTitleTxt: ${this.isTitleTxt}
        //     - isAlertHtml: ${this.isAlertHtml}
        //     - isOkObj: ${this.isOkObj}
        //     - isCancelObj: ${this.isCancelObj}
        //     `);

        if (!this.isAlertTitle) {
            this.alertTitle = '알림';
        }

        if (this.isOkObj) {
            if (!_.has(this.okObj, 'name')) {
                this.okObj['name'] = '확인';
            }
        } else {
            this.okObj = {
                name: '확인'
            };
        }

        if (this.isCancelObj) {
            if (!_.has(this.cancelObj, 'name')) {
                this.cancelObj['name'] = '취소';
            }
        } else {
            this.cancelObj = {
                name: '취소'
            };
        }

    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        if (this.closeObj && this.closeObj.fun) {
            this.closeObj.fun();
        }
        this.modalClose();
    }

    onOkClick() {
        console.info('[onOkClick]', this.okObj.fun);
        if (this.okObj && this.okObj.fun) {
            console.info('[this.okObj.fun]');
            this.okObj.fun();
        }
        this.modalClose();
    }

    onCancelClick() {
        if (this.cancelObj.fun) {
            this.cancelObj.fun();
        }
        this.modalClose();
    }
}
