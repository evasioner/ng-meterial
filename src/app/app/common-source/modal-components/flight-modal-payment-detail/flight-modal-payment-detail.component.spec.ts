import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalPaymentDetailComponent } from './flight-modal-payment-detail.component';

describe('FlightModalPaymentDetailComponent', () => {
  let component: FlightModalPaymentDetailComponent;
  let fixture: ComponentFixture<FlightModalPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
