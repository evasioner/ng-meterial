/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalEuropeComponent } from './rent-modal-europe.component';

describe('RentModalEuropeComponent', () => {
    let component: RentModalEuropeComponent;
    let fixture: ComponentFixture<RentModalEuropeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RentModalEuropeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RentModalEuropeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
