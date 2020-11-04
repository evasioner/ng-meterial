import { Component, ElementRef, EventEmitter, Inject, Input, Output, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
declare var Slider: any;

@Component({
    selector: 'app-input-slider',
    templateUrl: './input-slider.component.html',
    styleUrls: ['./input-slider.component.scss']
})
export class InputSliderComponent implements AfterViewInit {
    @Input() htmlTarget: any;

    //---------------------------------------[기본 요소 적용 안됨]
    @Input()
    set style(value: any) {
        if (this.slider) {
            this.slider.getElement().style = value;
        } else {
            this.initialStyle = value;
        }
    }

    //---------------------------------------[end 기본 요소 적용 안됨]

    //---------------------------------------[양방향 바인딩]
    @Input()
    set value(value: number | any[]) {
        if (this.slider) {
            this.slider.setValue(value);
        } else {
            this.initialOptions.value = value;
        }
    }

    @Output() valueChange = new EventEmitter();
    //---------------------------------------[end 양방향 바인딩]

    //---------------------------------------[기본 요소 적용]
    @Input()
    set min(value: number) {
        this.changeAttribute('min', value);
    }

    @Input()
    set max(value: number) {
        this.changeAttribute('max', value);
    }

    @Input()
    set step(value: number) {
        this.changeAttribute('step', value);
    }

    @Input()
    set precision(value: number) {
        this.changeAttribute('precision', value);
    }

    @Input()
    set orientation(value: string) {
        this.changeAttribute('orientation', value);
    }

    @Input()
    set range(value: boolean) {
        this.changeAttribute('range', value);
    }

    @Input()
    set selection(value: string) {
        this.changeAttribute('selection', value);
    }

    @Input()
    set tooltip(value: string) {
        this.changeAttribute('tooltip', value);
    }

    @Input()
    set tooltipSplit(value: boolean) {
        this.changeAttribute('tooltip_split', value);
    }

    @Input()
    set tooltipPosition(value: boolean) {
        this.changeAttribute('tooltipPosition', value);
    }

    @Input()
    set handle(value: string) {
        this.changeAttribute('handle', value);
    }

    @Input()
    set reversed(value: boolean) {
        this.changeAttribute('reversed', value);
    }

    @Input()
    set rtl(value: boolean) {
        this.changeAttribute('rtl', value);
    }

    @Input()
    set enabled(value: boolean) {
        this.changeAttribute('enabled', value);
    }

    @Input()
    set naturalArrowKeys(value: boolean) {
        this.changeAttribute('natural_arrow_keys', value);
    }

    @Input()
    set ticks(value: any[]) {
        this.changeAttribute('ticks', value);
    }

    @Input()
    set ticksPositions(value: number[]) {
        this.changeAttribute('ticks_positions', value);
    }

    @Input()
    set ticksLabels(value: string[]) {
        this.changeAttribute('ticks_labels', value);
    }

    @Input()
    set ticksSnapBounds(value: number) {
        this.changeAttribute('ticks_snap_bounds', value);
    }

    @Input()
    set ticksTooltip(value: boolean) {
        this.changeAttribute('ticks_tooltip', value);
    }

    @Input()
    set scale(value: string) {
        this.changeAttribute('scale', value);
    }

    @Input()
    set labelledBy(value: string[]) {
        this.changeAttribute('labelledby', value);
    }

    @Input()
    set rangeHighlights(value: any[]) {
        this.changeAttribute('rangeHighlights', value);
    }

    //---------------------------------------[end 기본 요소 적용]

    //---------------------------------------[이벤트 요소]
    @Output() slide = new EventEmitter();

    @Output() slideStart = new EventEmitter();

    @Output() slideStop = new EventEmitter();

    @Output() change = new EventEmitter();
    //---------------------------------------[end 이벤트 요소]


    element: any;
    $tgSlider: any;
    tgSliderElement: any;

    slider: any; // 슬라이더 객체
    initialOptions: any = {};
    initialStyle: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private el: ElementRef) {
        this.element = this.el.nativeElement;
    }

    ngAfterViewInit(): void {
        console.info('[슬라이더 > ngAfterViewInit]');
        this.$tgSlider = this.element.querySelectorAll(`[data-target="${this.htmlTarget}"]`);
        this.tgSliderElement = this.$tgSlider[0];

        console.info('[tgSlider]', this.tgSliderElement);

        this.sliderInit();
    }

    sliderInit() {
        this.slider = new Slider(this.tgSliderElement, this.initialOptions);
        this.prepareSlider();
    }

    /**
     * 새로고침
     */
    private prepareSlider() {
        // 새로고침 할때마다 이벤트 설정 다시 셋팅
        this.addChangeListeners();

        // 스타일 추가
        this.slider.getElement().style = this.initialStyle;
    }

    private addChangeListeners() {
        this.slider.on('slide', (value: any) => {
            this.slide.emit(value);
        });

        this.slider.on('slideStart', (value: any) => {
            this.slideStart.emit(value);
        });

        this.slider.on('slideStop', (value: any) => {
            this.slideStop.emit(value);
        });

        this.slider.on('change', (event: any) => {
            this.change.emit(event);
            this.valueChange.emit(event.newValue);
        });
    }

    private changeAttribute(name: string, value: any) {
        if (this.slider) {
            this.slider.setAttribute(name, value);
            this.slider.refresh();
            this.prepareSlider();
        } else {
            this.initialOptions[name] = value;
        }
    }

}
