import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';

import * as qs from 'qs';

@Injectable({
    providedIn: 'root'
})
export class MyComQsResolveService {

    constructor() { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        const id: string = route.paramMap.get('id');
        const decodeData = qs.parse(id);
        console.info('[decodeData]', decodeData);

        const res = true;
        if (res) {
            return of(decodeData);
        } else {
            return EMPTY;
        }

    } // end resolve
}
