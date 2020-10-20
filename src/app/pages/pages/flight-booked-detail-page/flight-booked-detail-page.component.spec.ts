import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookedDetailPageComponent } from './flight-booked-detail-page.component';

describe('FlightBookedDetailPageComponent', () => {
  let component: FlightBookedDetailPageComponent;
  let fixture: ComponentFixture<FlightBookedDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBookedDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBookedDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
