import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ApiInterceptorService implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // let request: HttpRequest<any> = req.clone({
        //   setHeaders: {
        //     'Content-Type': 'application/json;charset=UTF-8'
        //   }
        // });

        const request: HttpRequest<any> = req.clone();

        // console.log('[Intercepted HTTP call]', request);

        return next.handle(request)
            .pipe(
                catchError(e => {
                    /**
                     * 공통 에러 처리 영역
                     */

                    return throwError(e);
                }) // end pipe
            );

        // return next.handle(request);
    }

}
