import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalPriceAlarmComponent } from './flight-modal-price-alarm.component';

describe('FlightModalPriceAlarmComponent', () => {
  let component: FlightModalPriceAlarmComponent;
  let fixture: ComponentFixture<FlightModalPriceAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalPriceAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalPriceAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
