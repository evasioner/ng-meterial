import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiAlert } from '../../models/common/api-alert.model';
import { PageUrl, PageUrlList } from '../../models/common/url.model';

import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ApiAlertService {
    private nowUrl: string;
    private urlList: PageUrl[];

    constructor(
        private router: Router,
        private bsModalService: BsModalService,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.iniitialize();
    }

    private iniitialize() {
        this.nowUrl = this.router.url;
        this.urlList = PageUrlList;
    }

    public showApiAlert(message?: string): void {
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        if (!message) {
            message = '요청하신 서비스를 처리하는 도중에 일시적인 시스템 에러가 발생하였습니다.';
        }

        const initialState: ApiAlert = {
            titleTxt: message,
            okObj: {
                fun: () => {
                    this.returnMain();
                }
            }
        };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    public returnMain = () => {
        const flag: boolean = true;
        let returnUrl: string = '';
        this.urlList.map(
            (item: PageUrl) => {
                if (flag && _.startsWith(this.nowUrl, item.url)) {
                    returnUrl = item.returnUrl;
                }
            }
        );
        window.location.replace(returnUrl);
    };

    public goBackApiAlert(message?: string): void {
        if (!message) {
            message = '요청하신 서비스를 처리하는 도중에 일시적인 시스템 에러가 발생하였습니다.';
        }

        const initialState = {
            titleTxt: message,
            closeObj: {
                fun: () => {
                    this.router
                        .navigateByUrl(`/`, { skipLocationChange: true })
                        .then(() => {
                            this.router.navigateByUrl(
                                this.route.snapshot['_routerState'].url
                            );
                        });
                },
            },
            okObj: {
                fun: () => {
                    this.location.back();
                }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false,
            keyboard: false
        };
        this.bsModalService.show(CommonModalAlertComponent, {
            initialState,
            ...configInfo,
        });
    }
}
