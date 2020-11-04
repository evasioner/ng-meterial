import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilUrlService {

    constructor() { }

    getOrigin() {
        return window.location.protocol + '//'
            + window.location.hostname
            + (window.location.port ? ':' + window.location.port : '');
    }
}
