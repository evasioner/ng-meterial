import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { InicisPayment } from '@/app/common-source/models/payment/inicis-payment.model';


@Injectable({
    providedIn: 'root'
})
export class InicisPaymentService {
    baseUrl: string;


    constructor(
        private http: HttpClient
    ) {
        this.baseUrl = environment.inicisPayUrl;
    }

    public openInicisPayment(paymentInfo: InicisPayment): Observable<Object> {
        const body: string = (Object.entries(paymentInfo).map(i => [i[0], encodeURIComponent(i[1])].join('=')).join('&'));
        return this.http.post(
            `${this.baseUrl}`,
            body,
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            }
        );
    }
}
