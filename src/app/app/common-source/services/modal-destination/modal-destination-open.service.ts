import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationOpen } from '../../insterfaces/destination-open';
import { UtilBase64Service } from '../util-base64/util-base64.service';

@Injectable({
    providedIn: 'root'
})
export class ModalDestinationOpenService {

    constructor(
        private router: Router,
        private base64Svc: UtilBase64Service
    ) { }

    /**
     * 팝업 오픈
     * @param $obj
     */
    open($obj: DestinationOpen, $route: ActivatedRoute) {
        const base64Str = this.base64Svc.base64EncodingFun($obj);
        const path = 'modal-destination/' + base64Str;
        const extras = {
            relativeTo: $route
        };
        this.router.navigate([path], extras);
    }
}
