import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalResearchComponent } from './flight-modal-research.component';

describe('FlightModalResearchComponent', () => {
    let component: FlightModalResearchComponent;
    let fixture: ComponentFixture<FlightModalResearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FlightModalResearchComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlightModalResearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
