import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCustomerEventComponent } from './flight-customer-event.component';

describe('FlightCustomerEventComponent', () => {
  let component: FlightCustomerEventComponent;
  let fixture: ComponentFixture<FlightCustomerEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightCustomerEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCustomerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
