import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalPaymentComponent } from './flight-modal-payment.component';

describe('FlightModalPaymentComponent', () => {
  let component: FlightModalPaymentComponent;
  let fixture: ComponentFixture<FlightModalPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
