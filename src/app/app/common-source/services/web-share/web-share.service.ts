import { Injectable } from '@angular/core';

import { Share } from './models/web-share.model';

@Injectable({
    providedIn: 'root'
})
export class WebShareService {
    navigatorShare: any;

    constructor() {
        this.navigatorShare = window.navigator;
    }

    public webShare(shareInfo: Share): void {
        if (this.navigatorShare && this.navigatorShare.share) {
            this.navigatorShare.share(shareInfo)
                .then(
                    () => {
                        return console.log('공유 성공');
                    }
                ).catch(
                    (error: any) => {
                        return console.log('실패', error);
                    }
                );
        } else {
            alert('현재 브라우저는 공유기능을 지원하지 않습니다.');
        }
    }
}
