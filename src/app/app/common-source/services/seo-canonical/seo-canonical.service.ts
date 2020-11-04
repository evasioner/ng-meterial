import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SeoCanonicalService {

    constructor(@Inject(DOCUMENT) private dom) { }

    setCanonicalURL(url?: string) {
        const canURL = url == undefined ? this.dom.URL : url;
        const link: HTMLLinkElement = this.dom.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.dom.head.appendChild(link);
        link.setAttribute('href', canURL);
    }
}
