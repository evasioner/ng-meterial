import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderTypes } from '../../enums/header-types.enum';

@Directive({
    selector: '[appHeaderFixed]'
})
export class HeaderFixedDirective {
    private classFixed: boolean;

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {

        const pos = (document.documentElement.scrollTop || document.body.scrollTop);

        if (!this.classFixed && pos > HeaderTypes.HEADFIXE) {
            this.classFixed = true;
            this.addFixed();
        }

        if (this.classFixed && pos < HeaderTypes.HEADFIXE) {
            this.classFixed = false;
            this.removeFixed();
        }
    }

    constructor(
        private renderer: Renderer2,
        private hostElement: ElementRef,
        private router: Router
    ) {
        this.classFixed = false;

        console.log(this.router);

    }

    /**
     * addFixed
     * fixed 클래스 추가
     */
    private addFixed(): void {
        this.renderer.addClass(this.hostElement.nativeElement, 'fixed');
    }

    /**
     * removeFixed
     * fixed 클래스 제거
     */
    private removeFixed(): void {
        this.renderer.removeClass(this.hostElement.nativeElement, 'fixed');
    }

}